// Filename: server/models/offerModel.js

import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    // Offer kis task ke liye hai (Indexed for faster queries)
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true, // Performance ke liye indexing
    },
    // Offer kis user ne bheja hai (Indexed for faster queries)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Performance ke liye indexing
    },
    message: {
      type: String,
      required: [true, "Offer message is required."],
      trim: true,
      maxlength: [500, "Offer message cannot be more than 500 characters."],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;