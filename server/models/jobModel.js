// Filename: server/models/jobModel.js
// (Upgraded by your AI assistant for better search and UI)

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required."],
        trim: true
    },
    companyName: {
        type: String,
        required: [true, "Company name is required."],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required."],
        trim: true
    },
    jobType: {
        type: String,
        enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
        required: [true, "Job type is required."]
    },
    skillsRequired: {
        type: [String],
        default: []
    },
    sourceUrl: {
        type: String,
        required: true,
        unique: true
    },
    postedDate: {
        type: String,
        trim: true
    },
    apiSource: {
        type: String,
        required: true
    },
    // --- NEW FIELD ADDED ---
    employer_logo: {
        type: String, // Company logo ka URL
        default: null
    }
}, {
    timestamps: true
});

// --- SEARCH INDEX UPGRADED ---
// Ab search skills par bhi kaam karega
jobSchema.index({ 
    title: 'text', 
    companyName: 'text', 
    description: 'text', 
    skillsRequired: 'text' 
});

const jobModel = mongoose.models.job || mongoose.model('job', jobSchema);

export default jobModel;