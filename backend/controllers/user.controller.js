import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

// @desc    Get user data by UID
// @route   GET /api/user/:uid
export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create or update user data
// @route   POST /api/user
export const createOrUpdateUser = async (req, res) => {
  try {
    const { uid, ...userData } = req.body;
    if (!uid) return res.status(400).json({ error: "UID is required" });
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: userData },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Upload a user profile image
// @route   POST /api/user/profile/image
// @access  Private
export const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    
    // --- FIX IS HERE ---
    // Find user by the ID from the token (req.user._id), NOT req.params.uid
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { profileImageUrl: `/uploads/${req.file.filename}` },
      { new: true } // Return the updated document
    ).select("-password");

    if (!user) {
      // This check is important in case the user was deleted after token was issued
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, imageUrl: user.profileImageUrl, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a user profile image
// @route   DELETE /api/user/profile/image
// @access  Private
export const deleteProfileImage = async (req, res) => {
  try {
    // --- FIX IS HERE ---
    // Find user by the ID from the token (req.user._id)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImageUrl: null },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "Profile image deleted successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// @desc    Update user settings
// @route   POST /api/user/settings
export const updateUserSettings = async (req, res) => {
  const { uid, settings } = req.body;
  if (!uid || !settings)
    return res.status(400).json({ error: "UID and settings are required" });
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: settings },
      { new: true, upsert: true }
    );
    console.log("✅ User settings updated for UID:", uid);
    res.status(200).json({ message: "Settings updated successfully", user });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Update authenticated user's profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  // We get the user from the ID stored in the token by our 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.birthDate = req.body.birthDate; // Allow setting it to null
    user.gender = req.body.gender;
    user.height = req.body.height;
    user.weight = req.body.weight;

    const updatedUser = await user.save();

    // Respond with the updated user data
    res.status(200).json({
      _id: updatedUser._id,
      uid: updatedUser.uid,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      birthDate: updatedUser.birthDate,
      gender: updatedUser.gender,
      height: updatedUser.height,
      weight: updatedUser.weight,
      profileImageUrl: updatedUser.profileImageUrl,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});