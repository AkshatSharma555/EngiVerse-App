// Filename: server/controllers/profileController.js

import userModel from "../models/userModel.js";

// @desc    Get user's profile data
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update user's profile data
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { collegeName, branch, graduationYear, skills, bio, socialLinks } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // --- YEH LOGIC THEEK KIYA GAYA HAI ---
    // Hum `||` operator ki jagah check kar rahe hain ki data `undefined` toh nahi hai.
    // Isse empty strings ("") bhi aaram se save ho jayengi.
    if (collegeName !== undefined) {
        user.collegeName = collegeName;
    }
    if (branch !== undefined) {
        user.branch = branch;
    }
    if (graduationYear !== undefined) {
        user.graduationYear = graduationYear;
    }
    if (skills !== undefined) {
        user.skills = skills;
    }
    if (bio !== undefined) {
        user.bio = bio;
    }
    if (socialLinks !== undefined) {
        user.socialLinks = socialLinks;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Upload user's profile picture
// @route   POST /api/profile/upload-picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
  try {
    const imageUrl = req.file.path;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully!",
      data: user,
    });
  } catch (error) {
    console.error("Upload Picture Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};