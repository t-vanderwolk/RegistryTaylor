module.exports = (req, res, next) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      path: req.originalUrl,
    },
  });
};
