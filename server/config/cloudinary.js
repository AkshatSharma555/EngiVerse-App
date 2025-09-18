// Filename: server/config/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import 'dotenv/config';

// Cloudinary ko apne credentials ke saath configure karo
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer ke liye storage engine set karo jo direct Cloudinary par upload karega
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'EngiVerse/profile_pictures', // Cloudinary mein folder ka naam
        allowed_formats: ['jpg', 'png', 'jpeg'],
        // public_id: (req, file) => 'some_unique_name', // Optional: file ka naam set karne ke liye
    },
});

// Multer upload middleware banakar export karo
const upload = multer({ storage: storage });

export default upload;