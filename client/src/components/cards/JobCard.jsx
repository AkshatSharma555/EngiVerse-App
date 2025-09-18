// Filename: client/src/components/cards/JobCard.jsx

import React from 'react';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-indigo-700">{job.title}</h2>
                    <p className="text-md font-semibold text-gray-800 mt-1">{job.companyName}</p>
                    <p className="text-sm text-gray-500 mt-2">{job.location}</p>
                </div>
                <span className="text-xs font-semibold text-white bg-indigo-500 px-2.5 py-1 rounded-full">{job.jobType}</span>
            </div>
            <p className="text-sm text-gray-600 mt-4 line-clamp-3">{job.description}</p>
            <div className="flex justify-between items-center mt-6">
                <p className="text-xs text-gray-400">
                    Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
                </p>
                <a 
                    href={job.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700"
                >
                    Apply Now
                </a>
            </div>
        </div>
    );
};

export default JobCard;