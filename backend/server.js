// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

// --- INITIAL SETUP ---
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- DATABASE & CLOUDINARY CONNECTION ---
connectDB();
configureCloudinary();

// --- CORE MIDDLEWARE ---
app.use(cors());
app.use(express.json());
// Serve static files for profile images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API ROUTES ---
// Mount all API routes under the /api prefix
app.use("/api", apiRoutes);

// --- GLOBAL ERROR HANDLER ---
// (Optional but highly recommended)
app.use(errorHandler);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});