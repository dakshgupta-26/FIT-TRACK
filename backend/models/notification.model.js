import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderName: { type: String, default: "" },
    senderAvatar: { type: String, default: "" },
    type: {
      type: String,
      enum: ["like", "comment", "reply", "follow", "message", "mention", "live", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    referenceId: { type: String, default: "" },
    referenceType: {
      type: String,
      enum: ["post", "reel", "message", "conversation", "live", "user", "group", "challenge", "system"],
      default: "post",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
