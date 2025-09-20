import express from "express";
import userAuth from "../middleware/userAuth.js";
import { triggerJobFetch, getAllJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.get("/", userAuth, getAllJobs);
jobRouter.post("/fetch", userAuth, triggerJobFetch);

export default jobRouter;