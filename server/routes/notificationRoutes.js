// Filename: server/routes/notificationRoutes.js (CORRECTED)

import express from 'express';
// --- THIS IS THE FIX ---
// userAuth ko bina {} ke import karein kyunki woh default export hai
import userAuth from '../middleware/userAuth.js'; 
import { getNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', userAuth, getNotifications);
router.put('/read', userAuth, markNotificationsAsRead);

export default router;