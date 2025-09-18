// Filename: server/routes/jobRoutes.js
import express from "express";
import userAuth from "../middleware/userAuth.js";
// Naye getAllJobs function ko import karo
import { triggerJobFetch, getAllJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();

// Naya GET route jo saare jobs fetch karega
jobRouter.get("/", userAuth, getAllJobs);

// Job fetching ko trigger karne wala route
jobRouter.post("/fetch", userAuth, triggerJobFetch);

export default jobRouter;