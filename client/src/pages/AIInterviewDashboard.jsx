import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Squares from '../components/ui/Squares';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import InterviewHistoryCard from '../components/cards/InterviewHistoryCard';
import { toast } from 'react-toastify';

// --- Improved Modal with Click Outside Close ---
const InterviewSelectionModal = ({ onClose, onStart }) => {
    const [voice, setVoice] = useState('female');
    
    // Close modal if clicked outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div onClick={handleBackdropClick} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md m-4 shadow-2xl animate-slide-in-up">
                <h2 className="text-2xl font-bold text-gray-900">Configure Interviewer</h2>
                <p className="mt-2 text-gray-600">Select AI voice persona.</p>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                    {['female', 'male'].map((v) => (
                        <label key={v} className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${voice === v ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                            <input type="radio" name="voice" value={v} checked={voice === v} onChange={() => setVoice(v)} className="sr-only" />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${voice === v ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {v === 'female' ? '👩‍💼' : '👨‍💼'}
                            </div>
                            <span className={`font-semibold capitalize ${voice === v ? 'text-indigo-700' : 'text-gray-600'}`}>{v}</span>
                        </label>
                    ))}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={() => onStart({ voice })} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">Start Session</button>
                </div>
            </div>
        </div>
    );
};

// --- UX: Skeleton Loading for Cards ---
const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 h-40 animate-pulse">
                <div className="flex justify-between">
                    <div className="space-y-3">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="mt-8 h-8 w-full bg-gray-100 rounded"></div>
            </div>
        ))}
    </div>
);

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
                // Silent fail or small toast, don't block UI
                console.error("Fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [backendUrl]);

    const handleStartInterview = ({ voice }) => {
        navigate('/practice-interviews', { state: { voice } });
    };

    // UX: Instant delete from UI without refetching
    const removeSessionFromState = (id) => {
        setHistory(prev => prev.filter(session => session._id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 z-0"><Squares /></div>
            <div className="relative z-10">
                <Navbar theme="transparent" />
                
                <div className="container mx-auto max-w-5xl pt-24 sm:pt-28 p-4 sm:p-6">
                    {isModalOpen && <InterviewSelectionModal onClose={() => setIsModalOpen(false)} onStart={handleStartInterview} />}
                    
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Interview Zone</h1>
                            <p className="mt-1 text-gray-600">Master your technical skills with AI-driven mock interviews.</p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <span>+</span> Start New Interview
                        </button>
                    </div>

                    {/* History Section */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            Recent Sessions 
                            <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{history.length}</span>
                        </h2>
                        
                        {loading ? (
                            <DashboardSkeleton />
                        ) : history.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {history.map(session => (
                                    <InterviewHistoryCard 
                                        key={session._id} 
                                        session={session} 
                                        onDelete={removeSessionFromState} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="text-lg font-semibold text-gray-700">No interviews yet</h3>
                                <p className="text-gray-500 mt-1 max-w-xs mx-auto">Click the button above to start your first AI mock interview and get instant feedback.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInterviewDashboard;