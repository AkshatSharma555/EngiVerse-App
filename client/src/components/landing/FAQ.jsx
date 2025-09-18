// Filename: client/src/components/landing/FAQ.jsx

import React, { useState } from 'react';
import SplitText from '../animations/SplitText';

// Data for our FAQ section
const faqData = [
    {
        question: "Is EngiVerse free for students?",
        answer: "Yes! All core features of EngiVerse, including the AI Interview Bot, P2P Skill Exchange, and Job Aggregator, are completely free for students to use."
    },
    {
        question: "Who is this platform for?",
        answer: "EngiVerse is specifically designed for engineering students from all branches and years who want to enhance their skills, prepare for careers, and connect with their peers."
    },
    {
        question: "How is EngiVerse different from other platforms?",
        answer: "Unlike other platforms that are recruiter-focused or fragmented, EngiVerse is a student-centric ecosystem. We combine interview prep, peer collaboration, and job searching into one seamless, integrated experience."
    },
    {
        question: "Is my personal and project data secure?",
        answer: "Absolutely. We take your privacy and data security very seriously. All your data is securely stored and is never shared with third parties without your explicit consent."
    }
];

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-700 py-6">
            <dt>
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex w-full items-start justify-between text-left text-gray-300"
                >
                    <span className="text-base font-semibold text-white">{question}</span>
                    <span className="ml-6 flex h-7 items-center">
                        {/* Plus/Minus Icon */}
                        <svg className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? '-rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </button>
            </dt>
            {/* Animated Answer Panel */}
            <dd className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                <p className="text-base text-gray-400">{answer}</p>
            </dd>
        </div>
    );
};

const FAQ = () => {
    return (
        <section className="py-20 sm:py-32">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6">
                 <div className="text-center mb-12">
                    <SplitText 
                        tag="h2"
                        text="Frequently Asked Questions"
                        className="text-3xl sm:text-4xl font-bold text-white"
                        splitType="words"
                        stagger={0.05}
                    />
                </div>
                <dl className="space-y-4">
                    {faqData.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </dl>
            </div>
        </section>
    );
};

export default FAQ;