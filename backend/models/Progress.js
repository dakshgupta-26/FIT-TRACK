import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authMiddleware from '../middleware/auth.js';
import Progress from '../models/Progress.js'; // Adjust path if needed

const router = express.Router();

// Use in-memory storage for Multer to process files for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * @route   POST /api/progress/:uid
 * @desc    Create a new progress entry for a user
 * @access  Private (Protected by authMiddleware)
 */
router.post('/:uid', authMiddleware, upload.single('progressImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required.' });
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, { folder: "healthbloom_progress" });

    const newProgress = new Progress({
      uid: req.user.id, // Comes from the authMiddleware
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      weight: req.body.weight,
      waist: req.body.waist,
      bodyFatPercentage: req.body.bodyFatPercentage,
      category: req.body.category,
    });

    await newProgress.save();
    res.status(201).json(newProgress);
  } catch (err) {
    console.error('Error creating progress entry:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/progress/:uid
 * @desc    Get all progress entries for a user
 * @access  Private
 */
router.get('/:uid', authMiddleware, async (req, res) => {
  try {
    const entries = await Progress.find({ uid: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching progress entries:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/progress/:id/:uid
 * @desc    Delete a progress entry
 * @access  Private
 */
router.delete('/:id/:uid', authMiddleware, async (req, res) => {
  try {
    const entry = await Progress.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Double-check ownership
    if (entry.uid.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized to delete this entry' });
    }
    
    // 1. Delete image from Cloudinary
    await cloudinary.uploader.destroy(entry.cloudinaryId);
    
    // 2. Delete entry from database
    await entry.deleteOne();

    res.json({ success: true, message: 'Entry removed successfully' });
  } catch (err) {
    console.error('Error deleting progress entry:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;