// Filename: client/src/components/cards/JobCard.jsx
// (Upgraded by your AI assistant with a dynamic Save button)

import React from 'react';

// Bookmark icon ke liye ek helper component
const BookmarkIcon = ({ isSaved, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path 
            fill={isSaved ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
        />
    </svg>
);

const JobCard = ({ job, isSaved, onSaveToggle }) => {
    const getPostedDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) { return dateString; }
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:border-indigo-300 hover:ring-2 hover:ring-indigo-50 transition-all duration-300 relative">
            
            {/* --- NEW: Save Job Button (Bookmark Icon) --- */}
            <button 
                onClick={(e) => { e.preventDefault(); onSaveToggle(job._id); }} 
                className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors duration-200 ${isSaved ? 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200' : 'text-gray-400 hover:bg-gray-100'}`}
                aria-label="Save job"
            >
                <BookmarkIcon isSaved={isSaved} />
            </button>

            <div className="flex items-start gap-4 pr-10"> {/* Added pr-10 to avoid overlap with button */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    {job.employer_logo ? (
                        <img src={job.employer_logo} alt={`${job.companyName} logo`} className="w-full h-full object-contain p-1 rounded-md" />
                    ) : (
                        <span className="text-xl font-bold text-gray-500">{job.companyName ? job.companyName[0].toUpperCase() : '?'}</span>
                    )}
                </div>
                
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition-colors pr-2">
                                {job.title}
                            </a>
                            <p className="text-md font-medium text-gray-600">{job.companyName}</p>
                            <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                        </div>
                        {job.jobType && <span className="flex-shrink-0 text-xs font-semibold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-full">{job.jobType}</span>}
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-700 mt-4 line-clamp-2">{job.description}</p>

            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    Posted: {getPostedDate(job.postedDate)}
                </p>
                <a 
                    href={job.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Apply Now
                </a>
            </div>
        </div>
    );
};

export default JobCard;