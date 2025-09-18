const path = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');

// Load env vars from backend/.env first, then fall back to repo root
dotenv.config({ path: path.resolve(__dirname, '.env') });
if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const app = require('./src/app');
const logger = require('./src/utils/logger');
const notFoundHandler = require('./src/middleware/not-found');
const errorHandler = require('./src/middleware/error-handler');

const PORT = process.env.PORT || 5050;
const buildPath = path.join(__dirname, '..', 'frontend', 'build');

// Warn if JWT_SECRET missing
if (!process.env.JWT_SECRET) {
  logger.warn('JWT_SECRET is not configured after loading environment files. Auth will fail.');
}

// ✅ Serve React frontend only if build exists
if (fs.existsSync(buildPath)) {
  logger.info('Serving React build', { buildPath });

  // Serve static files
  app.use(express.static(buildPath));

  // Let API routes work normally
  app.use('/api', require('./src/routes'));

  // All non-API routes → React
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  logger.warn('React build directory not found; API only mode', { buildPath });
  // Still register API routes so backend works in dev
  app.use('/api', require('./src/routes'));
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Taylor-Made API listening on port ${PORT}`);
});

module.exports = server;