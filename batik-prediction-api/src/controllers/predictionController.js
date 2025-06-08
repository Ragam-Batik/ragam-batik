const predictionService = require('../services/predictionServices');
const Boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

class PredictionController {
  async predict(request, h) {
      try {
        const { image } = request.payload; // file stream multipart
      const userId = request.auth.user.id;

      if (!image || !image.hapi) {
        throw Boom.badRequest('Image file is required');
      }

      const uploadDir = path.join(__dirname, '../uploads');

      // Buat folder uploads jika belum ada
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = image.hapi.filename || 'upload.tmp';
      const savePath = path.join(uploadDir, filename);

      // Simpan file sementara
      const fileStream = fs.createWriteStream(savePath);

      await new Promise((resolve, reject) => {
        image.pipe(fileStream);
        image.on('end', () => resolve());
        image.on('error', (err) => reject(err));
      });

      const imageBuffer = fs.readFileSync(savePath);

      // Panggil service predict
      const result = await predictionService.predict(imageBuffer, userId, filename);

      // Hapus file sementara
      fs.unlink(savePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });

      return h.response({
        status: result.success,
        message: result.success ? 'Prediction successful' : result.message,
        data: result.success
          ? {
              confidence: result.prediction.confidence,
              threshold: Math.round(predictionService.confidenceThreshold * 100),
              prediction: result.prediction,
              motifData: result.motif_data,
              imageUrl: result.image_url,
              historyId: result.history_id
            }
          : null
      }).code(result.success ? 200 : 400);

    } catch (error) {
      console.error(error);
      throw Boom.internal('Failed to process prediction');
    }
  }
}

module.exports = new PredictionController();