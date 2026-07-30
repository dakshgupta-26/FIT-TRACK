// backend/routes/user.routes.js

import express from "express";
import {
  getUser,
  createOrUpdateUser,
  uploadProfile,
  deleteProfileImage,
  updateUserSettings,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { uploadProfileImage } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js"; // Make sure this path is correct

const router = express.Router();

// --- SECURE, TOKEN-BASED ROUTES ---

// Handles updating text fields like name, birthdate, etc.
router.put("/profile", protect, updateUserProfile);

// Handles uploading a new profile image.
router.post(
  "/profile/image", // The URL your frontend is now correctly calling
  protect, // 1. Authenticate user via token
  uploadProfileImage.single("image"), // 2. Handle the file upload
  uploadProfile // 3. Run the controller logic
);

// Handles deleting the profile image.
router.delete("/profile/image", protect, deleteProfileImage);

// --- OTHER/LEGACY ROUTES (Keep as needed) ---
router.post("/settings", protect, updateUserSettings); // Also should be protected
router.get("/:uid", getUser); // This can remain for fetching public data if needed
router.post("/", createOrUpdateUser); // Usually for initial user creation

export default router;