// Filename: client/src/components/landing/Header.jsx
// (Final polished version with simplified, faster animation)

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SplitText from '../animations/SplitText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Header = () => {
    const navigate = useNavigate();
    const buttonRef = useRef(null);

    // GSAP ka use karke button ko animate karenge
    useGSAP(() => {
        gsap.from(buttonRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: 1, // Updated delay
        });
    }, { scope: buttonRef });

    return (
        <div className="text-center flex flex-col items-center px-4 max-w-4xl mx-auto">
            
            {/* --- FIX 1: Main Headline ab ek single component hai, bina gradient ke --- */}
            <SplitText
                tag="h1"
                text="Your All-in-One Ecosystem for Engineering Success."
                className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
                splitType="words"
                stagger={0.05} // Stagger between words
                duration={0.8}
                ease="power3.out"
            />

            {/* --- FIX 2: Sub-headline ka animation fast kar diya hai --- */}
            <div className="mt-8">
                <SplitText
                    tag="p"
                    text="Practice interviews with our AI bot, collaborate on projects with peers, and discover top internships and jobs—all in one place."
                    className="max-w-2xl text-lg text-gray-300"
                    splitType="words"
                    from={{ opacity: 0, y: 15 }}
                    delay={0.2}      // Delay kam kar diya hai
                    stagger={0.02}   // Stagger bhi thoda fast hai
                    duration={0.12} // Duration bhi kam kar diya hai
                />
            </div>
            
            {/* Call to Action Button */}
            <div className="mt-10" ref={buttonRef}>
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Header;