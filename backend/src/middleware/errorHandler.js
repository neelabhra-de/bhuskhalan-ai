function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.isOperational ? error.message : 'Internal server error',
  });
}

module.exports = errorHandler;
