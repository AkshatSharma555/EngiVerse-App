// Filename: server/controllers/messageController.js

import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { userSocketMap } from '../socket/socket.js'; // Import userSocketMap to send real-time events

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        let conversations = await Conversation.find({ participants: userId })
            .populate({
                path: 'participants',
                select: 'name profilePicture',
                match: { _id: { $ne: userId } }
            })
            .sort({ updatedAt: -1 });

        // --- THIS IS THE FIX ---
        // Filter out conversations where the other participant might have been deleted,
        // which results in an empty `participants` array after population.
        const validConversations = conversations.filter(convo => convo.participants.length > 0);

        res.status(200).json({ success: true, data: validConversations });
    } catch (error) {
        console.error("Error in getConversations:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
// @desc    Get messages between two users
// @route   GET /api/messages/:recipientId
export const getMessages = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const senderId = req.user.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!conversation) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Fetch only those messages that are NOT deleted for the current user
        const messages = await Message.find({
            conversationId: conversation._id,
            deletedFor: { $ne: senderId } // $ne = Not Equal (important)
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Send a message to a user
// @route   POST /api/messages/send/:recipientId
export const sendMessage = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const { text } = req.body;
        const senderId = req.user.id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recipientId]
            });
        }

        // --- THIS IS THE FIX ---
        // Hum ab 'text' ke bajaye 'content' field use karenge aur 'type' bhi batayenge.
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            type: 'text', // Explicitly set the type
            content: text, // Save the message in the 'content' field
        });

        await Promise.all([
            newMessage.save(),
            Conversation.findByIdAndUpdate(conversation._id, {
                lastMessage: {
                    text,
                    sender: senderId,
                }
            })
        ]);

        const recipientSocketId = userSocketMap[recipientId];
        if (recipientSocketId) {
            req.app.get('io').to(recipientSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Error in sendMessage: ", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Send an image or document
// @route   POST /api/messages/send-file/:recipientId
export const sendFile = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const senderId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file provided." });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, recipientId] });
        }

        const fileUrl = req.file.path; // Multer-Cloudinary humein URL dega
        const originalName = req.file.originalname;
        const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'document';

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            type: fileType,
            content: fileUrl,
            fileName: originalName
        });

        await Promise.all([
            newMessage.save(),
            Conversation.findByIdAndUpdate(conversation._id, {
                lastMessage: { text: fileType === 'image' ? 'Sent an image' : 'Sent a document', sender: senderId }
            })
        ]);
        
        // Real-time event bhejein
        const recipientSocketId = userSocketMap[recipientId];
        if (recipientSocketId) {
            req.app.get('io').to(recipientSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ success: true, data: newMessage });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Delete all messages in a conversation
// @route   DELETE /api/messages/clear/:conversationId

export const clearChat = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { mode } = req.body; // 'for_me' or 'for_everyone'
        const userId = req.user.id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }

        if (mode === 'for_everyone') {
            // Permanently delete all messages from the database
            await Message.deleteMany({ conversationId: conversationId });
        } else if (mode === 'for_me') {
            // Add the current user's ID to the 'deletedFor' array of all messages in this chat
            await Message.updateMany(
                { conversationId: conversationId },
                { $addToSet: { deletedFor: userId } } // $addToSet prevents duplicate IDs
            );
        } else {
            return res.status(400).json({ success: false, message: "Invalid delete mode." });
        }
        
        await Conversation.findByIdAndUpdate(conversationId, { lastMessage: { text: "Chat cleared." } });

        res.status(200).json({ success: true, message: "Chat history updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};