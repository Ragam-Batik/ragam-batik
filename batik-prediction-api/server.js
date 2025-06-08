require('dotenv').config();
const createServer = require('./src/app');

const init = async () => {
  try {
    const server = await createServer();
    await server.start();
    console.log('🚀 Server running on %s', server.info.uri);

    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      await server.stop({ timeout: 10000 });
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});

init();
