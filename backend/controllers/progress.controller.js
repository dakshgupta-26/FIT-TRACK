import Progress from "../models/progress.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Helper to upload a buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "progress_pics" }, // Optional: organizes uploads in Cloudinary
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// @desc    Get all progress entries for a user
// @route   GET /api/progress
export const getProgressEntries = async (req, res) => {
  try {
    const entries = await Progress.find({ user: req.user._id }).sort({
      date: "desc",
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a new progress entry
// @route   POST /api/progress
export const addProgressEntry = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  try {
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const newEntry = new Progress({
      user: req.user._id,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      weight: req.body.weight,
      waist: req.body.waist,
      bodyFat: req.body.bodyFat,
      category: req.body.category,
      date: req.body.date || new Date(),
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to upload progress entry",
        error: error.message,
      });
  }
};

// @desc    Delete a progress entry
// @route   DELETE /api/progress/:id
export const deleteProgressEntry = async (req, res) => {
  try {
    const entry = await Progress.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete from Cloudinary first
    await cloudinary.uploader.destroy(entry.publicId);

    // Then delete from MongoDB
    await Progress.deleteOne({ _id: req.params.id });

    res.json({ message: "Progress entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};