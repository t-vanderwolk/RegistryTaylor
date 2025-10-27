const logger = require('../utils/logger');

module.exports = (err, req, res, _next) => {
  logger.error('Unhandled error', {
    path: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Something went wrong',
      status,
    },
  });
};
