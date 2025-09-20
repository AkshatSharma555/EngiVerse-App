// Filename: server/controllers/savedJobController.js

import savedJobModel from "../models/savedJobModel.js";

// --- Function to save a job ---
export const saveJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required." });
        }

        // Check if the job is already saved by this user
        const existingSavedJob = await savedJobModel.findOne({ user: userId, job: jobId });
        if (existingSavedJob) {
            return res.status(200).json({ success: true, message: "Job is already saved." });
        }

        const newSavedJob = new savedJobModel({
            user: userId,
            job: jobId
        });

        await newSavedJob.save();
        
        res.status(201).json({ success: true, message: "Job saved successfully!" });

    } catch (error) {
        // Handle potential duplicate key error gracefully
        if (error.code === 11000) {
            return res.status(200).json({ success: true, message: "Job is already saved." });
        }
        console.error("Save Job Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// --- Function to unsave a job ---
export const unsaveJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId } = req.params; // Job ID URL se aayega

        const result = await savedJobModel.findOneAndDelete({ user: userId, job: jobId });

        if (!result) {
            return res.status(404).json({ success: false, message: "Saved job not found." });
        }

        res.status(200).json({ success: true, message: "Job unsaved successfully!" });

    } catch (error) {
        console.error("Unsave Job Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// --- Function to get all saved jobs for the logged-in user ---
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all saved jobs for the user and populate the 'job' details
        // .populate('job') Mongoose ka magic hai. Yeh 'job' collection se
        // saved job ID ke basis par poori job details fetch kar lega.
        const savedJobs = await savedJobModel.find({ user: userId }).populate('job').sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: savedJobs });

    } catch (error) {
        console.error("Get Saved Jobs Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// --- Helper function to get only the IDs of saved jobs ---
// Yeh Jobs page par "Save" button ka status (saved/unsaved) dikhane ke liye useful hai
export const getSavedJobIds = async (req, res) => {
    try {
        const userId = req.user.id;
        const savedJobs = await savedJobModel.find({ user: userId }).select('job -_id');
        
        // Convert the array of objects to a simple array of strings (IDs)
        const jobIds = savedJobs.map(item => item.job);

        res.status(200).json({ success: true, data: jobIds });
    } catch (error) {
        console.error("Get Saved Job IDs Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};