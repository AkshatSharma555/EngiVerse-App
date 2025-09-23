// Filename: server/controllers/offerController.js

import Offer from "../models/offerModel.js";
import Task from "../models/taskModel.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new offer for a task
 * @route   POST /api/tasks/:taskId/offers
 * @access  Private
 */
export const createOffer = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // 1. Validation
    if (!message) {
      return res.status(400).json({ success: false, message: "Offer message is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid Task ID." });
    }

    // 2. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    // 3. Production check: User cannot offer on their own task
    if (task.user.toString() === userId) {
        return res.status(400).json({ success: false, message: "You cannot make an offer on your own task." });
    }

    // 4. Production check: Do not allow offers on non-open tasks
    if (task.status !== 'open') {
        return res.status(400).json({ success: false, message: "This task is not open for offers." });
    }

    // 5. Create and save the offer
    const offer = await Offer.create({
      task: taskId,
      user: userId,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Offer submitted successfully.",
      data: offer,
    });

  } catch (error) {
    console.error("Error in createOffer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating offer.",
      error: error.message,
    });
  }
};

export const getOffersForTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1. Validate the Task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid Task ID." });
    }
    
    // 2. Find all offers for the given task ID
    // Sort them to show the newest offer first
    // Populate the user's name and profile picture for each offer
    const offers = await Offer.find({ task: taskId })
      .sort({ createdAt: -1 })
      .populate("user", "name profilePicture");

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });

  } catch (error) {
    console.error("Error in getOffersForTask:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching offers.",
      error: error.message,
    });
  }
};