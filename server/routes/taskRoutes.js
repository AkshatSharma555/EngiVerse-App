// Filename: server/routes/taskRoutes.js (UPDATED)

import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  acceptOffer,
  completeTask,
  getMyTasks, 
} from "../controllers/taskController.js";

import offerRoutes from './OfferRoutes.js';

const router = express.Router();

router.use('/:taskId/offers', offerRoutes);

// === PRIVATE ROUTES FIRST ===
// IMPORTANT: Place '/mytasks' before '/:id' so 'mytasks' is not treated as an ID
router.get("/mytasks", userAuth, getMyTasks); 
router.post("/", userAuth, createTask);
router.put("/:taskId/accept-offer", userAuth, acceptOffer); 
router.put("/:taskId/complete", userAuth, completeTask);

// === PUBLIC ROUTES LAST ===
router.get("/", getAllTasks);
router.get("/:id", getTaskById);

export default router;