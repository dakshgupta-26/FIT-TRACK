// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    error: {
      message: err.message,
      // Include stack trace only in development environment for security
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    },
  });
};