const serverless = require('serverless-http');
const createServer = require('./src/app');

let handler;

exports.lambdaHandler = async (event, context) => {
  if (!handler) {
    const server = await createServer();
    handler = serverless(server.listener);
  }
  return handler(event, context);
};
