import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import Navbar from '../components/ui/Navbar';
import Squares from '../components/ui/Squares';

// UX: Custom Skeleton for Report
const ReportSkeleton = () => (
    <div className="max-w-4xl mx-auto pt-32 p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
        <div className="h-40 bg-gray-200 rounded-xl mb-6"></div>
        <div className="grid grid-cols-2 gap-6">
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
        </div>
    </div>
);

const InterviewReport = () => {
    const { sessionId } = useParams();
    const { backendUrl } = useContext(AppContent);
    const [session, setSession] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return;
            try {
                const response = await axios.get(`${backendUrl}/api/interviews/${sessionId}`);
                if (response.data.success) {
                    const sessionData = response.data.data;
                    setSession(sessionData);
                    
                    if (sessionData.finalReport) {
                        try {
                            const parsedReport = JSON.parse(sessionData.finalReport);
                            parsedReport.overallScore = sessionData.overallScore;
                            setReport(parsedReport);
                        } catch (e) {
                            console.error("JSON Parse Error", e);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch session report.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [backendUrl, sessionId]);

    if (loading) return <div className="min-h-screen bg-slate-50 relative"><Navbar theme="transparent" /><ReportSkeleton /></div>;
    
    // UX: Better Not Found State
    if (!session) return (
        <div className="min-h-screen bg-slate-50 relative flex items-center justify-center">
            <Navbar theme="transparent" />
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Report Not Found</h2>
                <button onClick={() => navigate('/interviews')} className="mt-4 text-indigo-600 hover:underline">Go back to Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 z-0"><Squares /></div>
            <div className="relative z-10">
                <Navbar theme="transparent" />
                <div className="container mx-auto max-w-4xl pt-24 sm:pt-28 p-4 sm:p-6 pb-20">
                    
                    {/* UX: Improved Back Navigation */}
                    <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-medium mb-6 transition-colors group">
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        Back to Dashboard
                    </Link>

                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50">
                        <div className="flex justify-between items-start border-b pb-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Performance Report</h1>
                                <p className="text-gray-500 mt-1 flex items-center gap-2">
                                    <span>📅 {new Date(session.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>⏰ {new Date(session.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${report?.overallScore >= 80 ? 'bg-green-100 text-green-700' : report?.overallScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {report?.overallScore || 0}/100
                            </div>
                        </div>
                        
                        {report ? (
                            <div className="space-y-8">
                                {/* Summary Section */}
                                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-800 mb-2">Executive Summary</h3>
                                    <p className="text-indigo-900 leading-relaxed text-lg">{report.summary}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                        <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                                            <span>💪</span> Key Strengths
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{report.strengths}</p>
                                    </div>

                                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                        <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                                            <span>📈</span> Growth Areas
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{report.areasForImprovement}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">Analysis pending or unavailable for this session.</p>
                            </div>
                        )}
                    </div>

                    {/* Transcript Accordion Style */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 mt-8 overflow-hidden">
                        <div className="p-6 bg-gray-50 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Conversation Transcript</h2>
                        </div>
                        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                            {session.conversationHistory.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                        <p className="text-xs font-bold mb-1 opacity-70 uppercase">{msg.role === 'model' ? 'AI Interviewer' : 'Candidate'}</p>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewReport;