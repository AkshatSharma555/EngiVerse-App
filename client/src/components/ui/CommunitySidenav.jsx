// Filename: client/src/components/ui/CommunitySidenav.jsx (Styling & Animation Enhanced Version)

import React from 'react';
import { NavLink } from 'react-router-dom';

// --- Icons (Enhanced for better visibility) ---
const ExchangeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-1.5-7a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/><path d="M1.716 5.158c.21-1.33.956-2.45 1.94-3.21.984-.76 2.24-1.233 3.6-1.402a1 1 0 1 1 .283 1.983c-1.13.143-2.115.54-2.88 1.14-.764.6-1.32 1.48-1.483 2.593a1 1 0 1 1-1.96-.284zM14.284 5.158a1 1 0 0 1-1.96-.284c-.164-1.114-.72-1.994-1.484-2.594-.765-.6-1.75-.997-2.88-1.14a1 1 0 1 1 .283-1.983c1.36.17 2.616.642 3.6 1.402.984.76 1.73 1.88 1.94 3.21a1 1 0 0 1-1.696.568z"/></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5.5A.5.5 0 0 1 3 .5V2h10V.5a.5.5 0 0 1 1 0V2a1 1 0 0 1 1 1v2.538a2 2 0 0 1-.808 1.586l-3.67 1.932-1.266 3.165A.5.5 0 0 1 8 11.5l-1.266-3.165-3.67-1.932A2 2 0 0 1 1 5.538V3a1 1 0 0 1 1-1V.5a.5.5 0 0 1 .5-.5zM3 3v2.538a1 1 0 0 0 .404.793l3.072 1.616L8 9.5l1.52-3.793 3.072-1.616A1 1 0 0 0 13 5.538V3H3z"/><path d="M8 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M6 14.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1z"/></svg>;
const ExploreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.027 9.184a5.03 5.03 0 0 0-4.385-4.385C5.053 4.232 3.1 5.683 2.083 7.757a.5.5 0 0 0 .866.5A4.03 4.03 0 0 1 7.23 4.71a4.03 4.03 0 0 1 3.54 3.54.5.5 0 0 0 .5.866c2.074-1.017 3.525-2.968 3.957-5.553a.5.5 0 0 0-.5-.866c-.45.242-1.57-1.58.915a4.99 4.99 0 0 0-.173.125zM4.622 11.23a4.99 4.99 0 0 0 .173-.125c.58-.345 1.13-.673 1.58-.915a.5.5 0 0 0-.5-.866c-2.585.432-4.536 2.383-5.553 3.957a.5.5 0 0 0 .866.5A4.03 4.03 0 0 1 4.71 8.77a4.03 4.03 0 0 1 3.54-3.54.5.5 0 0 0 .866-.5c-1.017-2.074-2.968-3.525-5.553-3.957a.5.5 0 0 0-.866.5c.242.45.57 1.13.915 1.58a4.99 4.99 0 0 0 .125.173z"/></svg>;

const FriendsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm8.5 5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>;


const CommunitySidenav = () => {
    // --- Define base classes for nav links ---
    const navLinkClasses = "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out transform";
    
    // --- Define styles for active and inactive states ---
    const activeClass = "bg-indigo-600 text-white font-bold shadow-lg scale-105";
    const inactiveClass = "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md hover:-translate-y-1";

    return (
        <aside className="md:col-span-1">
            {/* --- Container with Glassmorphism effect --- */}
            <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-gray-200/80 space-y-2 sticky top-28">
                
                {/* --- Section Title --- */}
                <h3 className="px-3 pt-1 pb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Community
                </h3>
                
                <NavLink 
                    to="/skill-exchange" 
                    end 
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                >
                    <ExchangeIcon />
                    <span>Skill Exchange</span>
                </NavLink>

                <NavLink 
                    to="/leaderboard" 
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                >
                    <TrophyIcon />
                    <span>Leaderboard</span>
                </NavLink>

                <NavLink 
                    to="/explore" 
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                >
                    <ExploreIcon />
                    <span>Explore</span>
                </NavLink>

                <NavLink 
                    to="/friends" 
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                >
                    <FriendsIcon />
                    <span>Friends</span>
                </NavLink>
                
                <NavLink 
                    to="/messages" 
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                >
                    <ChatIcon />
                    <span>Messages</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default CommunitySidenav;