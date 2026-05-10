export function notFoundHandler(req, res) {
  res.status(404).json({
    error: true,
    message: 'Route not found'
  });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Something went wrong' : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: true,
    message
  });
}
