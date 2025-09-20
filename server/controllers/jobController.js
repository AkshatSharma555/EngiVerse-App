// Filename: server/controllers/jobController.js
// (Updated by your AI assistant to remove automatic personalized search)

import { fetchAllJobsAndSave } from '../services/jobService.js';
import jobModel from '../models/jobModel.js';
import userModel from '../models/userModel.js'; // userModel is no longer needed here but can be kept for future use

export const triggerJobFetch = async (req, res) => {
    // This function remains the same
    try {
        const result = await fetchAllJobsAndSave();
        return res.status(200).json({ success: true, message: `Job fetching process completed.`, data: result });
    } catch (error) {
        console.error("Trigger Fetch Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const { search, jobType, location, page = 1, limit = 10 } = req.query;
        const queryObject = {};

        // --- FIX: The personalization logic has been removed ---
        // The API will now only search if the frontend explicitly sends a 'search' term.
        // If 'search' is empty, it will return all jobs.
        if (search) {
            queryObject.$text = { $search: search };
        }
        
        if (jobType) {
            queryObject.jobType = { $in: jobType.split(',') };
        }
        if (location) {
            queryObject.location = { $regex: location, $options: 'i' };
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const jobs = await jobModel.find(queryObject)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
            
        const totalJobs = await jobModel.countDocuments(queryObject);
        const totalPages = Math.ceil(totalJobs / limitNum);

        return res.status(200).json({
            success: true,
            count: jobs.length,
            totalJobs,
            currentPage: pageNum,
            totalPages,
            data: jobs
        });
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};