// Filename: client/src/pages/InterviewReport.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import Navbar from '../components/ui/Navbar';

const Spinner = () => <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

const InterviewReport = () => {
    const { sessionId } = useParams();
    const { backendUrl } = useContext(AppContent);
    const [session, setSession] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/interviews/${sessionId}`);
                if (response.data.success) {
                    const sessionData = response.data.data;
                    setSession(sessionData);
                    // Parse the JSON string from finalReport
                    if(sessionData.finalReport) {
                        setReport(JSON.parse(sessionData.finalReport));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch session report.", error);
            } finally {
                setLoading(false);
            }
        };
        if(sessionId) fetchSession();
    }, [backendUrl, sessionId]);

    if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><Spinner /></div>;
    if (!session) return <div className="min-h-screen bg-slate-50"><Navbar /><p className="text-center pt-40">Report not found.</p></div>;

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar theme="light" />
            <div className="container mx-auto max-w-4xl pt-24 sm:pt-28 p-4 sm:p-6">
                <Link to="/ai-interviewer" className="text-indigo-600 hover:underline mb-6 inline-block">&larr; Back to Interview Dashboard</Link>

                <div className="bg-white p-8 rounded-xl shadow-md border">
                    <h1 className="text-3xl font-bold text-gray-900">Interview Report</h1>
                    <p className="text-gray-500 mt-1">Session from {new Date(session.createdAt).toLocaleString()}</p>
                    
                    {report ? (
                        <div className="space-y-8 mt-8">
                            <div className="text-center bg-indigo-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-indigo-800">Overall Score</h3>
                                <p className="text-6xl font-bold text-indigo-600 mt-2">{report.overallScore}<span className="text-2xl">/100</span></p>
                                <p className="mt-4 text-indigo-700">{report.summary}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">✅ Strengths</h3>
                                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{report.strengths}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-800">💡 Areas for Improvement</h3>
                                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{report.areasForImprovement}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-8 text-gray-600">A detailed report for this session is not available.</p>
                    )}
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md border mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Full Transcript</h2>
                    <div className="space-y-6">
                        {session.conversationHistory.map((msg, index) => (
                            <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-4 rounded-lg ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-100 text-gray-800'}`}>
                                    <p className="font-bold capitalize">{msg.role === 'model' ? 'Eva' : 'You'}</p>
                                    <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewReport;