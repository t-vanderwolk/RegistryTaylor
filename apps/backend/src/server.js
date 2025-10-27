if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.warn("⚠️ SSL certificate verification disabled for local development.");
}

require('dotenv').config();
const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Taylor-Made Baby Co. API listening on port ${PORT}`);
});

module.exports = server;
