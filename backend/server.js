require('dotenv').config();

const path = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');

const app = require('./src/app');
const logger = require('./src/utils/logger');
const notFoundHandler = require('./src/middleware/not-found');
const errorHandler = require('./src/middleware/error-handler');

const PORT = process.env.PORT || 5050;
const buildPath = path.join(__dirname, '..', 'frontend', 'build');

if (fs.existsSync(buildPath)) {
  logger.info('Serving React build', { buildPath });
  app.use(express.static(buildPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  logger.warn('React build directory not found; API only mode', { buildPath });
}

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Taylor-Made API listening on port ${PORT}`);
});

module.exports = server;
