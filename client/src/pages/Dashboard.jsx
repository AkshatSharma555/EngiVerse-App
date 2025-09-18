// Filename: client/src/pages/Dashboard.jsx
// (No major changes needed, code is clean)

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { InterviewIcon, JobsIcon, P2PIcon } from "../components/ui/DashboardIcons";

const Dashboard = () => {
  const { backendUrl, user } = useContext(AppContent);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/dashboard`);
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data.");
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar theme="light" />
      <div className="container mx-auto max-w-7xl pt-24 sm:pt-28 p-4 sm:p-6">
        {/* --- Header Section --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-md text-gray-500">
            Here's your mission control for everything EngiVerse.
          </p>
        </div>

        {/* --- Main Dashboard Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Primary Column (Launchpad) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: AI Interviewer */}
            <Link to="/ai-interviewer" className="block p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg text-white hover:scale-102 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full"><InterviewIcon /></div>
                <div>
                  <h2 className="text-xl font-bold">Practice Interviews</h2>
                  <p className="text-sm opacity-80">Build confidence with our AI Interview Bot</p>
                </div>
                <span className="ml-auto font-semibold">&rarr;</span>
              </div>
            </Link>

            {/* Card 2: Job Aggregator - This link will now work */}
            <Link to="/jobs" className="block p-6 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl shadow-lg text-white hover:scale-102 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full"><JobsIcon /></div>
                <div>
                  <h2 className="text-xl font-bold">Find Opportunities</h2>
                  <p className="text-sm opacity-80">Discover internships and jobs matching your profile</p>
                </div>
                <span className="ml-auto font-semibold">&rarr;</span>
              </div>
            </Link>

            {/* Card 3: P2P Skill Exchange */}
            <Link to="/skill-exchange" className="block p-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg text-white hover:scale-102 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full"><P2PIcon /></div>
                <div>
                  <h2 className="text-xl font-bold">Collaborate with Peers</h2>
                  <p className="text-sm opacity-80">Get help on projects or offer your skills</p>
                </div>
                <span className="ml-auto font-semibold">&rarr;</span>
              </div>
            </Link>
          </div>

          {/* --- Secondary Column (Profile Widget) --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <h3 className="font-bold text-gray-800">Profile Completion</h3>
              <p className="text-sm text-gray-500 mt-1">Complete your profile for better recommendations.</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${dashboardData?.profileCompletion || 0}%` }}></div>
                </div>
                <span className="font-semibold text-indigo-600">{dashboardData?.profileCompletion || 0}%</span>
              </div>
              <Link to="/profile" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
                Go to Profile &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;