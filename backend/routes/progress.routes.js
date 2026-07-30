import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware.js";
import {
  getProgressEntries,
  addProgressEntry,
  deleteProgressEntry,
} from "../controllers/progress.controller.js";

const router = express.Router();

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protect all routes
router.use(protect);

router
  .route("/")
  .get(getProgressEntries)
  .post(upload.single("image"), addProgressEntry); // 'image' must match the key in FormData

router.route("/:id").delete(deleteProgressEntry);

export default router;