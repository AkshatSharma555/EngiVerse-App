// Filename: client/src/pages/Jobs.jsx
// (Updated by your AI assistant with live search and filtering)

import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/ui/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import JobCard from '../components/cards/JobCard';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

const Jobs = () => {
    const { backendUrl, user } = useContext(AppContent);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NEW: State for search and filters ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        jobType: '',
        location: ''
    });

    // This useEffect hook will re-run whenever search or filters change
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                // Build the query string from state
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (filters.jobType) params.append('jobType', filters.jobType);
                if (filters.location) params.append('location', filters.location);
                
                // Pre-fill search with user's top skill if the search bar is empty
                if (!searchTerm && user?.skills?.length > 0) {
                    params.append('search', user.skills[0]);
                }

                const response = await axios.get(`${backendUrl}/api/jobs?${params.toString()}`);
                
                if (response.data.success) {
                    setJobs(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch jobs.");
                console.error("Fetch Jobs Error:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debouncing: Yeh API call ko tab tak delay karega jab tak user type karna band na kar de
        const delayDebounceFn = setTimeout(() => {
            fetchJobs();
        }, 500); // 500ms ka delay

        return () => clearTimeout(delayDebounceFn);
    }, [backendUrl, searchTerm, filters, user]);

    // --- NEW: Handler for filter checkboxes ---
    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;
        
        // Simple logic for single checkbox selection per category for now
        setFilters(prev => ({
            ...prev,
            [name]: checked ? value : ''
        }));
    };

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar theme="light" />
            <div className='container mx-auto max-w-7xl pt-24 sm:pt-28 p-4 sm:p-6'>
                
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Find Your Next Opportunity</h1>
                    <p className="mt-1 text-md text-gray-500">
                        {/* Personalized message */}
                        {user?.skills?.length > 0 ? `Showing results for your top skill: ${user.skills[0]}` : "Search for internships and jobs from top companies."}
                    </p>
                    <div className="relative mt-6 max-w-2xl">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></div>
                        <input
                            type="search"
                            className="block w-full rounded-full border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            placeholder="Search by title, company, or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Filters</h3>
                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Job Type</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center"><input id="internship" name="jobType" type="checkbox" value="Internship" onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label htmlFor="internship" className="ml-3 text-sm text-gray-600">Internship</label></div>
                                    <div className="flex items-center"><input id="full-time" name="jobType" type="checkbox" value="Full-time" onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label htmlFor="full-time" className="ml-3 text-sm text-gray-600">Full-time</label></div>
                                </div>
                            </div>
                             <div className="mt-6">
                                <h4 className="font-semibold text-gray-700 mb-2">Location</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center"><input id="remote" name="location" type="checkbox" value="Remote" onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label htmlFor="remote" className="ml-3 text-sm text-gray-600">Remote</label></div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="lg:col-span-3">
                        {loading ? (
                            <p className='text-center text-gray-500'>Loading jobs, please wait...</p>
                        ) : jobs.length > 0 ? (
                            <div className="space-y-4">
                                {jobs.map(job => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <h3 className="text-xl font-semibold text-gray-700">No Jobs Found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;