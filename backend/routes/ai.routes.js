import express from "express";
import { chatWithGemini } from "../controllers/ai.controller.js";
import { scanFoodImage } from "../controllers/ai.controller.js";
import { analyzeFoodText } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/chat", chatWithGemini);

router.post("/scan-food", protect, upload.single("foodImage"), scanFoodImage);

// Add the new route for text analysis
router.post('/analyze-text', protect, analyzeFoodText);

export default router;