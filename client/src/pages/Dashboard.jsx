// Filename: client/src/pages/Dashboard.jsx (Updated)

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { InterviewIcon, JobsIcon, P2PIcon } from "../components/ui/DashboardIcons";

// --- HELPER COMPONENT: Circular Progress Bar ---
const CircularProgressBar = ({ percentage, size = 80 }) => {
    // ... (This component remains unchanged)
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI * 2;
    const dashOffset = circumference - (circumference * percentage) / 100;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-slate-200" fill="transparent"/>
                <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-indigo-500 transition-all duration-1000 ease-in-out" fill="transparent" strokeLinecap="round" style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}/>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">{`${percentage}%`}</span>
        </div>
    );
};


const Dashboard = () => {
    const { backendUrl, user } = useContext(AppContent);
    const [dashboardData, setDashboardData] = useState({ profileCompletion: 0, openTaskCount: 0 }); // Default data updated
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
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar theme="light" />
            <div className="container mx-auto max-w-7xl pt-24 sm:pt-28 p-4 sm:p-6">
                
                {/* --- Header Section --- */}
                <div className="mb-8 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="mt-2 text-md text-slate-600">
                        Here's your mission control for everything EngiVerse.
                    </p>
                </div>

                {/* --- Main Dashboard Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Primary Column (Launchpad) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card 1: AI Interviewer */}
                        <Link to="/ai-interviewer" className="group block p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                           {/* ... (no changes here) ... */}
                           <div className="flex items-center gap-5">
                               <div className="bg-white/20 p-4 rounded-xl shadow-inner"><InterviewIcon /></div>
                               <div>
                                   <h2 className="text-xl font-bold">Practice Interviews</h2>
                                   <p className="text-sm opacity-80 mt-1">Build confidence with our AI Interview Bot</p>
                               </div>
                               <span className="ml-auto text-2xl font-semibold transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                           </div>
                        </Link>

                        {/* Card 2: Job Aggregator */}
                        <Link to="/jobs" className="group block p-6 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                           {/* ... (no changes here) ... */}
                            <div className="flex items-center gap-5">
                               <div className="bg-white/20 p-4 rounded-xl shadow-inner"><JobsIcon /></div>
                               <div>
                                   <h2 className="text-xl font-bold">Find Opportunities</h2>
                                   <p className="text-sm opacity-80 mt-1">Discover jobs matching your profile</p>
                               </div>
                               <span className="ml-auto text-2xl font-semibold transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                           </div>
                        </Link>

                        {/* === CHANGE IS HERE === */}
                        {/* Card 3: P2P Skill Exchange */}
                        <Link to="/skill-exchange" className="group block p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                             <div className="flex items-center gap-5">
                                <div className="bg-white/20 p-4 rounded-xl shadow-inner"><P2PIcon /></div>
                                <div className="flex-grow">
                                    <h2 className="text-xl font-bold">Collaborate with Peers</h2>
                                    <p className="text-sm opacity-80 mt-1">Get help on projects or offer your skills</p>
                                </div>
                                {/* Live Task Count Badge */}
                                {dashboardData.openTaskCount > 0 && (
                                    <div className="flex-shrink-0 bg-white/25 text-white text-sm font-bold px-4 py-2 rounded-full shadow-inner">
                                        {dashboardData.openTaskCount} Open Task{dashboardData.openTaskCount > 1 ? 's' : ''}
                                    </div>
                                )}
                                <span className="ml-2 text-2xl font-semibold transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                            </div>
                        </Link>
                    </div>

                    {/* --- Secondary Column (Profile Widget & More) --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200/80 text-center">
                            <h3 className="text-lg font-bold text-slate-800">Profile Completion</h3>
                            <div className="flex justify-center my-4">
                               <CircularProgressBar percentage={dashboardData?.profileCompletion || 0} />
                            </div>
                            <p className="text-sm text-slate-500 mb-4">
                                A complete profile gets 3x more views.
                            </p>
                            <Link to="/profile" className="w-full inline-block px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                                Go to Profile
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;