// Filename: server/controllers/jobController.js
// (Updated to prevent automatic fetching on page refresh)

import { fetchAllJobsAndSave } from '../services/jobService.js';
import jobModel from '../models/jobModel.js';

// This admin route remains the same
export const triggerJobFetch = async (req, res) => {
    try {
        const result = await fetchAllJobsAndSave();
        return res.status(200).json({ success: true, message: `Job fetching process completed.`, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// This controller for "Show X New Jobs" button remains the same
export const getNewJobsCount = async (req, res) => {
    try {
        const { since } = req.query; // Frontend se timestamp aayega
        if (!since) {
            return res.status(400).json({ success: false, message: "Timestamp is required." });
        }

        const count = await jobModel.countDocuments({
            createdAt: { $gt: new Date(Number(since)) }
        });

        res.status(200).json({ success: true, data: { count } });
    } catch (error) {
        console.error("Get New Jobs Count Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const { search, jobType, location, page = 1, limit = 10, since } = req.query;
        const queryObject = {};
        
        // This logic for fetching new jobs on button click remains the same
        if (since) {
            queryObject.createdAt = { $gt: new Date(Number(since)) };
            const newJobs = await jobModel.find(queryObject).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                data: newJobs,
            });
        }

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

        const jobsPromise = jobModel.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(limitNum);
        const totalJobsPromise = jobModel.countDocuments(queryObject);
        const [jobs, totalJobs] = await Promise.all([jobsPromise, totalJobsPromise]);
        
        const totalPages = Math.ceil(totalJobs / limitNum);

        // STEP 1: Turant database se results user ko bhej do
        res.status(200).json({
            success: true,
            totalJobs,
            totalPages,
            currentPage: pageNum,
            data: jobs
        });

        // --- CHANGE IS HERE ---
        // STEP 2: Background fetch ko comment out kar diya gaya hai.
        // Ab page refresh karne par naye jobs automatically fetch nahi honge.
        /*
        if (pageNum === 1 && !search && !jobType && !location) {
            fetchAllJobsAndSave();
        }
        */
        
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }
    }
};