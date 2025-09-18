// Filename: server/controllers/jobController.js
import { fetchAndSaveJobs } from '../services/jobService.js';
import jobModel from '../models/jobModel.js';

export const triggerJobFetch = async (req, res) => {
    // ... (ye function pehle jaisa hi hai)
    try {
        const result = await fetchAndSaveJobs();
        res.status(200).json({ success: true, message: `Job fetching process completed.`, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- YEH NAYA FUNCTION HAI ---
// @desc    Get all jobs with search and filtering
// @route   GET /api/jobs
// @access  Private
export const getAllJobs = async (req, res) => {
    try {
        // Frontend se query parameters nikalo (e.g., /api/jobs?search=react&location=remote)
        const { search, jobType, location } = req.query;

        // Query object banayo
        const queryObject = {};

        // Agar search query hai, toh text search use karo
        // Yeh fast hai kyunki humne model mein text index banaya tha
        if (search) {
            queryObject.$text = { $search: search };
        }

        // Agar jobType filter hai, toh usse query mein add karo
        if (jobType) {
            queryObject.jobType = jobType;
        }

        // Agar location filter hai, toh usse query mein add karo
        if (location) {
            // 'i' ka matlab hai case-insensitive search
            queryObject.location = { $regex: location, $options: 'i' };
        }

        // Database se jobs find karo
        const jobs = await jobModel.find(queryObject).sort({ createdAt: -1 }); // Naye jobs sabse upar

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};