// Filename: client/src/pages/AIInterviewDashboard.jsx

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
    const [domain, setDomain] = useState('MERN Stack');
    const [voice, setVoice] = useState('female');

    const handleStart = () => onStart({ domain, voice });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md m-4 transform transition-all animate-slide-in-up">
                <h2 className="text-2xl font-bold text-gray-900">Configure Your Interview</h2>
                <p className="mt-2 text-gray-600">Choose a domain and voice for your AI interviewer, Eva.</p>
                <div className="space-y-6 mt-6">
                    <div>
                        <label htmlFor="domain" className="block text-sm font-semibold text-gray-700">Domain</label>
                        <select id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option>MERN Stack</option>
                            <option>Data Science</option>
                            <option>Core CS</option>
                            <option>HR Mix</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Interviewer Voice</label>
                        <fieldset className="mt-2">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center cursor-pointer"><input type="radio" name="voice" value="female" checked={voice === 'female'} onChange={(e) => setVoice(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300"/> <span className="ml-3 text-sm text-gray-700">Female</span></label>
                                <label className="flex items-center cursor-pointer"><input type="radio" name="voice" value="male" checked={voice === 'male'} onChange={(e) => setVoice(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300"/> <span className="ml-3 text-sm text-gray-700">Male</span></label>
                            </div>
                        </fieldset>
                    </div>
                </div>
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
    const navigate = useNavigate();
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

    const handleStartInterview = ({ domain, voice }) => {
        navigate('/practice-interviews', { state: { domain, voice } });
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
                        {loading ? (
                            <Spinner />
                        ) : history.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* The history card will now automatically display the score */}
                                {history.map(session => (
                                    <InterviewHistoryCard key={session._id} session={session} />
                                ))}
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