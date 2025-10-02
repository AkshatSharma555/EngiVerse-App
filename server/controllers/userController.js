// Filename: server/controllers/userController.js (UPDATED)

import userModel from "../models/userModel.js";
import FriendRequest from "../models/friendRequestModel.js"; 

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Changed from req.userId to req.user.id for consistency
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// --- NEW EXPLORE USERS FUNCTION ---
/**
 * @desc    Get all users for the explore page with search and filters
 * @route   GET /api/users/explore
 */
export const exploreUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const { name, branch, skills, college } = req.query;

        // Start with a base query to find all users except the logged-in user
        let queryOptions = { _id: { $ne: loggedInUserId } };

        // Dynamically add search/filter conditions to the query
        if (name) {
            queryOptions.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
        }
        if (branch) {
            queryOptions.branch = { $regex: branch, $options: 'i' };
        }
        if (college) {
            queryOptions.collegeName = { $regex: college, $options: 'i' };
        }
        if (skills) {
            // Convert comma-separated skills string into an array for searching
            const skillsArray = skills.split(',').map(skill => skill.trim());
            queryOptions.skills = { $in: skillsArray }; // Find users with any of the specified skills
        }
        
        // Fetch the logged-in user's data to check friendship status
        const loggedInUser = await userModel.findById(loggedInUserId).select('friends');
        if (!loggedInUser) {
            return res.status(404).json({ success: false, message: "Authenticated user not found." });
        }
        const friendsSet = new Set(loggedInUser.friends.map(id => id.toString()));

        // Fetch all users matching the query, excluding sensitive data
        const users = await userModel.find(queryOptions).select('-password -verifyOtp -resetOtp').lean();
        
        // Add friendship status to each user
        const usersWithStatus = users.map(user => {
            let friendshipStatus = 'not_friends';
            if (friendsSet.has(user._id.toString())) {
                friendshipStatus = 'friends';
            }
            // In a future step, we can also check for pending requests here
            return { ...user, friendshipStatus };
        });

        res.status(200).json({ success: true, data: usersWithStatus });

    } catch (error) {
        console.error("Error in exploreUsers:", error);
        res.status(500).json({ success: false, message: "Server error while fetching users." });
    }
};