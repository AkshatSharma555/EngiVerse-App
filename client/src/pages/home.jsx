// Filename: client/src/pages/home.jsx
// (Updated to include the FinalCTA section)

import React from 'react';
import Navbar from '../components/ui/Navbar';
import Header from '../components/landing/Header';
import LiquidEther from '../components/landing/LiquidEther';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import FAQ from '../components/landing/FAQ';
import FinalCTA from '../components/landing/FinalCTA'; // Naye section ko import karein

const Home = () => {
  return (
    <div className='relative w-full bg-black'>
      {/* Background Layer */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <LiquidEther 
          colors={['#1e3a8a', '#4338ca', '#6d28d9']}
          mouseForce={25}
          cursorSize={100}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center w-full h-screen">
            <Navbar theme="transparent" />
            <Header />
        </div>
        
        <FeaturesSection />
        <HowItWorks />
        <FAQ />

        {/* --- Naya "Final CTA" Section yahan add kiya hai --- */}
        <FinalCTA />

      </div>
    </div>
  );
};

export default Home;