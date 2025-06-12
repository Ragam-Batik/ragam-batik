const predictionService = require('../services/predictionServices');
const Boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

class PredictionController {
  async predict(request, h) {
    try {
      const { image } = request.payload;
      const userId = request.auth.user.id;

      if (!image || !image.hapi) {
        throw Boom.badRequest('Image file is required');
      }

      // Gunakan /tmp agar compatible ketika deploy di AWS Lambda with ECR (read-write allowed)
      const tempDir = '/tmp';
      const filename = `${Date.now()}-${image.hapi.filename || 'upload.tmp'}`;
      const savePath = path.join(tempDir, filename);

      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(savePath);
        image.pipe(fileStream);
        image.on('end', resolve);
        image.on('error', reject);
      });

      const imageBuffer = fs.readFileSync(savePath);

      const result = await predictionService.predict(imageBuffer, userId, filename);

      fs.unlink(savePath, (err) => {
        if (err) console.error('Failed to delete temporary file:', err);
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
      console.error('Prediction error:', error);
      throw Boom.internal('Failed to process prediction');
    }
  }
}

module.exports = new PredictionController();
