// Filename: client/src/pages/SavedJobs.jsx
// (Corrected by your AI assistant to define ArrowLeftIcon)

import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/ui/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import JobCard from '../components/cards/JobCard';
import { Link } from 'react-router-dom';

const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>;

// --- FIX: Humne ArrowLeftIcon ka code yahan add kar diya hai ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>;


const SavedJobs = () => {
    const { backendUrl } = useContext(AppContent);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendUrl}/api/saved-jobs`);
                if (response.data.success) {
                    const jobs = response.data.data.map(item => item.job).filter(Boolean); // Filter out null jobs
                    setSavedJobs(jobs);
                }
            } catch (error) {
                toast.error("Failed to fetch saved jobs.");
            } finally {
                setLoading(false);
            }
        };
        fetchSavedJobs();
    }, [backendUrl]);

    const handleUnsave = async (jobId) => {
        try {
            await axios.delete(`${backendUrl}/api/saved-jobs/${jobId}`);
            setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
            toast.info("Job removed from your list.");
        } catch (error) {
            toast.error("Failed to remove job. Please try again.");
        }
    };

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar theme="light" />
            <div className='container mx-auto max-w-4xl pt-24 sm:pt-28 p-4 sm:p-6'>
                
                <Link 
                    to="/jobs" 
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group"
                >
                    <ArrowLeftIcon />
                    <span className="font-semibold group-hover:underline">Back to All Jobs</span>
                </Link>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Your Saved Jobs</h1>
                    <p className="mt-1 text-md text-gray-500">Here are all the opportunities you've bookmarked.</p>
                </header>

                <main>
                    {loading ? (
                        <div className="flex justify-center py-10"><Spinner /></div>
                    ) : savedJobs.length > 0 ? (
                        <div className="space-y-4">
                            {savedJobs.map(job => (
                                <JobCard 
                                    key={job._id} 
                                    job={job}
                                    isSaved={true}
                                    onSaveToggle={handleUnsave}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-700">No Saved Jobs Yet</h3>
                            <p className="text-gray-500 mt-2">Start exploring and save jobs you're interested in!</p>
                            <Link to="/jobs" className="mt-4 inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
                                Find Jobs
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SavedJobs;