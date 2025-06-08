const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/auth');

const predictionRoutes = [
  {
    method: 'POST',
    path: '/api/predict',
    options: {
      pre: [{ method: authMiddleware }],
      payload: {
        maxBytes: 10485760, // 10MB
        output: 'stream',   // agar menerima file sebagai stream
        parse: true,        // parsing multipart/form-data
        multipart: true
      },
      validate: {
        // Validasi bisa ditambahkan di sini bila perlu
      }
    },
    handler: predictionController.predict
  }
];

module.exports = predictionRoutes;
