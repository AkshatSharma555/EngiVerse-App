// Filename: client/src/components/landing/FinalCTA.jsx
// (Updated for better text rendering and alignment)

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SplitText from '../animations/SplitText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const FinalCTA = () => {
    const navigate = useNavigate();
    const buttonRef = useRef(null);

    useGSAP(() => {
        gsap.from(buttonRef.current, {
            scrollTrigger: {
                trigger: buttonRef.current,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
        });
    }, { scope: buttonRef });

    return (
        <section className="py-20 sm:py-32">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
                {/* Headline text container */}
                <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                    {/* Direct text, SplitText se ab sirf words ko split karenge */}
                    <SplitText 
                        text="Ready to Supercharge Your Career?"
                        splitType="words" // Ab words ko split kar rahe hain
                        stagger={0.05}
                        className="inline-block whitespace-normal" // Inline-block aur normal whitespace
                    />
                </h2>
                <p className="mt-4 text-lg text-gray-400">
                    Join thousands of students on the path to success. Sign up for free.
                </p>
                <div className="mt-10" ref={buttonRef}>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-white text-black text-lg font-semibold rounded-full shadow-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                    >
                        Sign Up for Free
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;