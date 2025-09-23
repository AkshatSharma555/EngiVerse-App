// Filename: client/src/components/layouts/CommunityLayout.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';

// --- Self-contained Icons for the Sidenav ---
const ExchangeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-1.5-7a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/><path d="M1.716 5.158c.21-1.33.956-2.45 1.94-3.21.984-.76 2.24-1.233 3.6-1.402a1 1 0 1 1 .283 1.983c-1.13.143-2.115.54-2.88 1.14-.764.6-1.32 1.48-1.483 2.593a1 1 0 1 1-1.96-.284zM14.284 5.158a1 1 0 0 1-1.96-.284c-.164-1.114-.72-1.994-1.484-2.594-.765-.6-1.75-.997-2.88-1.14a1 1 0 1 1 .283-1.983c1.36.17 2.616.642 3.6 1.402.984.76 1.73 1.88 1.94 3.21a1 1 0 0 1-1.696.568z"/></svg>;
const FriendsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm8.5 5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>;

const CommunityLayout = () => {
    const navLinkClasses = "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors";
    const activeClass = "bg-indigo-100 text-indigo-700 font-semibold";
    const inactiveClass = "text-gray-600 hover:bg-gray-100";

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar theme="light" />
            <div className="container mx-auto max-w-7xl pt-24 sm:pt-28 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* --- Sidenav --- */}
                    <aside className="md:col-span-1">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                            <NavLink to="/skill-exchange" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
                                <ExchangeIcon /> Skill Exchange
                            </NavLink>
                            <NavLink to="/friends" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
                                <FriendsIcon /> Friends
                            </NavLink>
                            <NavLink to="/messages" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
                                <ChatIcon /> Messages
                            </NavLink>
                        </div>
                    </aside>

                    {/* --- Main Content Area --- */}
                    <main className="md:col-span-3">
                        <Outlet /> {/* Yahan par child routes (SkillExchange, Friends, etc.) render honge */}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CommunityLayout;
