// Filename: server/routes/jobRoutes.js
// (AI Updated for Hybrid Fetching Feature)

import express from "express";
import userAuth from "../middleware/userAuth.js";
import { triggerJobFetch, getAllJobs, getNewJobsCount } from "../controllers/jobController.js";

const jobRouter = express.Router();

// Frontend ko jobs dikhane ke liye
jobRouter.get("/", userAuth, getAllJobs);

// Nayi jobs ka count check karne ke liye (Naya Route)
jobRouter.get("/new-count", userAuth, getNewJobsCount);

// Background mein naye jobs fetch karne ke liye (Admin Route)
jobRouter.post("/refresh", userAuth, triggerJobFetch);

export default jobRouter;