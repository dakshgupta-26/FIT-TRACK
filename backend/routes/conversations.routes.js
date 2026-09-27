import express from "express";
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from "../controllers/messages.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadPostMedia } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getConversations);
router.post("/", getOrCreateConversation);
router.get("/:id/messages", getMessages);
router.post("/:id/messages", uploadPostMedia.single("media"), sendMessage);

export default router;
