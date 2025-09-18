// Filename: server/controllers/profileController.js

import userModel from "../models/userModel.js";

// @desc    Get user's profile data
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  // ... (ye function pehle jaisa hi hai)
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

// --- YEH NAYA FUNCTION HAI ---
// @desc    Update user's profile data
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // Frontend se aane wala data req.body mein hota hai
    const { collegeName, branch, graduationYear, skills, bio, socialLinks } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // User object ko naye data se update karo
    user.collegeName = collegeName || user.collegeName;
    user.branch = branch || user.branch;
    user.graduationYear = graduationYear || user.graduationYear;
    user.skills = skills || user.skills;
    user.bio = bio || user.bio;
    user.socialLinks = socialLinks || user.socialLinks;
    // Hum `name` aur `email` yahan se update nahi karne denge

    // Updated user ko database mein save karo
    const updatedUser = await user.save();

    return res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully!", 
      data: updatedUser 
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- YEH NAYA FUNCTION HAI ---
// @desc    Upload user's profile picture
// @route   POST /api/profile/upload-picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
  try {
    // Multer file upload karke 'req.file' object bana deta hai
    // jismein Cloudinary ka URL 'req.file.path' mein hota hai.
    const imageUrl = req.file.path;

    // User ke document mein profilePicture field ko update karo
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true } // Yeh updated document return karega
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