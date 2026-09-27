import LiveStream from "../models/liveStream.model.js";
import { createLiveKitToken } from "../services/livekit.service.js";
import { getIO } from "../socket/index.js";

/**
 * POST /api/live/create - Host initiates live stream
 */
export const createLiveStream = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required to go live" });
    }

    const {
      title = "Live Workout & Heart Rate Sync",
      description = "",
      thumbnail = "",
      workoutType = "HIIT & Strength",
      avgHeartRate = 162,
      caloriesBurned = 450,
    } = req.body;

    const hostName = req.user.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.user.email?.split("@")[0] || "Athlete";
    const hostAvatar = req.user.profileImageUrl || "";

    const roomName = `fittrack-live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const stream = await LiveStream.create({
      host: userId,
      hostName,
      hostAvatar,
      title,
      description,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
      roomName,
      status: "LIVE",
      startedAt: new Date(),
      viewerCount: 1,
      peakViewers: 1,
      telemetry: {
        workoutType,
        avgHeartRate: Number(avgHeartRate) || 155,
        caloriesBurned: Number(caloriesBurned) || 400,
      },
    });

    // Generate secure LiveKit Host Token with Publishing Permissions
    const token = await createLiveKitToken({
      roomName,
      participantIdentity: userId.toString(),
      participantName: hostName,
      isPublisher: true,
    });

    const livekitWsUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://livekit.fittrack.internal";

    // Notify community in real time
    const io = getIO();
    if (io) {
      io.emit("live:streamStarted", {
        streamId: stream._id.toString(),
        hostName,
        title,
        roomName,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Live stream initialized",
      data: {
        stream,
        token,
        roomName,
        livekitWsUrl,
      },
    });
  } catch (error) {
    console.error("[createLiveStream Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/live/active - List active live streams
 */
export const getActiveStreams = async (req, res) => {
  try {
    const streams = await LiveStream.find({ status: "LIVE" })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      data: streams.map((s) => ({ ...s, id: s._id.toString() })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/live/:id - Get stream details
 */
export const getStreamById = async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await LiveStream.findById(id).lean();

    if (!stream) {
      return res.status(404).json({ success: false, message: "Live stream not found" });
    }

    return res.status(200).json({
      success: true,
      data: { ...stream, id: stream._id.toString() },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/live/:id/join - Join as Viewer and get LiveKit Subscribe Token
 */
export const joinStreamAsViewer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user?._id || req.user?.id || `viewer-${Date.now()}`).toString();
    const viewerName = req.user?.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : "Athlete Viewer";

    const stream = await LiveStream.findById(id);
    if (!stream) {
      return res.status(404).json({ success: false, message: "Stream not found" });
    }

    // Generate viewer token (subscribe only)
    const token = await createLiveKitToken({
      roomName: stream.roomName,
      participantIdentity: userId,
      participantName: viewerName,
      isPublisher: false,
    });

    const livekitWsUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://livekit.fittrack.internal";

    return res.status(200).json({
      success: true,
      data: {
        token,
        roomName: stream.roomName,
        stream,
        livekitWsUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/live/:id/end - Host terminates live stream
 */
export const endLiveStream = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    const stream = await LiveStream.findById(id);
    if (!stream) {
      return res.status(404).json({ success: false, message: "Stream not found" });
    }

    if (stream.host.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Only the host can end the stream" });
    }

    stream.status = "ENDED";
    stream.endedAt = new Date();
    await stream.save();

    const io = getIO();
    if (io) {
      io.to(`live:${id}`).emit("live:streamEnded", { streamId: id });
    }

    return res.status(200).json({
      success: true,
      message: "Live stream ended",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
