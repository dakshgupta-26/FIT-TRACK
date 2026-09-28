import Progress from "../models/progress.model.js";
import Workout from "../models/workout.model.js";
import Goal from "../models/goal.model.js";
import { uploadBufferToStorage } from "../utils/mediaUpload.js";
import cloudinary from "../config/cloudinary.js";
import { getIO } from "../socket/index.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Helper to calculate date range filter
 */
const getDateRangeFilter = (range) => {
  const now = new Date();
  let startDate = null;

  switch (range?.toLowerCase()) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "6m":
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "all":
    default:
      startDate = null;
      break;
  }

  return startDate ? { $gte: startDate } : null;
};

/**
 * @desc    Get all progress entries for authenticated user
 * @route   GET /api/progress
 * @access  Private
 */
export const getProgressEntries = async (req, res) => {
  try {
    const { range, category, limit = 50, sort = "desc" } = req.query;

    const query = { user: req.user._id };

    const dateFilter = getDateRangeFilter(range);
    if (dateFilter) {
      query.date = dateFilter;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const sortOrder = sort === "asc" ? 1 : -1;

    const entries = await Progress.find(query)
      .sort({ date: sortOrder })
      .limit(parseInt(limit, 10));

    // Ensure backwards compatibility: populate photos array if only imageUrl exists
    const normalizedEntries = entries.map((entry) => {
      const doc = entry.toJSON();
      if ((!doc.photos || doc.photos.length === 0) && doc.imageUrl) {
        doc.photos = [
          {
            url: doc.imageUrl,
            publicId: doc.publicId || "",
            type: doc.category || "Front",
          },
        ];
      }
      return doc;
    });

    res.json(normalizedEntries);
  } catch (error) {
    console.error("[Progress Controller] getProgressEntries error:", error);
    res.status(500).json({ message: "Failed to fetch progress entries", error: error.message });
  }
};

/**
 * @desc    Get single progress entry by ID with previous/next comparison
 * @route   GET /api/progress/:id
 * @access  Private
 */
export const getProgressById = async (req, res) => {
  try {
    const entry = await Progress.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Progress entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this progress entry" });
    }

    // Find previous and next entries for comparison
    const [previousEntry, nextEntry] = await Promise.all([
      Progress.findOne({ user: req.user._id, date: { $lt: entry.date } }).sort({ date: -1 }),
      Progress.findOne({ user: req.user._id, date: { $gt: entry.date } }).sort({ date: 1 }),
    ]);

    res.json({
      entry,
      previousEntry,
      nextEntry,
    });
  } catch (error) {
    console.error("[Progress Controller] getProgressById error:", error);
    res.status(500).json({ message: "Failed to retrieve progress entry", error: error.message });
  }
};

/**
 * @desc    Add new progress entry
 * @route   POST /api/progress
 * @access  Private
 */
export const addProgressEntry = async (req, res) => {
  try {
    const uploadedPhotos = [];

    // 1. Process files if present
    const filesToProcess = [];
    if (req.file) {
      filesToProcess.push({ file: req.file, type: req.body.category || "Front" });
    } else if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((f) => filesToProcess.push({ file: f, type: req.body.category || "Front" }));
      } else {
        if (req.files.image && req.files.image[0]) {
          filesToProcess.push({ file: req.files.image[0], type: req.body.category || "Front" });
        }
        if (req.files.photos && Array.isArray(req.files.photos)) {
          req.files.photos.forEach((f, idx) => {
            const types = ["Front", "Side", "Back", "Other"];
            filesToProcess.push({ file: f, type: types[idx] || "Front" });
          });
        }
      }
    }

    for (const item of filesToProcess) {
      try {
        const publicUrl = await uploadBufferToStorage(item.file.buffer, {
          folder: "fittrack_progress",
          resource_type: "image",
          originalname: item.file.originalname,
        });

        uploadedPhotos.push({
          url: publicUrl,
          publicId: "",
          type: item.type || req.body.category || "Front",
        });
      } catch (uploadErr) {
        console.warn("[Progress Controller] File upload error:", uploadErr.message);
      }
    }

    // Also support direct imageUrl from body if passed
    if (req.body.imageUrl && uploadedPhotos.length === 0) {
      uploadedPhotos.push({
        url: req.body.imageUrl,
        publicId: req.body.publicId || "",
        type: req.body.category || "Front",
      });
    }

    const primaryImageUrl = uploadedPhotos.length > 0 ? uploadedPhotos[0].url : req.body.imageUrl || "";

    // 2. Validate and parse numeric measurements
    const parseNumber = (val) => {
      if (val === undefined || val === null || val === "" || isNaN(Number(val))) return undefined;
      return Math.round(Number(val) * 100) / 100;
    };

    const weight = parseNumber(req.body.weight);
    const waist = parseNumber(req.body.waist);
    const bodyFat = parseNumber(req.body.bodyFat || req.body.bodyFatPercentage);
    const chest = parseNumber(req.body.chest);
    const arms = parseNumber(req.body.arms);
    const thighs = parseNumber(req.body.thighs);
    const hips = parseNumber(req.body.hips);
    const neck = parseNumber(req.body.neck);

    // Range sanity checks
    if (weight !== undefined && (weight <= 0 || weight > 500)) {
      return res.status(400).json({ message: "Weight must be between 1 and 500 kg." });
    }
    if (bodyFat !== undefined && (bodyFat < 1 || bodyFat > 70)) {
      return res.status(400).json({ message: "Body Fat % must be between 1% and 70%." });
    }
    if (waist !== undefined && (waist < 10 || waist > 300)) {
      return res.status(400).json({ message: "Waist must be between 10 and 300 cm." });
    }

    // Workout snapshot parsing
    let workoutSnapshot = undefined;
    if (req.body.workoutSnapshot) {
      try {
        workoutSnapshot = typeof req.body.workoutSnapshot === "string"
          ? JSON.parse(req.body.workoutSnapshot)
          : req.body.workoutSnapshot;
      } catch (e) {
        // ignore parse error
      }
    } else if (req.body.workoutTitle || req.body.workoutType) {
      workoutSnapshot = {
        workoutTitle: req.body.workoutTitle,
        workoutType: req.body.workoutType,
        duration: parseNumber(req.body.workoutDuration),
        calories: parseNumber(req.body.workoutCalories),
        distance: parseNumber(req.body.workoutDistance),
        prAchieved: req.body.prAchieved,
      };
    }

    const newEntry = new Progress({
      user: req.user._id,
      imageUrl: primaryImageUrl,
      publicId: uploadedPhotos[0]?.publicId || "",
      photos: uploadedPhotos,
      category: req.body.category || "Front",
      weight,
      waist,
      bodyFat,
      chest,
      arms,
      thighs,
      hips,
      neck,
      unitPreference: req.body.unitPreference || "metric",
      notes: req.body.notes || "",
      workoutSnapshot,
      date: req.body.date ? new Date(req.body.date) : new Date(),
    });

    const savedEntry = await newEntry.save();

    // 3. Emit real-time update via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.emit("progress:created", {
          userId: req.user._id.toString(),
          entryId: savedEntry._id,
          date: savedEntry.date,
        });
      }
    } catch (socketErr) {
      // Non-fatal
    }

    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("[Progress Controller] addProgressEntry error:", error);
    res.status(500).json({
      message: "Failed to save progress entry. Please check your data and try again.",
      error: error.message,
    });
  }
};

/**
 * @desc    Update an existing progress entry
 * @route   PATCH /api/progress/:id
 * @access  Private
 */
export const updateProgressEntry = async (req, res) => {
  try {
    const entry = await Progress.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Progress entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this entry" });
    }

    // Process new image upload if present
    if (req.file) {
      try {
        const publicUrl = await uploadBufferToStorage(req.file.buffer, {
          folder: "fittrack_progress",
          resource_type: "image",
          originalname: req.file.originalname,
        });
        entry.imageUrl = publicUrl;
        entry.photos = [
          {
            url: publicUrl,
            publicId: "",
            type: req.body.category || entry.category || "Front",
          },
        ];
      } catch (uploadErr) {
        console.warn("[Progress Controller] Image update upload warning:", uploadErr.message);
      }
    }

    const parseNumber = (val) => {
      if (val === undefined || val === null || val === "" || isNaN(Number(val))) return undefined;
      return Math.round(Number(val) * 100) / 100;
    };

    if (req.body.weight !== undefined) entry.weight = parseNumber(req.body.weight);
    if (req.body.waist !== undefined) entry.waist = parseNumber(req.body.waist);
    if (req.body.bodyFat !== undefined) entry.bodyFat = parseNumber(req.body.bodyFat);
    if (req.body.chest !== undefined) entry.chest = parseNumber(req.body.chest);
    if (req.body.arms !== undefined) entry.arms = parseNumber(req.body.arms);
    if (req.body.thighs !== undefined) entry.thighs = parseNumber(req.body.thighs);
    if (req.body.hips !== undefined) entry.hips = parseNumber(req.body.hips);
    if (req.body.neck !== undefined) entry.neck = parseNumber(req.body.neck);
    if (req.body.category !== undefined) entry.category = req.body.category;
    if (req.body.notes !== undefined) entry.notes = req.body.notes;
    if (req.body.date !== undefined) entry.date = new Date(req.body.date);
    if (req.body.unitPreference !== undefined) entry.unitPreference = req.body.unitPreference;

    if (req.body.workoutSnapshot) {
      try {
        entry.workoutSnapshot = typeof req.body.workoutSnapshot === "string"
          ? JSON.parse(req.body.workoutSnapshot)
          : req.body.workoutSnapshot;
      } catch (e) {
        // ignore
      }
    }

    const updated = await entry.save();

    try {
      const io = getIO();
      if (io) {
        io.emit("progress:updated", {
          userId: req.user._id.toString(),
          entryId: updated._id,
        });
      }
    } catch (socketErr) {
      // non-fatal
    }

    res.json(updated);
  } catch (error) {
    console.error("[Progress Controller] updateProgressEntry error:", error);
    res.status(500).json({ message: "Failed to update progress entry", error: error.message });
  }
};

/**
 * @desc    Delete a progress entry
 * @route   DELETE /api/progress/:id
 * @access  Private
 */
export const deleteProgressEntry = async (req, res) => {
  try {
    const entry = await Progress.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Progress entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this entry" });
    }

    // Try deleting from Cloudinary if publicId exists and Cloudinary is configured
    if (entry.publicId && process.env.CLOUDINARY_API_KEY) {
      try {
        await cloudinary.uploader.destroy(entry.publicId);
      } catch (cloudErr) {
        console.warn("[Progress Controller] Cloudinary delete notice:", cloudErr.message);
      }
    }

    await Progress.deleteOne({ _id: req.params.id });

    try {
      const io = getIO();
      if (io) {
        io.emit("progress:deleted", {
          userId: req.user._id.toString(),
          entryId: req.params.id,
        });
      }
    } catch (socketErr) {
      // non-fatal
    }

    res.json({ success: true, message: "Progress entry deleted successfully" });
  } catch (error) {
    console.error("[Progress Controller] deleteProgressEntry error:", error);
    res.status(500).json({ message: "Server Error deleting progress entry", error: error.message });
  }
};

/**
 * Generate algorithmic and/or Gemini AI insight based on actual progress data
 */
const generateAiInsights = async (stats, entries, workouts) => {
  const { weightDelta, bodyFatDelta, waistDelta, streak, totalWorkouts, currentWeight, currentBodyFat } = stats;

  let primaryInsight = "Start tracking your journey consistently to reveal intelligent transformation trends.";
  let focusForNextWeek = "Log your measurements once per week and complete at least 3 workouts.";
  let statusBadge = "Building Baseline";

  if (entries.length >= 2) {
    const hasWeightDrop = weightDelta !== undefined && weightDelta < 0;
    const hasFatDrop = bodyFatDelta !== undefined && bodyFatDelta < 0;
    const hasWaistDrop = waistDelta !== undefined && waistDelta < 0;

    if (hasWeightDrop && hasFatDrop) {
      primaryInsight = `Your weight decreased by ${Math.abs(weightDelta).toFixed(1)} kg with a ${Math.abs(bodyFatDelta).toFixed(1)}% reduction in body fat, indicating quality fat loss with minimal lean muscle degradation.`;
      focusForNextWeek = "Maintain your current caloric deficit and ensure 1.6–2.0g protein per kg of body weight to preserve metabolic rate.";
      statusBadge = "Optimal Fat Loss";
    } else if (!hasWeightDrop && hasWaistDrop) {
      primaryInsight = `Body recomposition detected: while total weight remained stable, your waist reduced by ${Math.abs(waistDelta).toFixed(1)} cm. You are likely gaining dense muscle while trimming visceral fat.`;
      focusForNextWeek = "Keep training volume consistent. Track progressive overload on key compound lifts.";
      statusBadge = "Recomposition";
    } else if (hasWeightDrop && !hasFatDrop) {
      primaryInsight = `Weight is down by ${Math.abs(weightDelta).toFixed(1)} kg. Ensure adequate resistance training and protein intake to safeguard active muscle mass during this reduction.`;
      focusForNextWeek = "Incorporate at least 2 strength sessions this week and hydrate with electrolytes.";
      statusBadge = "Active Reduction";
    } else if (weightDelta > 0) {
      primaryInsight = `Weight increased by ${Math.abs(weightDelta).toFixed(1)} kg over this period. Paired with ${totalWorkouts} logged workouts, this supports targeted lean tissue hypertrophy.`;
      focusForNextWeek = "Prioritize progressive overload and post-workout recovery sleep.";
      statusBadge = "Hypertrophy Phase";
    } else {
      primaryInsight = `Metrics are holding steady over recent logs. Maintenance phases consolidate systemic recovery and hormonal stability.`;
      focusForNextWeek = "Evaluate training intensity and verify adherence to nutritional targets.";
      statusBadge = "Maintenance Steady";
    }
  } else if (entries.length === 1) {
    primaryInsight = `Initial baseline logged at ${currentWeight || "--"} kg${currentBodyFat ? ` (${currentBodyFat}% body fat)` : ""}. Your next entry will unlock comparative transformation metrics and trajectory projections.`;
    focusForNextWeek = "Log a follow-up entry in 7 days under consistent morning conditions.";
    statusBadge = "Baseline Set";
  }

  // Attempt optional Gemini AI enrichment if API key exists
  if (process.env.GEMINI_API_KEY && entries.length >= 2) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const prompt = `You are FitTracker AI, an elite clinical sports scientist and body transformation coach.
Analyze the following verified user transformation data:
- Entries count: ${entries.length}
- Current Weight: ${currentWeight} kg (Total delta: ${weightDelta} kg)
- Current Body Fat: ${currentBodyFat || "N/A"}% (Total delta: ${bodyFatDelta || "N/A"}%)
- Waist Delta: ${waistDelta || "N/A"} cm
- Consecutive Activity Streak: ${streak} days
- Workouts in Period: ${totalWorkouts}

Respond in concise JSON with these exact keys:
"headline": A punchy 1-sentence analytical assessment (max 20 words).
"actionableFocus": 1 specific, non-generic focus directive for next week (max 25 words).
"statusTag": 2-3 word technical status tag (e.g. "Optimal Recomposition", "Steady Deficit", "Metabolic Consolidation").

Do NOT invent fake health claims. Stick strictly to the numbers provided. Return pure JSON without markdown backticks.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json\n|```/g, "").trim();
      const parsed = JSON.parse(text);

      if (parsed.headline && parsed.actionableFocus) {
        primaryInsight = parsed.headline;
        focusForNextWeek = parsed.actionableFocus;
        if (parsed.statusTag) statusBadge = parsed.statusTag;
      }
    } catch (e) {
      // Fallback seamlessly to the clinical algorithmic insight
    }
  }

  return {
    primaryInsight,
    focusForNextWeek,
    statusBadge,
  };
};

/**
 * @desc    Comprehensive analytics endpoint for charts, KPIs, milestones, and scores
 * @route   GET /api/progress/analytics
 * @access  Private
 */
export const getProgressAnalytics = async (req, res) => {
  try {
    const { range = "90d" } = req.query;

    // 1. Fetch all progress entries for user sorted chronologically (ascending for trend lines)
    const allEntriesAsc = await Progress.find({ user: req.user._id }).sort({ date: 1 });

    if (allEntriesAsc.length === 0) {
      return res.json({
        hasData: false,
        kpis: {
          currentWeight: null,
          weightChange: null,
          currentBodyFat: null,
          bodyFatChange: null,
          currentWaist: null,
          waistChange: null,
          streak: 0,
          goalProgress: 0,
          workoutsCount: 0,
          progressScore: 0,
        },
        timeline: [],
        charts: {
          weightTrend: [],
          bodyFatTrend: [],
          waistTrend: [],
          chestTrend: [],
          armsTrend: [],
          thighsTrend: [],
          workoutFrequency: [],
        },
        comparison: {
          before: null,
          current: null,
          deltas: {},
        },
        goals: [],
        milestones: getInitialMilestones([]),
        aiInsights: {
          primaryInsight: "No progress entries logged yet. Add your first photo and measurements to begin tracking your transformation.",
          focusForNextWeek: "Record your initial weight, waist, and a front photo to initialize your baseline.",
          statusBadge: "Awaiting First Entry",
        },
        heatmap: [],
      });
    }

    // Filter by selected range for charts
    const startDateFilter = getDateRangeFilter(range);
    const filteredEntries = startDateFilter
      ? allEntriesAsc.filter((e) => new Date(e.date) >= startDateFilter.$gte)
      : allEntriesAsc;

    // Entries to display on chart (fallback to all if filtered has fewer than 2 items but overall entries exist)
    const chartEntries = filteredEntries.length > 0 ? filteredEntries : allEntriesAsc;

    // 2. Fetch User Workouts in this period & overall
    const workouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });

    const filteredWorkouts = startDateFilter
      ? workouts.filter((w) => new Date(w.createdAt || w.updatedAt) >= startDateFilter.$gte)
      : workouts;

    // 3. Fetch User Goals
    const goals = await Goal.find({ user: req.user._id, status: { $ne: "failed" } });

    // 4. Calculate Key Benchmarks
    const firstEntry = allEntriesAsc[0];
    const latestEntry = allEntriesAsc[allEntriesAsc.length - 1];
    const previousEntry = allEntriesAsc.length > 1 ? allEntriesAsc[allEntriesAsc.length - 2] : null;

    const round2 = (num) => (num !== undefined && num !== null ? Math.round(num * 100) / 100 : undefined);

    // Delta calculations
    const weightDelta = latestEntry.weight && firstEntry.weight
      ? round2(latestEntry.weight - firstEntry.weight)
      : undefined;

    const weightDeltaPrev = latestEntry.weight && previousEntry?.weight
      ? round2(latestEntry.weight - previousEntry.weight)
      : undefined;

    const bodyFatDelta = latestEntry.bodyFat && firstEntry.bodyFat
      ? round2(latestEntry.bodyFat - firstEntry.bodyFat)
      : undefined;

    const bodyFatDeltaPrev = latestEntry.bodyFat && previousEntry?.bodyFat
      ? round2(latestEntry.bodyFat - previousEntry.bodyFat)
      : undefined;

    const waistDelta = latestEntry.waist && firstEntry.waist
      ? round2(latestEntry.waist - firstEntry.waist)
      : undefined;

    const waistDeltaPrev = latestEntry.waist && previousEntry?.waist
      ? round2(latestEntry.waist - previousEntry.waist)
      : undefined;

    // 5. Calculate Consecutive Activity Streak
    const activityDatesSet = new Set();

    allEntriesAsc.forEach((e) => {
      const d = new Date(e.date).toISOString().split("T")[0];
      activityDatesSet.add(d);
    });

    workouts.forEach((w) => {
      const d = new Date(w.createdAt || w.updatedAt).toISOString().split("T")[0];
      activityDatesSet.add(d);
    });

    const sortedDates = Array.from(activityDatesSet).sort().reverse();
    let currentStreak = 0;

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

    // Check if streak is active (today or yesterday has activity)
    if (sortedDates.includes(todayStr) || sortedDates.includes(yesterdayStr)) {
      let checkDate = sortedDates.includes(todayStr) ? new Date() : yesterdayDate;

      while (true) {
        const str = checkDate.toISOString().split("T")[0];
        if (activityDatesSet.has(str)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // 6. Calculate Real Goals Progress
    let totalGoalProgress = 0;
    const computedGoals = goals.map((g) => {
      let currentVal = undefined;
      let pct = g.progress || 0;

      if (g.type === "weight" && latestEntry.weight) {
        currentVal = latestEntry.weight;
        const startVal = firstEntry.weight || currentVal;
        const targetVal = g.target;
        if (startVal !== targetVal) {
          pct = Math.min(100, Math.max(0, Math.round(((startVal - currentVal) / (startVal - targetVal)) * 100)));
        }
      } else if (g.type === "workout") {
        currentVal = workouts.length;
        pct = Math.min(100, Math.round((currentVal / (g.target || 1)) * 100));
      }

      totalGoalProgress += pct;

      return {
        id: g.id || g._id,
        title: g.title,
        type: g.type,
        category: g.category,
        target: g.target,
        unit: g.unit,
        current: currentVal !== undefined ? currentVal : g.target * (pct / 100),
        progress: pct,
        targetDate: g.targetDate,
      };
    });

    const avgGoalProgress = computedGoals.length > 0
      ? Math.round(totalGoalProgress / computedGoals.length)
      : Math.min(100, Math.round((allEntriesAsc.length / 5) * 50));

    // 7. Calculate FitTracker Transformation Score (0-100)
    // Formula:
    // - Goal progress component: up to 35 pts
    // - Streak & consistency: up to 25 pts (min(25, currentStreak * 2.5 + entries * 1.5))
    // - Workout frequency: up to 20 pts (min(20, filteredWorkouts.length * 2))
    // - Measurement improvement: up to 20 pts (if weight/body fat moved towards goal, or regular tracking)
    const goalPts = Math.min(35, Math.round((avgGoalProgress / 100) * 35));
    const streakPts = Math.min(25, Math.round(currentStreak * 2 + allEntriesAsc.length * 1.5));
    const workoutPts = Math.min(20, Math.round(filteredWorkouts.length * 2.5));
    const trackingPts = allEntriesAsc.length >= 3 ? 20 : allEntriesAsc.length * 6;

    const progressScore = Math.min(100, Math.max(10, goalPts + streakPts + workoutPts + trackingPts));

    // 8. Generate Visual Transformation Comparison (Before vs Current)
    const entriesWithPhotos = allEntriesAsc.filter((e) => e.imageUrl || (e.photos && e.photos.length > 0));

    const beforeEntry = entriesWithPhotos.length > 0 ? entriesWithPhotos[0] : null;
    const currentPhotoEntry = entriesWithPhotos.length > 1
      ? entriesWithPhotos[entriesWithPhotos.length - 1]
      : beforeEntry;

    // Helper to extract photo URL by angle
    const getPhotoForAngle = (entry, angle) => {
      if (!entry) return null;
      if (entry.photos && entry.photos.length > 0) {
        const found = entry.photos.find((p) => p.type?.toLowerCase() === angle.toLowerCase());
        if (found?.url) return found.url;
      }
      return entry.imageUrl || null;
    };

    const comparisonData = {
      before: beforeEntry
        ? {
            id: beforeEntry._id,
            date: beforeEntry.date,
            weight: beforeEntry.weight,
            bodyFat: beforeEntry.bodyFat,
            waist: beforeEntry.waist,
            frontPhoto: getPhotoForAngle(beforeEntry, "Front"),
            sidePhoto: getPhotoForAngle(beforeEntry, "Side"),
            backPhoto: getPhotoForAngle(beforeEntry, "Back"),
          }
        : null,
      current: currentPhotoEntry
        ? {
            id: currentPhotoEntry._id,
            date: currentPhotoEntry.date,
            weight: currentPhotoEntry.weight,
            bodyFat: currentPhotoEntry.bodyFat,
            waist: currentPhotoEntry.waist,
            frontPhoto: getPhotoForAngle(currentPhotoEntry, "Front"),
            sidePhoto: getPhotoForAngle(currentPhotoEntry, "Side"),
            backPhoto: getPhotoForAngle(currentPhotoEntry, "Back"),
          }
        : null,
      deltas: {
        weight: beforeEntry?.weight && currentPhotoEntry?.weight
          ? round2(currentPhotoEntry.weight - beforeEntry.weight)
          : null,
        bodyFat: beforeEntry?.bodyFat && currentPhotoEntry?.bodyFat
          ? round2(currentPhotoEntry.bodyFat - beforeEntry.bodyFat)
          : null,
        waist: beforeEntry?.waist && currentPhotoEntry?.waist
          ? round2(currentPhotoEntry.waist - beforeEntry.waist)
          : null,
      },
      hasEnoughPhotos: entriesWithPhotos.length >= 2,
    };

    // 9. Chart Trends Data
    const weightTrend = [];
    const bodyFatTrend = [];
    const waistTrend = [];
    const chestTrend = [];
    const armsTrend = [];
    const thighsTrend = [];

    chartEntries.forEach((entry, idx) => {
      const dateLabel = new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const fullDate = new Date(entry.date).toISOString().split("T")[0];

      if (entry.weight !== undefined && entry.weight !== null) {
        const prevWeight = idx > 0 ? chartEntries[idx - 1].weight : undefined;
        weightTrend.push({
          date: dateLabel,
          fullDate,
          value: entry.weight,
          previous: prevWeight,
          change: prevWeight ? round2(entry.weight - prevWeight) : 0,
        });
      }

      if (entry.bodyFat !== undefined && entry.bodyFat !== null) {
        const prevBf = idx > 0 ? chartEntries[idx - 1].bodyFat : undefined;
        bodyFatTrend.push({
          date: dateLabel,
          fullDate,
          value: entry.bodyFat,
          previous: prevBf,
          change: prevBf ? round2(entry.bodyFat - prevBf) : 0,
        });
      }

      if (entry.waist !== undefined && entry.waist !== null) {
        const prevWaist = idx > 0 ? chartEntries[idx - 1].waist : undefined;
        waistTrend.push({
          date: dateLabel,
          fullDate,
          value: entry.waist,
          previous: prevWaist,
          change: prevWaist ? round2(entry.waist - prevWaist) : 0,
        });
      }

      if (entry.chest !== undefined && entry.chest !== null) {
        chestTrend.push({ date: dateLabel, fullDate, value: entry.chest });
      }
      if (entry.arms !== undefined && entry.arms !== null) {
        armsTrend.push({ date: dateLabel, fullDate, value: entry.arms });
      }
      if (entry.thighs !== undefined && entry.thighs !== null) {
        thighsTrend.push({ date: dateLabel, fullDate, value: entry.thighs });
      }
    });

    // Workout frequency grouped by week
    const workoutFreqMap = new Map();
    filteredWorkouts.forEach((w) => {
      const d = new Date(w.createdAt || w.updatedAt);
      // Group by week start (Monday)
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(d.setDate(diff)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      workoutFreqMap.set(weekStart, (workoutFreqMap.get(weekStart) || 0) + 1);
    });

    const workoutFrequency = Array.from(workoutFreqMap.entries()).map(([week, count]) => ({
      week,
      workouts: count,
    }));

    // 10. Compute Dynamic Milestones
    const milestones = calculateMilestones({
      entriesCount: allEntriesAsc.length,
      photosCount: entriesWithPhotos.length,
      weightDelta,
      bodyFatDelta,
      streak: currentStreak,
      workoutsCount: workouts.length,
      firstEntryDate: firstEntry.date,
      latestEntryDate: latestEntry.date,
    });

    // 11. Activity Heatmap (Last 90 days)
    const heatmap = [];
    const heatmapDays = 90;
    const today = new Date();

    for (let i = heatmapDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      let count = 0;
      const details = [];

      const hasProgress = allEntriesAsc.some(
        (e) => new Date(e.date).toISOString().split("T")[0] === dateStr
      );
      if (hasProgress) {
        count += 1;
        details.push("Progress Entry");
      }

      const workoutOnDate = workouts.filter(
        (w) => new Date(w.createdAt || w.updatedAt).toISOString().split("T")[0] === dateStr
      );
      if (workoutOnDate.length > 0) {
        count += workoutOnDate.length;
        details.push(`${workoutOnDate.length} Workout(s)`);
      }

      heatmap.push({
        date: dateStr,
        count,
        details,
        level: count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3,
      });
    }

    // 12. AI Progress Insights
    const aiInsights = await generateAiInsights(
      {
        weightDelta,
        bodyFatDelta,
        waistDelta,
        streak: currentStreak,
        totalWorkouts: filteredWorkouts.length,
        currentWeight: latestEntry.weight,
        currentBodyFat: latestEntry.bodyFat,
      },
      allEntriesAsc,
      filteredWorkouts
    );

    res.json({
      hasData: true,
      kpis: {
        currentWeight: latestEntry.weight || null,
        startWeight: firstEntry.weight || null,
        weightDelta: weightDelta !== undefined ? weightDelta : null,
        weightDeltaPrev: weightDeltaPrev !== undefined ? weightDeltaPrev : null,
        weightChangePct: firstEntry.weight && latestEntry.weight
          ? round2(((latestEntry.weight - firstEntry.weight) / firstEntry.weight) * 100)
          : null,
        currentBodyFat: latestEntry.bodyFat || null,
        startBodyFat: firstEntry.bodyFat || null,
        bodyFatDelta: bodyFatDelta !== undefined ? bodyFatDelta : null,
        bodyFatDeltaPrev: bodyFatDeltaPrev !== undefined ? bodyFatDeltaPrev : null,
        currentWaist: latestEntry.waist || null,
        startWaist: firstEntry.waist || null,
        waistDelta: waistDelta !== undefined ? waistDelta : null,
        waistDeltaPrev: waistDeltaPrev !== undefined ? waistDeltaPrev : null,
        streak: currentStreak,
        goalProgress: avgGoalProgress,
        workoutsCount: filteredWorkouts.length,
        totalWorkoutsAllTime: workouts.length,
        progressScore,
        scoreBreakdown: {
          goalPts,
          streakPts,
          workoutPts,
          trackingPts,
        },
      },
      timeline: allEntriesAsc.map((e) => {
        const item = e.toJSON();
        if ((!item.photos || item.photos.length === 0) && item.imageUrl) {
          item.photos = [{ url: item.imageUrl, type: item.category || "Front" }];
        }
        return item;
      }),
      charts: {
        weightTrend,
        bodyFatTrend,
        waistTrend,
        chestTrend,
        armsTrend,
        thighsTrend,
        workoutFrequency,
      },
      comparison: comparisonData,
      goals: computedGoals,
      milestones,
      aiInsights,
      heatmap,
    });
  } catch (error) {
    console.error("[Progress Controller] getProgressAnalytics error:", error);
    res.status(500).json({ message: "Failed to compile progress analytics", error: error.message });
  }
};

/**
 * Calculate milestones based on user's real statistics
 */
const calculateMilestones = ({
  entriesCount,
  photosCount,
  weightDelta,
  bodyFatDelta,
  streak,
  workoutsCount,
  firstEntryDate,
  latestEntryDate,
}) => {
  return [
    {
      id: "first_entry",
      title: "Transformation Initiated",
      description: "Logged your first baseline progress entry",
      category: "Consistency",
      achieved: entriesCount >= 1,
      achievedAt: firstEntryDate,
      progress: Math.min(100, entriesCount * 100),
      icon: "Flag",
    },
    {
      id: "visual_duo",
      title: "Visual Transformation",
      description: "Captured at least 2 progress photos to unlock before/after slider",
      category: "Photos",
      achieved: photosCount >= 2,
      achievedAt: photosCount >= 2 ? latestEntryDate : null,
      progress: Math.min(100, Math.round((photosCount / 2) * 100)),
      icon: "Camera",
    },
    {
      id: "streak_7",
      title: "7-Day Dedication",
      description: "Maintained a continuous 7-day activity streak",
      category: "Streak",
      achieved: streak >= 7,
      achievedAt: streak >= 7 ? latestEntryDate : null,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
      icon: "Flame",
    },
    {
      id: "entries_5",
      title: "Transformation Chronicler",
      description: "Logged 5 or more progress check-ins",
      category: "Consistency",
      achieved: entriesCount >= 5,
      achievedAt: entriesCount >= 5 ? latestEntryDate : null,
      progress: Math.min(100, Math.round((entriesCount / 5) * 100)),
      icon: "Calendar",
    },
    {
      id: "workouts_10",
      title: "Double Digit Club",
      description: "Completed 10 workouts logged in FitTracker",
      category: "Workouts",
      achieved: workoutsCount >= 10,
      achievedAt: workoutsCount >= 10 ? latestEntryDate : null,
      progress: Math.min(100, Math.round((workoutsCount / 10) * 100)),
      icon: "Dumbbell",
    },
    {
      id: "weight_milestone_2kg",
      title: "2 kg Conquered",
      description: "Achieved a 2 kg transformation milestone",
      category: "Body",
      achieved: weightDelta !== undefined && Math.abs(weightDelta) >= 2,
      achievedAt: weightDelta !== undefined && Math.abs(weightDelta) >= 2 ? latestEntryDate : null,
      progress: weightDelta !== undefined ? Math.min(100, Math.round((Math.abs(weightDelta) / 2) * 100)) : 0,
      icon: "TrendingDown",
    },
    {
      id: "bodyfat_reduced_2",
      title: "Lean Recomposition",
      description: "Reduced body fat percentage by 2% or more",
      category: "Body",
      achieved: bodyFatDelta !== undefined && bodyFatDelta <= -2,
      achievedAt: bodyFatDelta !== undefined && bodyFatDelta <= -2 ? latestEntryDate : null,
      progress: bodyFatDelta !== undefined && bodyFatDelta < 0
        ? Math.min(100, Math.round((Math.abs(bodyFatDelta) / 2) * 100))
        : 0,
      icon: "Zap",
    },
    {
      id: "streak_30",
      title: "Iron Discipline",
      description: "Achieved a legendary 30-day streak",
      category: "Streak",
      achieved: streak >= 30,
      achievedAt: streak >= 30 ? latestEntryDate : null,
      progress: Math.min(100, Math.round((streak / 30) * 100)),
      icon: "Award",
    },
  ];
};

const getInitialMilestones = () => {
  return calculateMilestones({
    entriesCount: 0,
    photosCount: 0,
    weightDelta: undefined,
    bodyFatDelta: undefined,
    streak: 0,
    workoutsCount: 0,
  });
};

/**
 * @desc    Get quick summary of latest metrics vs starting
 * @route   GET /api/progress/summary
 * @access  Private
 */
export const getProgressSummary = async (req, res) => {
  try {
    const entries = await Progress.find({ user: req.user._id }).sort({ date: 1 });

    if (entries.length === 0) {
      return res.json({ hasData: false });
    }

    const first = entries[0];
    const latest = entries[entries.length - 1];

    res.json({
      hasData: true,
      currentWeight: latest.weight,
      startWeight: first.weight,
      weightChange: latest.weight && first.weight ? Math.round((latest.weight - first.weight) * 10) / 10 : 0,
      currentBodyFat: latest.bodyFat,
      bodyFatChange: latest.bodyFat && first.bodyFat ? Math.round((latest.bodyFat - first.bodyFat) * 10) / 10 : 0,
      currentWaist: latest.waist,
      waistChange: latest.waist && first.waist ? Math.round((latest.waist - first.waist) * 10) / 10 : 0,
      entriesCount: entries.length,
      lastLoggedAt: latest.date,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve summary", error: error.message });
  }
};

/**
 * @desc    Get milestones
 * @route   GET /api/progress/milestones
 * @access  Private
 */
export const getProgressMilestones = async (req, res) => {
  try {
    const entries = await Progress.find({ user: req.user._id }).sort({ date: 1 });
    const workouts = await Workout.find({ user: req.user._id });

    const first = entries[0];
    const latest = entries[entries.length - 1];
    const photos = entries.filter((e) => e.imageUrl || (e.photos && e.photos.length > 0));

    const weightDelta = first?.weight && latest?.weight ? latest.weight - first.weight : undefined;
    const bodyFatDelta = first?.bodyFat && latest?.bodyFat ? latest.bodyFat - first.bodyFat : undefined;

    const milestones = calculateMilestones({
      entriesCount: entries.length,
      photosCount: photos.length,
      weightDelta,
      bodyFatDelta,
      streak: 0,
      workoutsCount: workouts.length,
      firstEntryDate: first?.date,
      latestEntryDate: latest?.date,
    });

    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: "Failed to get milestones", error: error.message });
  }
};