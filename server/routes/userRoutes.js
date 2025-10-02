// Filename: server/routes/userRoutes.js (UPDATED)

import express from 'express'
import userAuth from '../middleware/userAuth.js';
// <-- Naya function import karein ---
import { getUserData, exploreUsers } from '../controllers/userController.js';

const userRouter = express.Router();

// Existing route
userRouter.get('/data', userAuth, getUserData);

// <-- Naya 'Explore' route add karein ---
userRouter.get('/explore', userAuth, exploreUsers);

export default userRouter;