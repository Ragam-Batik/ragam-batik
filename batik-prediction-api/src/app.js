const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const authRoutes = require('./routes/authRoutes');
const motifRoutes = require('./routes/motifRoutes');
const historyRoutes = require('./routes/historyRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      files: {
        relativeTo: process.cwd()
      }
    }
  });

  await server.register([
    Inert
  ]);

  server.route([
    ...authRoutes,
    ...motifRoutes,
    ...historyRoutes,
    ...predictionRoutes
  ]);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
   
    if (response.isBoom) {
      const error = response;
      const statusCode = error.output.statusCode;
     
      console.error('API Error:', {
        statusCode,
        message: error.message,
        path: request.path,
        method: request.method
      });

      return h.response({
        status: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
          details: error.data
        })
      }).code(statusCode);
    }

    return h.continue;
  });

  server.route({
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
      return {
        status: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        tfjs_model: process.env.TFJS_MODEL_URL
      };
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        status: true,
        message: 'Batik Prediction API - Serverless',
        version: '1.0.0',
        deployment: 'AWS Lambda',
        endpoints: {
          auth: '/api/auth',
          motif: '/api/motif',
          history: '/api/history',
          prediction: '/api/predict'
        }
      };
    }
  });

  return server;
};

module.exports = createServer;