// Filename: client/src/components/ui/CommunityLayout.jsx (UPDATED WITH BG & PADDING FIX)

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CommunitySidenav from './CommunitySidenav';
import Squares from './Squares'; // Import the animated background

const CommunityLayout = () => {
    return (
        // The main container now has a relative position for the background
        <div className='min-h-screen bg-slate-50 relative'>
            
            {/* --- Animated Background --- */}
            {/* This is placed in the background with absolute positioning */}
            <div className="absolute inset-0 z-0">
                <Squares />
            </div>

            {/* --- Main Content on Top --- */}
            {/* All content is placed in a relative container on top of the background */}
            <div className="relative z-10">
                <Navbar theme="transparent" />
                
                {/* --- PADDING FIX IS HERE --- */}
                {/* Changed padding from p-4/p-6 to px-4/px-12 to match the Navbar's horizontal padding */}
                <div className='container mx-auto max-w-7xl pt-24 sm:pt-28 px-4 sm:px-12 pb-12'>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        
                        <CommunitySidenav />

                        <main className="md:col-span-3">
                            <Outlet />
                        </main>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityLayout;