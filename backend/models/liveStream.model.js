import mongoose from "mongoose";

const liveStreamSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hostName: { type: String, required: true },
    hostAvatar: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    roomName: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "ENDED"],
      default: "LIVE",
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    viewerCount: { type: Number, default: 0 },
    peakViewers: { type: Number, default: 0 },
    activeViewers: [{ type: String }],
    reactionsSummary: {
      type: Map,
      of: Number,
      default: {},
    },
    telemetry: {
      workoutType: { type: String, default: "Functional HIIT" },
      avgHeartRate: { type: Number, default: 155 },
      caloriesBurned: { type: Number, default: 420 },
    },
  },
  { timestamps: true }
);

liveStreamSchema.index({ status: 1, createdAt: -1 });

const LiveStream = mongoose.models.LiveStream || mongoose.model("LiveStream", liveStreamSchema);
export default LiveStream;
