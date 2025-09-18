// Filename: server/models/jobModel.js

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
        enum: ['Internship', 'Full-time', 'Part-time'],
        required: [true, "Job type is required."]
    },
    // Yeh field personalization ke liye bahut zaroori hai
    skillsRequired: {
        type: [String],
        default: []
    },
    sourceUrl: {
        type: String,
        required: true,
        unique: true // Isse hum duplicate job postings save nahi karenge
    },
    postedDate: {
        type: String, // Hum इसे text ke form mein save karenge jaisa API se milega (e.g., "2 hours ago")
        trim: true
    },
    // Yeh track karega ki job humne kis API se laayi hai (for future use)
    apiSource: {
        type: String,
        required: true
    }
}, {
    timestamps: true // createdAt aur updatedAt fields
});

// Production Best Practice: Database mein text index banayein
// Isse title, company, aur description par text search bahut fast ho jayega.
jobSchema.index({ title: 'text', companyName: 'text', description: 'text' });

const jobModel = mongoose.models.job || mongoose.model('job', jobSchema);

export default jobModel;