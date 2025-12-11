import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Storage for PROFILE PICTURES (EngiVerse)
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EngiVerse/profile_pictures',
    allowed_formats: ['jpeg', 'png', 'jpg'],
    public_id: (req, file) => `profile_${req.user.id}_${Date.now()}`,
  },
});

// 2. Storage for CHAT FILES (EngiVerse)
const chatFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EngiVerse/chat_files',
    resource_type: 'auto', 
  },
});

// 3. Storage for RESUME IMAGE (New Addition)
// Hum yahan 'diskStorage' use karenge kyunki resumeController ImageKit use karta hai
// aur use 'fs' (file system) path ki zaroorat hoti hai.
const resumeStorage = multer.diskStorage({}); 

export const uploadProfilePicture = multer({ storage: profilePictureStorage });
export const uploadChatFile = multer({ storage: chatFileStorage });
export const uploadResumeImage = multer({ storage: resumeStorage }); // <-- Ye naya export hai