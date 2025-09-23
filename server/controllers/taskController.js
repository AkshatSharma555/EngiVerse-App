// Filename: server/controllers/taskController.js (UPDATED)

import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import Offer from "../models/offerModel.js";

// createTask function remains the same
export const createTask = async (req, res) => {
  try {
    const { title, description, skills, bounty } = req.body;
    const seekerId = req.user.id;
    if (!title || !description || !skills || skills.length === 0 || bounty === undefined) {
      return res.status(400).json({ success: false, message: "Please provide all fields, including a bounty." });
    }
    const bountyAmount = Number(bounty);
    if (isNaN(bountyAmount) || bountyAmount < 0) {
        return res.status(400).json({ success: false, message: "Bounty must be a non-negative number." });
    }
    const seeker = await User.findById(seekerId);
    if (seeker.engiCoins < bountyAmount) {
        return res.status(400).json({ success: false, message: "You don't have enough EngiCoins to post this task." });
    }
    seeker.engiCoins -= bountyAmount;
    const task = await Task.create({ title, description, skills, bounty: bountyAmount, user: seekerId });
    await seeker.save();
    res.status(201).json({ success: true, message: "Task created successfully.", data: task });
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ success: false, message: "Server error while creating task." });
  }
};

// getAllTasks function remains the same (fetches only 'open' tasks for the public feed)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "open" })
      .sort({ createdAt: -1 })
      .populate("user", "name profilePicture");
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching tasks."});
  }
};

// getTaskById function remains the same
export const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task ID format." });
    }
    const task = await Task.findById(taskId).populate("user", "name profilePicture collegeName");
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching the task."});
  }
};


// --- NEW FUNCTION for "My Tasks" Workspace ---
/**
 * @desc    Get all tasks related to the logged-in user (created or assigned)
 * @route   GET /api/tasks/mytasks
 */
export const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({
            $or: [
                { user: userId },       // Tasks created by the user
                { assignedTo: userId }  // Tasks assigned to the user
            ]
        })
        .sort({ updatedAt: -1 }) // Show recently updated tasks first
        .populate("user", "name profilePicture") // Populate the task owner
        .populate("assignedTo", "name profilePicture"); // Populate the assigned helper

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error("Error in getMyTasks:", error);
        res.status(500).json({ success: false, message: "Server error while fetching your tasks." });
    }
};


// acceptOffer function remains the same
export const acceptOffer = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { offerId } = req.body;
        const userId = req.user.id;
        const task = await Task.findById(taskId);
        const offer = await Offer.findById(offerId);
        if (!task || !offer) {
            return res.status(404).json({ success: false, message: "Task or Offer not found." });
        }
        if (task.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized for this task." });
        }
        if (task.status !== 'open') {
            return res.status(400).json({ success: false, message: "Task is not open for offers." });
        }
        task.status = 'in_progress';
        task.assignedTo = offer.user;
        await task.save();
        await Offer.findByIdAndUpdate(offerId, { status: 'accepted' });
        await Offer.updateMany({ task: taskId, _id: { $ne: offerId } }, { status: 'rejected' });
        res.status(200).json({ success: true, message: "Offer accepted successfully.", data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// completeTask function remains the same
export const completeTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const taskOwnerId = req.user.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }
        if (task.user.toString() !== taskOwnerId) {
            return res.status(403).json({ success: false, message: "Only the task owner can mark it as complete." });
        }
        if (task.status !== 'in_progress') {
            return res.status(400).json({ success: false, message: "This task is not in progress." });
        }
        if (!task.assignedTo) {
            return res.status(400).json({ success: false, message: "No user is assigned to this task." });
        }
        const helperId = task.assignedTo;
        const helper = await User.findById(helperId);
        if (!helper) {
            const owner = await User.findById(taskOwnerId);
            owner.engiCoins += task.bounty;
            task.status = 'closed';
            await Promise.all([owner.save(), task.save()]);
            return res.status(404).json({ success: false, message: "Helper not found. Bounty has been refunded." });
        }
        helper.engiCoins += task.bounty;
        task.status = 'completed';
        await Promise.all([helper.save(), task.save()]);
        res.status(200).json({ success: true, message: `Task marked as complete! ${task.bounty} EngiCoins transferred to ${helper.name}.` });
    } catch (error) {
        console.error("Error in completeTask:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};