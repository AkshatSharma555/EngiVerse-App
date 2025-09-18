// Filename: client/src/components/landing/HowItWorks.jsx

import React from 'react';
import SplitText from '../animations/SplitText';

// Helper components for icons
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

const steps = [
    {
        icon: <ProfileIcon />,
        title: "Create Your Profile",
        description: "Build a dynamic profile with your skills, projects, and achievements to showcase your talent to the world."
    },
    {
        icon: <RocketIcon />,
        title: "Prepare & Grow",
        description: "Use the AI bot to ace your interviews and collaborate with peers on the Skill Exchange to level up your abilities."
    },
    {
        icon: <TargetIcon />,
        title: "Apply with Confidence",
        description: "Discover and apply for top internships and jobs that perfectly match your skills, all from one place."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-20 sm:py-32 bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center mb-16">
                    <SplitText 
                        tag="h2"
                        text="How It Works"
                        className="text-3xl sm:text-4xl font-bold text-white"
                        splitType="words"
                        stagger={0.05}
                    />
                    <SplitText
                        tag="p"
                        text="Getting started is as easy as 1, 2, 3."
                        className="mt-4 text-lg text-gray-400"
                        splitType="words"
                        stagger={0.02}
                        delay={0.5}
                    />
                </div>
                
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Dotted line for desktop view */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                        <svg width="100%" height="2px">
                            <line x1="0" y1="1" x2="100%" y2="1" stroke="#4F46E5" strokeWidth="2" strokeDasharray="8 8" />
                        </svg>
                    </div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center p-6 bg-gray-900/50 rounded-xl border border-gray-700">
                            <div className="flex-shrink-0 mb-4 bg-gray-800 p-4 rounded-full border-2 border-indigo-500">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;