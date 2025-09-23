// Filename: server/models/taskModel.js

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // Kaunsa user task post kar raha hai
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 'User' model ko reference karega
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters."],
    },
    description: {
      type: String,
      required: [true, "Task description is required."],
      maxlength: [1000, "Description cannot be more than 1000 characters."],
    },
    
    // Is task ke liye kaunsi skills chahiye
    skills: {
      type: [String],
      required: [true, "At least one skill is required."],
    },
    // Task ka current status
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },
    // Jab offer accept hoga, toh yahan helper ki ID store hogi
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Task complete hone par Seeker, Helper ko jo rating dega
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
    },

    completedAt: {
        type: Date,
    },
    
    bounty: { type: Number, required: true, min: 0 },
  },
  {
    // Automatically createdAt aur updatedAt fields add ho jayengi
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;