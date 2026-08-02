/**
 * Global Error Handler Middleware
 * Returns consistent, structured JSON responses across the entire application.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Global Error Handler caught:", err.stack || err);

  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  const message = err.message || "An unexpected internal server error occurred.";

  res.status(statusCode).json({
    success: false,
    message: message,
    code: err.code || (statusCode === 401 ? "UNAUTHORIZED" : statusCode === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR"),
    details: process.env.NODE_ENV === "production" ? null : { stack: err.stack },
    timestamp: new Date().toISOString(),
  });
};