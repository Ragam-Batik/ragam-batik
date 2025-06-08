const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

// Routes
const authRoutes = require('./routes/authRoutes');
const motifRoutes = require('./routes/motifRoutes');
const historyRoutes = require('./routes/historyRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      files: {
        relativeTo: __dirname
      }
    }
  });

  await server.register([Inert]);

  server.route([
    ...authRoutes,
    ...motifRoutes,
    ...historyRoutes,
    ...predictionRoutes
  ]);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      const statusCode = response.output.statusCode;
      return h.response({
        status: false,
        message: response.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: response.stack,
          details: response.data
        })
      }).code(statusCode);
    }
    return h.continue;
  });

  server.route([
    {
      method: 'GET',
      path: '/health',
      handler: () => ({
        status: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      })
    },
    {
      method: 'GET',
      path: '/',
      handler: () => ({
        status: true,
        message: 'Batik Prediction API',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          motif: '/api/motif',
          history: '/api/history',
          prediction: '/api/predict'
        }
      })
    }
  ]);

  return server;
};

module.exports = createServer;
