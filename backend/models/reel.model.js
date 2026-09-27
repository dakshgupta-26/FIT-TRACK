import mongoose from "mongoose";

const reelCommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const reelSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: "" },
    authorBadge: { type: String, default: "PRO ATHLETE" },
    videoUrl: { type: String, required: true },
    coverImage: { type: String, default: "" },
    caption: { type: String, default: "" },
    audioTitle: { type: String, default: "Original Workout Audio" },
    workoutType: { type: String, default: "HIIT Sprints" },
    caloriesBurned: { type: Number, default: 0 },
    heartRate: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewsCount: { type: Number, default: 0 },
    viewedBy: [{ type: String }],
    comments: [reelCommentSchema],
    sharesCount: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

reelSchema.index({ createdAt: -1 });
reelSchema.index({ viewsCount: -1 });

const Reel = mongoose.models.Reel || mongoose.model("Reel", reelSchema);
export default Reel;
