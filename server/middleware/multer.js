// Filename: server/middleware/multer.js (CORRECTED)

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Storage for PROFILE PICTURES (no change)
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EngiVerse/profile_pictures',
    allowed_formats: ['jpeg', 'png', 'jpg'],
    public_id: (req, file) => `profile_${req.user.id}_${Date.now()}`,
  },
});

// 2. Storage for CHAT FILES (updated)
const chatFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EngiVerse/chat_files',
    // --- THIS IS THE FIX ---
    // 'auto' tells Cloudinary to automatically detect if it's an image, video, or raw file (like PDF)
    resource_type: 'auto', 
  },
});

export const uploadProfilePicture = multer({ storage: profilePictureStorage });
export const uploadChatFile = multer({ storage: chatFileStorage });