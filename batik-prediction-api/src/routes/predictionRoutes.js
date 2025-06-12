const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/auth');

const predictionRoutes = [
  {
    method: 'POST',
    path: '/api/predict',
    options: {
      pre: [{ method: authMiddleware }],
      payload: {
        maxBytes: 10485760, 
        output: 'stream',
        parse: true,
        multipart: true
      },
      validate: {
      }
    },
    handler: predictionController.predict
  }
];

module.exports = predictionRoutes;
