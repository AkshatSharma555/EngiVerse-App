// Filename: server/routes/savedJobRoutes.js

import express from "express";
import userAuth from "../middleware/userAuth.js";
import { 
    saveJob, 
    unsaveJob, 
    getSavedJobs, 
    getSavedJobIds 
} from "../controllers/savedJobController.js";

const savedJobRouter = express.Router();

// --- All routes here are protected and require a user to be logged in ---

// Get all saved jobs (with full job details) for the current user
savedJobRouter.get("/", userAuth, getSavedJobs);

// Get just the IDs of all saved jobs for the current user (for UI state)
savedJobRouter.get("/ids", userAuth, getSavedJobIds);

// Save a job
savedJobRouter.post("/", userAuth, saveJob);

// Unsave a job using its Job ID
savedJobRouter.delete("/:jobId", userAuth, unsaveJob);

export default savedJobRouter;