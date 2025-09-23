// Filename: server/controllers/friendController.js

import User from '../models/userModel.js';
import FriendRequest from '../models/friendRequestModel.js';
import Notification from '../models/notificationModel.js';
import mongoose from 'mongoose'; // Import mongoose

// @desc    Send a friend request
// @route   POST /api/friends/requests/send/:userId
export const sendFriendRequest = async (req, res) => {
    const requesterId = req.user.id;
    const recipientId = req.params.userId;

    // Can't send a request to yourself
    if (requesterId === recipientId) {
        return res.status(400).json({ success: false, message: "You cannot send a friend request to yourself." });
    }

    try {
        // Check if they are already friends
        const recipient = await User.findById(recipientId);
        if (!recipient) {
             return res.status(404).json({ success: false, message: "User not found." });
        }
        if (recipient.friends.includes(requesterId)) {
            return res.status(400).json({ success: false, message: "You are already friends." });
        }

        // Check if a pending request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { fromUser: requesterId, toUser: recipientId },
                { fromUser: recipientId, toUser: requesterId }
            ],
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: "A friend request is already pending between you two." });
        }

        await FriendRequest.create({ fromUser: requesterId, toUser: recipientId });
        
        await Notification.create({
            recipient: recipientId,
            sender: requesterId,
            type: 'friend_request',
            link: `/profile/${requesterId}`
        });

        res.status(201).json({ success: true, message: "Friend request sent." });
    } catch (error) {
        console.error("Error in sendFriendRequest:", error);
        res.status(500).json({ success: false, message: "Server error while sending request." });
    }
};

// @desc    Respond to a friend request
// @route   PUT /api/friends/requests/respond/:requestId
export const respondToRequest = async (req, res) => {
    const currentUserId = req.user.id;
    const { requestId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    try {
        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }
        if (request.toUser.toString() !== currentUserId) {
            return res.status(403).json({ success: false, message: "Not authorized to respond to this request." });
        }
        if (request.status !== 'pending') {
             return res.status(400).json({ success: false, message: "This request has already been responded to." });
        }

        if (action === 'accept') {
            request.status = 'accepted';
            
            // Add each user to the other's friends list
            await User.findByIdAndUpdate(currentUserId, { $addToSet: { friends: request.fromUser } });
            await User.findByIdAndUpdate(request.fromUser, { $addToSet: { friends: currentUserId } });
            
            await request.save(); // Save after updates

            await Notification.create({
                recipient: request.fromUser,
                sender: currentUserId,
                type: 'friend_request_accepted',
                link: `/profile/${currentUserId}`
            });

            return res.status(200).json({ success: true, message: "Friend request accepted." });
        } else if (action === 'reject') {
            request.status = 'rejected';
            await request.save();
            return res.status(200).json({ success: true, message: "Friend request rejected." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid action." });
        }
    } catch (error) {
        console.error("Error in respondToRequest:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get all pending incoming friend requests
// @route   GET /api/friends/requests/pending
export const getPendingRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            toUser: req.user.id,
            status: 'pending'
        }).populate('fromUser', 'name profilePicture');

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error("Error in getPendingRequests:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get user's friend list
// @route   GET /api/friends
// @route   GET /api/friends
export const getFriendsList = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends', 'name profilePicture collegeName');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // --- THIS IS THE FIX ---
        // Filter out any null values from the friends list before sending.
        // This happens if a friend deleted their account.
        const validFriends = user.friends.filter(friend => friend !== null);

        res.status(200).json({ success: true, data: validFriends });
    } catch (error) {
        console.error("Error in getFriendsList:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export const withdrawRequest = async (req, res) => {
    const requesterId = req.user.id;
    const recipientId = req.params.recipientId;

    try {
        const result = await FriendRequest.findOneAndDelete({
            fromUser: requesterId,
            toUser: recipientId,
            status: 'pending'
        });

        if (!result) {
            return res.status(404).json({ success: false, message: "No pending request found to withdraw." });
        }
        
        // Optional: Delete the notification as well
        await Notification.findOneAndDelete({
            sender: requesterId,
            recipient: recipientId,
            type: 'friend_request'
        });

        res.status(200).json({ success: true, message: "Friend request withdrawn." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Remove a friend
// @route   DELETE /api/friends/:friendId
export const unfriendUser = async (req, res) => {
    const currentUserId = req.user.id;
    const { friendId } = req.params;

    try {
        // Remove friend from current user's list
        await User.findByIdAndUpdate(currentUserId, { $pull: { friends: friendId } });
        // Remove current user from friend's list
        await User.findByIdAndUpdate(friendId, { $pull: { friends: currentUserId } });
        
        // Optional: Delete any friend request history between them
        await FriendRequest.deleteMany({
            $or: [
                { fromUser: currentUserId, toUser: friendId },
                { fromUser: friendId, toUser: currentUserId }
            ]
        });

        res.status(200).json({ success: true, message: "Friend removed successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};