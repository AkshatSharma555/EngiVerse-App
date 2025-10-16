// Filename: client/src/pages/AIInterviewDashboard.jsx (FINAL & CORRECTED)

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Squares from '../components/ui/Squares';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import InterviewHistoryCard from '../components/cards/InterviewHistoryCard';
import { toast } from 'react-toastify';

// --- Interview Selection Modal Component ---
const InterviewSelectionModal = ({ onClose, onStart }) => {
    const [voice, setVoice] = useState('female');
    const handleStart = () => onStart({ voice });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md m-4 transform transition-all animate-slide-in-up">
                <h2 className="text-2xl font-bold text-gray-900">Choose Interviewer Voice</h2>
                <p className="mt-2 text-gray-600">Select a voice for your AI interviewer, Eva.</p>
                <fieldset className="mt-6">
                    <legend className="sr-only">Interviewer Voice</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ring-2 ring-transparent peer-checked:ring-indigo-500">
                            <input type="radio" name="voice" value="female" checked={voice === 'female'} onChange={(e) => setVoice(e.target.value)} className="sr-only peer" />
                            <div className="flex flex-1 items-center justify-between"><div className="flex flex-col items-center w-full"><svg className="w-12 h-12 text-gray-500 peer-checked:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg><p className="mt-2 font-semibold text-gray-800 peer-checked:text-indigo-600">Female</p></div></div>
                            <div className="absolute inset-0 rounded-lg border-2 peer-checked:border-indigo-500 pointer-events-none" aria-hidden="true"></div>
                        </label>
                        <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ring-2 ring-transparent peer-checked:ring-indigo-500">
                            <input type="radio" name="voice" value="male" checked={voice === 'male'} onChange={(e) => setVoice(e.target.value)} className="sr-only peer" />
                             <div className="flex flex-1 items-center justify-between"><div className="flex flex-col items-center w-full"><svg className="w-12 h-12 text-gray-500 peer-checked:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><p className="mt-2 font-semibold text-gray-800 peer-checked:text-indigo-600">Male</p></div></div>
                            <div className="absolute inset-0 rounded-lg border-2 peer-checked:border-indigo-500 pointer-events-none" aria-hidden="true"></div>
                        </label>
                    </div>
                </fieldset>
                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button onClick={handleStart} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Start Interview</button>
                </div>
            </div>
        </div>
    );
};

const Spinner = () => <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

const AIInterviewDashboard = () => {
    const { backendUrl } = useContext(AppContent);
    const navigate = useNavigate(); // This was the missing piece
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/interviews/history`);
                if (response.data.success) {
                    setHistory(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch interview history.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [backendUrl]);

    const handleStartInterview = ({ voice }) => {
        navigate('/practice-interviews', { state: { voice } });
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 z-0"><Squares /></div>
            <div className="relative z-10">
                <Navbar theme="transparent" />
                <div className="container mx-auto max-w-5xl pt-24 sm:pt-28 p-4 sm:p-6">
                    {isModalOpen && <InterviewSelectionModal onClose={() => setIsModalOpen(false)} onStart={handleStartInterview} />}
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Interview Zone</h1>
                            <p className="mt-2 text-lg text-gray-600">Practice, get feedback, and ace your next technical interview.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform hover:scale-105">
                            Start New Interview
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Past Sessions</h2>
                        {loading ? <Spinner /> : history.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {history.map(session => <InterviewHistoryCard key={session._id} session={session} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl border">
                                <h3 className="text-lg font-semibold text-gray-700">No history found.</h3>
                                <p className="text-gray-500 mt-1">Click "Start New Interview" to begin your first session!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInterviewDashboard;