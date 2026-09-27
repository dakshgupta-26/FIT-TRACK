import mongoose from "mongoose";

const commentReplySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [commentReplySchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: "" },
    authorBadge: { type: String, default: "PRO ATHLETE" },
    type: {
      type: String,
      enum: ["photo", "video", "workout", "transformation", "meal", "progress", "reel", "challenge", "voice", "route"],
      default: "workout",
    },
    caption: { type: String, required: true },
    mediaUrls: [{ type: String }],
    audioUrl: { type: String, default: "" },
    tags: [{ type: String }],
    hashtags: [{ type: String }],

    // Fitness Overlay Telemetry
    workoutMetrics: {
      workoutType: { type: String, default: "HIIT Sprints" },
      caloriesBurned: { type: Number, default: 0 },
      durationMinutes: { type: Number, default: 0 },
      stepsCount: { type: Number, default: 0 },
      avgHeartRate: { type: Number, default: 0 },
      distanceMiles: { type: Number, default: 0 },
      routeMapUrl: { type: String, default: "" },
      beforeImage: { type: String, default: "" },
      afterImage: { type: String, default: "" },
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sharesCount: { type: Number, default: 0 },
    comments: [commentSchema],

    privacy: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public",
    },

    aiAnalysis: { type: String, default: "" },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
