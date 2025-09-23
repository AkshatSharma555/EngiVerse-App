// Filename: server/controllers/notificationController.js (CORRECTED)

import Notification from '../models/notificationModel.js';

// @desc    Get all notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'name profilePicture')
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Mark notifications as read
export const markNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        // --- FIX IS HERE ---
        // We are now using the correct field name 'isRead' instead of 'read'
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true, message: "Notifications marked as read." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};