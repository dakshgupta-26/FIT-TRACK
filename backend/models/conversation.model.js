import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, default: "" },
    text: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    workoutAttachment: {
      workoutType: { type: String },
      calories: { type: Number },
      duration: { type: String },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    isGroup: { type: Boolean, default: false },
    groupTitle: { type: String, default: "" },
    groupAvatar: { type: String, default: "" },
    lastMessage: {
      text: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      senderName: { type: String, default: "" },
      mediaUrl: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default Conversation;
