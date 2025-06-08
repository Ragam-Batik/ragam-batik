const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const { data, classLabels, classToKey } = require('../data/dictionary');
const s3Service = require('./s3Service');
const supabase = require('../config/supabase');
const Boom = require('@hapi/boom');

class PredictionService {
  constructor() {
    this.model = null;
    this.modelUrl = './model/model.json';
    this.confidenceThreshold = 0.7; // 70%
  }

  async loadModel() {
    if (!this.model) {
      try {
        console.log('Loading TensorFlow.js Graph Model...');
        this.model = await tf.loadGraphModel(this.modelUrl);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Model loading error:', error);
        throw Boom.internal('Failed to load prediction model');
      }
    }
    return this.model;
  }

  async preprocessImage(imageBuffer) {
    try {
      const resizedBuffer = await sharp(imageBuffer)
        .resize(224, 224)
        .jpeg({ quality: 90 })
        .toBuffer();

      const imageTensor = tf.node.decodeImage(resizedBuffer, 3)
        .expandDims(0)
        .cast('float32')
        .div(255.0);

      return imageTensor;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw Boom.badRequest('Failed to process image');
    }
  }

  async findMotifByClassName(className) {
    try {
      // Convert class name format: "aceh_pintu_aceh" -> "pintu aceh"
      const searchTerms = className.replace(/^[a-z]+_/, '').replace(/_/g, ' ');
      
      console.log('Searching motif for:', searchTerms);
      
      const { data: motifs, error } = await supabase
        .from('motif_batik')
        .select('*')
        .ilike('name', `%${searchTerms}%`)
        .limit(1);

      if (error) {
        console.error('Database search error:', error);
        return null;
      }

      if (motifs && motifs.length > 0) {
        console.log('Found motif in database:', motifs[0]);
        return motifs[0];
      }

      console.log('No motif found in database for:', searchTerms);
      return null;
    } catch (error) {
      console.error('Error finding motif:', error);
      return null;
    }
  }

  async predict(imageBuffer, userId, originalFileName) {
    try {
      await this.loadModel();

      const imageTensor = await this.preprocessImage(imageBuffer);

      const predictions = await this.model.predict(imageTensor);
      const predictionData = await predictions.data();

      const predictedIndex = predictions.argMax(-1).dataSync()[0];
      const confidence = predictionData[predictedIndex];

      console.log('Predicted Index:', predictedIndex);
      console.log('Confidence:', confidence);
      console.log('Available classToKey keys:', Object.keys(classToKey));

      imageTensor.dispose();
      predictions.dispose();

      if (confidence < this.confidenceThreshold) {
        return {
          success: false,
          message: 'Gambar yang diupload kemungkinan bukan batik atau tingkat kepercayaan prediksi terlalu rendah',
          confidence: Math.round(confidence * 100),
          threshold: Math.round(this.confidenceThreshold * 100)
        };
      }

      // Dapatkan class name dari model
      const motifKey = classToKey[predictedIndex];
      const predictedClass = classLabels[predictedIndex];
      
      console.log('Motif Key:', motifKey);
      console.log('Predicted Class Name:', predictedClass);

      // Mencari motif di database berdasarkan class name
      const databaseMotif = await this.findMotifByClassName(motifKey);
      
      let motifData;
      let actualMotifId;

      if (databaseMotif) {
        motifData = databaseMotif;
        actualMotifId = databaseMotif.id;
        console.log('Using database motif ID:', actualMotifId);
      } else {
        // Fallback ke dictionary data
        motifData = data[motifKey];
        actualMotifId = null; // Set null jika tidak ada di database
        console.log('Using dictionary data, motif_id will be null');
        
        if (!motifData) {
          console.error('Motif data not found for key:', motifKey);
          throw Boom.internal('Motif data not found for predicted class');
        }
      }

      const uploadResult = await s3Service.uploadImage(imageBuffer, originalFileName, userId);

      // Conditional insert berdasarkan apakah motif ada di database
      const historyData = {
        user_id: userId,
        motif_name: motifData.name || predictedClass,
        provinsi: motifData.provinsi || 'Unknown',
        description: motifData.description || 'No description available',
        occasion: motifData.occasion || 'General use',
        confidence_score: Math.round(confidence * 100),
        image_url: uploadResult.url
      };

      // Apabila motif_id jika ada di database
      if (actualMotifId) {
        historyData.motif_id = actualMotifId;
      }

      console.log('Saving history data:', historyData);

      const { data: savedHistory, error: dbError } = await supabase
        .from('scan_histories')
        .insert(historyData)
        .select()
        .single();

      if (dbError) {
        console.error('Database save error:', dbError);
        await s3Service.deleteImage(uploadResult.key);
        throw Boom.internal('Failed to save prediction history');
      }

      return {
        success: true,
        prediction: {
          motif_id: actualMotifId || motifKey,
          motif_name: motifData.name || predictedClass,
          provinsi: motifData.provinsi || 'Unknown',
          confidence: Math.round(confidence * 100),
          predicted_class: predictedClass
        },
        motif_data: motifData,
        image_url: uploadResult.url,
        history_id: savedHistory.id
      };

    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      console.error('Prediction error:', error);
      throw Boom.internal('Prediction failed');
    }
  }

  async getPredictionHistory(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { data: histories, error, count } = await supabase
        .from('scan_histories')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Get history error:', error);
        throw Boom.internal('Failed to get prediction history');
      }

      return {
        data: histories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: offset + limit < count,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      console.error('Get prediction history error:', error);
      throw Boom.internal('Failed to get prediction history');
    }
  }

  async deleteHistory(historyId, userId) {
    try {
      const { data: history, error: getError } = await supabase
        .from('scan_histories')
        .select('image_url')
        .eq('id', historyId)
        .eq('user_id', userId)
        .single();

      if (getError || !history) {
        throw Boom.notFound('History not found');
      }

      const { error: deleteError } = await supabase
        .from('scan_histories')
        .delete()
        .eq('id', historyId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Delete history error:', deleteError);
        throw Boom.internal('Failed to delete history');
      }

      if (history.image_url) {
        try {
          const key = history.image_url.split('.amazonaws.com/')[1];
          await s3Service.deleteImage(key);
        } catch (s3Error) {
          console.error('S3 delete error (non-critical):', s3Error);
        }
      }

      return { message: 'History deleted successfully' };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      console.error('Delete history error:', error);
      throw Boom.internal('Failed to delete history');
    }
  }
}

module.exports = new PredictionService();