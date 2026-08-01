const errorHandler = (err, req, res, next) => {
  // If the status code is 200, set it to 500 (Internal Server Error) by default
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  // Send JSON response with error details
  res.json({
    message: err.message,
    // Include stack trace only if not in production environment
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
