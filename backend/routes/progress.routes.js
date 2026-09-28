import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware.js";
import {
  getProgressEntries,
  getProgressById,
  addProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
  getProgressAnalytics,
  getProgressSummary,
  getProgressMilestones,
} from "../controllers/progress.controller.js";

const router = express.Router();

// Multer in-memory storage (15MB limit)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WEBP) are supported for progress tracking."), false);
    }
  },
});

// Flexible upload handler for single 'image', multi 'photos', or any uploaded file
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "photos", maxCount: 6 },
]);

// Protect all routes with JWT authentication
router.use(protect);

// Specific analytics & summary endpoints (MUST be defined before /:id)
router.get("/analytics", getProgressAnalytics);
router.get("/summary", getProgressSummary);
router.get("/milestones", getProgressMilestones);

// Collection routes
router
  .route("/")
  .get(getProgressEntries)
  .post(uploadFields, addProgressEntry);

// Single entry routes
router
  .route("/:id")
  .get(getProgressById)
  .patch(uploadFields, updateProgressEntry)
  .put(uploadFields, updateProgressEntry)
  .delete(deleteProgressEntry);

export default router;