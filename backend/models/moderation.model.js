import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: {
      type: String,
      enum: ["post", "reel", "user", "comment", "message", "live"],
      required: true,
    },
    targetId: { type: String, required: true },
    reason: { type: String, required: true },
    details: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

reportSchema.index({ reporter: 1, targetId: 1 });

const blockSchema = new mongoose.Schema(
  {
    blocker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blockedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

blockSchema.index({ blocker: 1, blockedUser: 1 }, { unique: true });

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
export const Block = mongoose.models.Block || mongoose.model("Block", blockSchema);
