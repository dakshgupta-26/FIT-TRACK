import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      // Crucial for deleting the image from Cloudinary
      type: String,
      required: true,
    },
    weight: { type: Number },
    waist: { type: Number },
    bodyFat: { type: Number },
    category: {
      type: String,
      enum: ["Front", "Back", "Side"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;