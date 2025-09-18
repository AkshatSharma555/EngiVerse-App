// Filename: client/src/components/landing/FeaturesSection.jsx

import React from 'react';
import SpotlightCard from '../cards/SpotlightCard';
import { InterviewIcon, JobsIcon, P2PIcon } from '../ui/DashboardIcons'; // Icons ko `ui` folder se import kar rahe hain
import SplitText from '../animations/SplitText';

const features = [
    {
        icon: <InterviewIcon />,
        title: "Ace Your Interviews",
        description: "Conquer interview anxiety with our AI bot. Get real-time feedback on technical & HR questions and track your growth.",
        color: "rgba(129, 140, 248, 0.15)" // Indigo
    },
    {
        icon: <JobsIcon />,
        title: "Discover Opportunities",
        description: "Stop juggling multiple portals. We bring the best internships and job listings directly to your dashboard.",
        color: "rgba(56, 189, 248, 0.15)" // Sky
    },
    {
        icon: <P2PIcon />,
        title: "Collaborate & Grow",
        description: "Stuck on a project? Connect with fellow students, exchange skills, and access a library of verified project reports.",
        color: "rgba(52, 211, 153, 0.15)" // Emerald
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-20 sm:py-32">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center mb-12">
                    <SplitText 
                        tag="h2"
                        text="The Ultimate Toolkit for Every Engineering Student"
                        className="text-3xl sm:text-4xl font-bold text-white"
                        splitType="words"
                        stagger={0.05}
                    />
                    <SplitText
                        tag="p"
                        text="EngiVerse is more than just an app—it's your personal career co-pilot."
                        className="mt-4 text-lg text-gray-400"
                        splitType="words"
                        stagger={0.02}
                        delay={0.5}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <SpotlightCard key={index} spotlightColor={feature.color}>
                            <div className="relative z-10 flex flex-col items-start h-full">
                                <div className="bg-gray-800 p-3 rounded-full mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm flex-grow">{feature.description}</p>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;