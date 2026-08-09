import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from './modules/config-manager/env.schema';
const env = validateEnv();

import http from 'http';
import app from './app';
import { initWebSocket } from './websocket/socket';
import { config, stateStore } from './container';
import { DatabaseClient } from './modules/database/PrismaClient';

const appConfig = config.getConfig();
const PORT = process.env.PORT || appConfig.app.port || 5000;

const server = http.createServer(app);

// Attach WS
initWebSocket(server);

const startServer = () => {
  server.listen(PORT, () => {
    console.log('\n====================================');
    console.log('AI Interview Agent Started');
    console.log(`Environment: ${appConfig.app.env || 'Development'}`);
    console.log(`Port: ${PORT}`);
    console.log('Express Ready');
    console.log('Socket Ready');
    console.log('Database Connected');
    console.log('Redis Connected');
    console.log('Configuration Loaded');
    console.log('====================================\n');
  });
};

startServer();

// Graceful Shutdown
const shutdown = async () => {
  console.log('\nShutting down AI Interview Agent...');
  
  try {
    await stateStore.shutdown();
    console.log('Redis connection closed.');
  } catch (err) {
    console.error('Error closing Redis connection:', err);
  }

  try {
    const prisma = DatabaseClient.getInstance();
    await prisma.$disconnect();
    console.log('PostgreSQL connection closed.');
  } catch (err) {
    console.error('Error closing PostgreSQL connection:', err);
  }

  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
