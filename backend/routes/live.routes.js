import express from "express";
import {
  createLiveStream,
  getActiveStreams,
  getStreamById,
  joinStreamAsViewer,
  endLiveStream,
} from "../controllers/live.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

router.post("/create", protect, createLiveStream);
router.get("/active", getActiveStreams);
router.get("/:id", getStreamById);
router.post("/:id/join", optionalAuth, joinStreamAsViewer);
router.post("/:id/end", protect, endLiveStream);

export default router;
