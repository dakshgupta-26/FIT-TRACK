import express from "express";
import {
  createHealthMetric,
  getHealthMetrics,
  updateHealthMetric,
  deleteHealthMetric,
  getHealthMetricsSummary,
} from "../controllers/healthMetric.controller.js";

const router = express.Router();

router.post("/", createHealthMetric);
router.get("/:uid", getHealthMetrics);
router.get("/:uid/summary", getHealthMetricsSummary);
router.put("/:id", updateHealthMetric);
router.delete("/:id", deleteHealthMetric);

export default router;