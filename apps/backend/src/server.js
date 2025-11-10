import app from './app.js';
import config from './config.js';
import prisma from './db/prismaClient.js';
import { logInfo } from './utils/logger.js';

const PORT = config.port || 5050;

const server = app.listen(PORT, () => {
  logInfo(`✅ Taylor-Made Baby Co API live on port ${PORT}`);
});

const gracefulShutdown = async (signal) => {
  logInfo(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});

export default server;
