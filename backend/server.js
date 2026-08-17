// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { checkDbConnection } from "./middleware/checkDbConnection.js";
import { verifySmtpConnection } from "./emailService.js";

// --- INITIAL ENVIRONMENT SETUP ---
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Validate essential environment variables
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: JWT_SECRET environment variable is missing in .env. Using fallback secret.");
}

// --- CORE MIDDLEWARE SETUP ---
const getRawOrigins = () => {
  const envOrigins = [process.env.FRONTEND_URL, process.env.CLIENT_URL, process.env.APP_URL]
    .filter(Boolean)
    .join(",");
  const fallback = "http://localhost:5173,http://localhost:8080,http://localhost:3000";
  const combined = envOrigins ? `${envOrigins},${fallback}` : fallback;
  return Array.from(
    new Set(
      combined
        .split(",")
        .map((url) => url.trim().replace(/\/+$/, ""))
        .filter(Boolean)
    )
  );
};

const allowedOrigins = getRawOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin) || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy violation: Origin ${origin} is not allowed.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- DIAGNOSTIC HEALTH CHECK ENDPOINTS (Always Accessible) ---
const healthCheckHandler = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  return res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? "ok" : "degraded",
    success: isDbConnected,
    message: isDbConnected
      ? "FitTracker AI Backend API is fully operational"
      : "Database disconnected. Server running in degraded mode.",
    data: {
      database: {
        status: isDbConnected ? "connected" : "disconnected",
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host || "N/A",
      },
      smtp: (process.env.SMTP_EMAIL || process.env.SMTP_USER || process.env.SMTP_PASSWORD || process.env.SMTP_PASS) ? "configured" : "fallback",
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
};

app.get("/health", healthCheckHandler);
app.get("/api/health", healthCheckHandler);

// --- DATABASE GUARD & API ROUTING ---
app.use("/api", checkDbConnection);
app.use("/api", apiRoutes);

// --- GLOBAL ERROR HANDLER ---
app.use(errorHandler);

// --- STRICT STARTUP SEQUENCE ---
const startServer = async () => {
  console.log("=======================================================");
  console.log("🚀 Initializing FitTracker AI Backend Server...");
  console.log("=======================================================");

  // 1. Connect Database (Awaited BEFORE app.listen)
  const isConnected = await connectDB();

  // 2. Configure Cloudinary
  try {
    configureCloudinary();
  } catch (e) {
    console.warn("Cloudinary configuration warning:", e.message);
  }

  // 3. Verify SMTP Connection asynchronously
  verifySmtpConnection().catch((err) =>
    console.warn("SMTP verification check failed:", err.message)
  );

  // 4. Start Accepting HTTP Requests
  app.listen(PORT, () => {
    console.log(`\n=======================================================`);
    console.log(`🟢 FitTracker AI Server listening on: http://localhost:${PORT}`);
    console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Database Status: ${isConnected ? "Connected (100% Ready)" : "DISCONNECTED (Requires MongoDB Start)"}`);
    console.log(`=======================================================\n`);
  });
};

startServer().catch((err) => {
  console.error("FATAL: Server startup failure:", err);
  process.exit(1);
});