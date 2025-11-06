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
