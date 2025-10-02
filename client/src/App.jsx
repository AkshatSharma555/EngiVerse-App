// Filename: client/src/App.jsx (FINAL STRUCTURED VERSION)

import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout Imports
import CommunityLayout from "./components/ui/CommunityLayout";

// Page Imports
import Home from "./pages/home.jsx";
import Login from "./pages/Login.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Jobs from "./pages/Jobs.jsx";
import SavedJobs from "./pages/SavedJobs.jsx";
import SkillExchange from "./pages/SkillExchange";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask.jsx";
import Friends from "./pages/Friends.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import MyTasks from "./pages/MyTasks.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Explore from './pages/Explore.jsx';
import AIInterviewDashboard from "./pages/AIInterviewDashboard.jsx";
import AIInterviewPage from "./pages/AIInterviewPage.jsx";
import InterviewReport from './pages/InterviewReport.jsx';

// Component Imports
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";

const App = () => {
  return (
    <div className="relative w-full min-h-screen">
      <div className="relative z-10">
        <ToastContainer theme="dark" position="top-right" autoClose={3000} />
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route element={<ProtectedRoute />}>
            
            {/* Routes that DON'T use the community layout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-interviewer" element={<AIInterviewDashboard />} />
            <Route path="/practice-interviews" element={<AIInterviewPage />} />
            <Route path="/interviews/report/:sessionId" element={<InterviewReport />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/tasks/:taskId" element={<TaskDetail />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/my-tasks" element={<MyTasks />} />

            {/* === COMMUNITY SECTION WITH PERSISTENT LAYOUT === */}
            <Route element={<CommunityLayout />}>
              <Route path="/skill-exchange" element={<SkillExchange />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:recipientId" element={<MessagesPage />} />
            </Route>

          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;