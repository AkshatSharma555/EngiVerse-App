// Filename: server/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import "./models/userModel.js";
import { initializeSocket } from "./socket/socket.js";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import savedJobRouter from "./routes/savedJobRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import interviewRoutes from './routes/interviewRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174" ,"https://engiverse-chi.vercel.app" ];

// Initialize socket.io and get io instance
const { server, io } = initializeSocket(app);

// Make io accessible to controllers
app.set("io", io);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API Endpoints
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/saved-jobs", savedJobRouter);
app.use("/api/tasks", taskRoutes);
app.use("/api/friends", friendRoutes); // <-- Added
app.use("/api/messages", messageRoutes); // <-- Added
app.use("/api/notifications", notificationRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRouter);
app.use('/api/interviews', interviewRoutes);

server.listen(port, () =>
  console.log(`Server (with Socket.IO) started on PORT:${port}`)
);
