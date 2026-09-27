import express from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notifications.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);

export default router;
