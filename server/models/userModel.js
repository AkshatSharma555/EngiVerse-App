// Filename: server/models/userModel.js
// (Updated by your AI assistant with Profile fields and best practices)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // --- Core Authentication Fields ---
  name: {
    type: String,
    required: true,
    trim: true // Extra spaces ko hata dega
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // Email hamesha lowercase mein save hoga
  },
  password: {
    type: String,
    required: true,
    select: false // By default, password database se fetch nahi hoga
  },

  // --- Account Verification & Reset Fields ---
  verifyOtp: { type: String, select: false },
  verifyOtpExpireAt: { type: Number, select: false },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, select: false },
  resetOtpExpireAt: { type: Number, select: false },
  
  // --- NEW: User Profile Fields ---
  collegeName: {
    type: String,
    trim: true,
    default: ''
  },
  branch: {
    type: String,
    trim: true,
    default: ''
  },
  graduationYear: {
    type: Number,
    min: 2020, // Example validation
    max: 2035
  },
  skills: {
    type: [String], // Array of Strings
    default: []
  },
  profilePicture: {
    type: String, // Yahan image ka URL save hoga
    default: ''
  },
  bio: {
    type: String,
    maxLength: 250, // Bio ki max length
    trim: true,
    default: ''
  },
  socialLinks: {
    linkedIn: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    portfolio: { type: String, trim: true, default: '' }
  }

}, {
  // --- BEST PRACTICE: Timestamps ---
  // Yeh automatically `createdAt` aur `updatedAt` fields add kar dega
  timestamps: true 
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;