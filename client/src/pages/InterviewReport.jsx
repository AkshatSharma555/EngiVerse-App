import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import Navbar from '../components/ui/Navbar';
import Squares from '../components/ui/Squares'; // Import the background for a premium look

const Spinner = () => <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

const InterviewReport = () => {
    const { sessionId } = useParams();
    const { backendUrl } = useContext(AppContent);
    const [session, setSession] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return;
            try {
                const response = await axios.get(`${backendUrl}/api/interviews/${sessionId}`);
                if (response.data.success) {
                    const sessionData = response.data.data;
                    setSession(sessionData);
                    
                    // --- THIS IS THE FIX ---
                    // Correctly parse the finalReport JSON string into the report state
                    if (sessionData.finalReport) {
                        const parsedReport = JSON.parse(sessionData.finalReport);
                        // Also, add the overallScore from the main session object into the parsed report
                        parsedReport.overallScore = sessionData.overallScore;
                        setReport(parsedReport);
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

    if (loading) return <div className="min-h-screen bg-slate-50 relative"><Navbar theme="light" /><Spinner /></div>;
    if (!session) return <div className="min-h-screen bg-slate-50 relative"><Navbar theme="light" /><p className="text-center pt-40">Report not found.</p></div>;

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 z-0"><Squares /></div>
            <div className="relative z-10">
                <Navbar theme="transparent" />
                <div className="container mx-auto max-w-4xl pt-24 sm:pt-28 p-4 sm:p-6">
                    <Link to="/ai-interviewer" className="text-indigo-600 font-semibold hover:underline mb-6 inline-block">&larr; Back to Interview Dashboard</Link>

                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200/50">
                        <h1 className="text-3xl font-bold text-gray-900">Interview Report</h1>
                        <p className="text-gray-500 mt-1">Session from {new Date(session.createdAt).toLocaleString()}</p>
                        
                        {report ? (
                            <div className="space-y-8 mt-8">
                                <div className="text-center bg-indigo-50/50 p-6 rounded-lg border border-indigo-200">
                                    <h3 className="text-lg font-semibold text-indigo-800">Overall Score</h3>
                                    <p className="text-6xl font-bold text-indigo-600 mt-2">{report.overallScore}<span className="text-2xl text-gray-500">/100</span></p>
                                    <p className="mt-4 text-indigo-700 max-w-2xl mx-auto">{report.summary}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-green-50/50 p-6 rounded-lg border border-green-200">
                                        <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">✅ Strengths</h3>
                                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{report.strengths}</p>
                                    </div>

                                    <div className="bg-orange-50/50 p-6 rounded-lg border border-orange-200">
                                        <h3 className="text-xl font-bold text-orange-800 flex items-center gap-2">💡 Areas for Improvement</h3>
                                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{report.areasForImprovement}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-8 text-gray-600">A detailed report for this session is not available.</p>
                        )}
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200/50 mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Full Transcript</h2>
                        <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                            {session.conversationHistory.map((msg, index) => (
                                <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xl p-4 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-900 rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                        <p className="font-bold capitalize">{msg.role === 'model' ? 'Interviewer' : 'You'}</p>
                                        <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
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