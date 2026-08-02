import mongoose from "mongoose";

/**
 * Express Middleware: Database Connection Guard
 * Intercepts requests and immediately returns HTTP 503 if MongoDB is disconnected,
 * preventing 10-second request timeouts on the client.
 */
export const checkDbConnection = (req, res, next) => {
  // Allow health route to pass through for diagnostic inspection
  if (req.path === "/health" || req.path === "/health/") {
    return next();
  }

  // readyState 1 means connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database is not connected. Local MongoDB service is not running on 127.0.0.1:27017 or invalid MONGO_URI.",
      code: "DATABASE_DISCONNECTED",
      details: {
        readyState: mongoose.connection.readyState,
        solution: "Start MongoDB local service (net start MongoDB) or configure MONGO_ATLAS_URI in backend/.env",
      },
      timestamp: new Date().toISOString(),
    });
  }

  next();
};
