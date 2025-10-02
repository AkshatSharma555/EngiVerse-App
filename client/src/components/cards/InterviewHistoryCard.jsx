// Filename: client/src/components/cards/InterviewHistoryCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>;
const TopicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.5a.5.5 0 0 1-1 0V2.707l-1.646 1.647a.5.5 0 0 1-.708-.708L15.293.293a.5.5 0 0 1 .707 0l2.646 2.647a.5.5 0 0 1-.708.708L16 2.707V8.5z"/><path d="M1 11.5a.5.5 0 0 1 1 0V13.293l1.646-1.647a.5.5 0 0 1 .708.708L1.707 14.293a.5.5 0 0 1-.707 0L-1.646 11.647a.5.5 0 0 1 .708-.708L1 13.293V11.5z"/></svg>;


const InterviewHistoryCard = ({ session }) => {
    return (
        <Link 
            to={`/interviews/report/${session._id}`} // Future route for detailed report
            className="block bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 transition-all hover:shadow-lg hover:scale-[1.03]"
        >
            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-indigo-600 flex items-center gap-2">
                    <TopicIcon />
                    {session.topic || 'General Interview'}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                    <CalendarIcon />
                    {new Date(session.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-3xl font-bold text-gray-800">{session.overallScore || 'N/A'}</p>
            </div>
        </Link>
    );
};

export default InterviewHistoryCard;