// Filename: server/routes/profileRoutes.js

import express from "express";
import userAuth from "../middleware/userAuth.js";
// Naye uploadProfilePicture function ko import karo
import { getProfile, updateProfile, uploadProfilePicture } from "../controllers/profileController.js";
// Apne cloudinary config se upload middleware import karo
import upload from "../config/cloudinary.js";

const profileRouter = express.Router();

profileRouter.get("/", userAuth, getProfile);
profileRouter.put("/", userAuth, updateProfile);

// --- YEH NAYI LINE HAI ---
// Yeh route file upload handle karega
// Middleware Chain: pehle userAuth, fir multer ka upload, fir controller
profileRouter.post("/upload-picture", userAuth, upload.single('profilePicture'), uploadProfilePicture);

export default profileRouter;