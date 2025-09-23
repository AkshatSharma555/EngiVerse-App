// Filename: client/src/pages/Jobs.jsx
// (Final, Complete Code with All Features including Manual Fetch)

import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import JobCard from '../components/cards/JobCard';
import { useInView } from 'react-intersection-observer';

// Helper Components
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>;
const BookmarkIcon = ({...props}) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>;
const CloudArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14a6 6 0 0 0 6 6h13a5 5 0 0 0 5-5c0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5l-5-5h3V9h4v4h3z"/></svg>;


const Jobs = () => {
    const { backendUrl, user } = useContext(AppContent);
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ jobType: [], location: '' });
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [newJobsCount, setNewJobsCount] = useState(0);
    const [lastFetchTimestamp, setLastFetchTimestamp] = useState(Date.now());
    const pollingIntervalRef = useRef(null);
    const [isManuallyFetching, setIsManuallyFetching] = useState(false);

    const { ref, inView } = useInView({ threshold: 0.5 });

    useEffect(() => {
        const fetchSavedJobIds = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${backendUrl}/api/saved-jobs/ids`);
                if (response.data.success) {
                    setSavedJobIds(new Set(response.data.data));
                }
            } catch (error) {
                console.error("Could not fetch saved job IDs", error);
            }
        };
        fetchSavedJobIds();
    }, [backendUrl, user]);

    const fetchJobs = useCallback(async (currentPage, isNewSearch) => {
        if (isNewSearch) {
            setLoading(true);
            setNewJobsCount(0); 
        } else {
            setIsFetchingMore(true);
        }
        try {
            const params = new URLSearchParams({ page: currentPage });
            if (searchTerm) params.append('search', searchTerm);
            if (filters.jobType.length > 0) params.append('jobType', filters.jobType.join(','));
            if (filters.location) params.append('location', filters.location);
            
            const response = await axios.get(`${backendUrl}/api/jobs?${params.toString()}`);
            
            if (response.data.success) {
                const { data: newJobs, totalPages: newTotalPages, totalJobs: newTotalJobs } = response.data;
                setJobs(prev => isNewSearch ? newJobs : [...prev, ...newJobs]);
                setTotalPages(newTotalPages);
                setTotalJobs(newTotalJobs);
                if(isNewSearch) {
                    setLastFetchTimestamp(Date.now());
                }
            }
        } catch (error) { toast.error("Failed to fetch jobs."); } 
        finally { setLoading(false); setIsFetchingMore(false); }
    }, [backendUrl, searchTerm, filters]);
    
    useEffect(() => {
        const checkForNewJobs = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/jobs/new-count?since=${lastFetchTimestamp}`);
                if (res.data.success && res.data.data.count > 0) {
                    setNewJobsCount(res.data.data.count);
                }
            } catch (error) {
                console.error("Error polling for new jobs:", error);
            }
        };

        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        pollingIntervalRef.current = setInterval(checkForNewJobs, 20000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [backendUrl, lastFetchTimestamp]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1);
            fetchJobs(1, true);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, filters, fetchJobs]);

    useEffect(() => {
        if (inView && !loading && !isFetchingMore && page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    }, [inView, loading, isFetchingMore, page, totalPages]);

    useEffect(() => {
        if (page > 1) {
            fetchJobs(page, false);
        }
    }, [page, fetchJobs]);

    const handleSaveToggle = async (jobId) => {
        try {
            const isCurrentlySaved = savedJobIds.has(jobId);
            if (isCurrentlySaved) {
                await axios.delete(`${backendUrl}/api/saved-jobs/${jobId}`);
                setSavedJobIds(prev => { const newSet = new Set(prev); newSet.delete(jobId); return newSet; });
                toast.info("Job removed from your list.");
            } else {
                await axios.post(`${backendUrl}/api/saved-jobs`, { jobId });
                setSavedJobIds(prev => new Set(prev).add(jobId));
                toast.success("Job saved successfully!");
            }
        } catch (error) { toast.error("Something went wrong."); }
    };

    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters(prev => {
            if (name === 'jobType') {
                const currentValues = prev.jobType;
                return { ...prev, jobType: checked ? [...currentValues, value] : currentValues.filter(item => item !== value) };
            }
            return { ...prev, [name]: checked ? value : '' };
        });
    };

    const handleShowNewJobs = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/jobs?since=${lastFetchTimestamp}`);
            if (res.data.success && res.data.data.length > 0) {
                setJobs(prev => [...res.data.data, ...prev]);
                setTotalJobs(prev => prev + res.data.data.length);
            }
            setNewJobsCount(0);
            setLastFetchTimestamp(Date.now());
        } catch (error) {
            toast.error("Could not load new jobs.");
        }
    };

    const handleManualFetch = async () => {
        setIsManuallyFetching(true);
        const toastId = toast.loading("Starting to fetch new jobs from sources...");

        try {
            const response = await axios.post(`${backendUrl}/api/jobs/refresh`);
            
            if (response.data.success) {
                toast.update(toastId, { 
                    render: "Jobs fetched successfully! Reloading list...", 
                    type: "success", 
                    isLoading: false, 
                    autoClose: 3000 
                });
                setPage(1);
                fetchJobs(1, true);
            } else {
                throw new Error(response.data.message || "Unknown error");
            }
        } catch (error) {
            toast.update(toastId, { 
                render: `Error: ${error.message || "Could not fetch new jobs."}`, 
                type: "error", 
                isLoading: false, 
                autoClose: 5000 
            });
        } finally {
            setIsManuallyFetching(false);
        }
    };
    
    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar theme="light" />
            <div className='container mx-auto max-w-7xl pt-24 sm:pt-28 p-4 sm:p-6'>
                <header className="mb-8">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Find Your Next Opportunity</h1>
                            <p className="mt-1 text-md text-gray-500">Search thousands of jobs from top companies.</p>
                        </div>
                        <div className="flex items-center gap-4"> 
                            <button
                                onClick={handleManualFetch}
                                disabled={isManuallyFetching}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                <CloudArrowDownIcon />
                                {isManuallyFetching ? 'Fetching...' : 'Fetch New Jobs'}
                            </button>
                            <Link to="/saved-jobs" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                <BookmarkIcon className="text-gray-500" />
                                View Saved Jobs
                            </Link>
                        </div>
                    </div>
                    <div className="relative mt-6 max-w-2xl">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></div>
                        <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full rounded-full border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="Search by title, company, or skill..."/>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <aside className="lg:col-span-1 lg:sticky lg:top-28">
                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Filters</h3>
                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Job Type</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center"><input id="internship" name="jobType" type="checkbox" value="Internship" onChange={handleFilterChange} checked={filters.jobType.includes('Internship')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label htmlFor="internship" className="ml-3 text-sm text-gray-600">Internship</label></div>
                                    <div className="flex items-center"><input id="full-time" name="jobType" type="checkbox" value="Full-time" onChange={handleFilterChange} checked={filters.jobType.includes('Full-time')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label htmlFor="full-time" className="ml-3 text-sm text-gray-600">Full-time</label></div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-700 mb-2">Location</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center"><input id="remote" name="location" type="checkbox" value="Remote" onChange={handleFilterChange} checked={filters.location === 'Remote'} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label htmlFor="remote" className="ml-3 text-sm text-gray-600">Remote</label></div>
                                </div>
                            </div>
                        </div>
                    </aside>
                    
                    <main className="lg:col-span-3">
                        <div className="flex justify-between items-center px-2 mb-4">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-bold text-gray-900">{jobs.length}</span> of <span className="font-bold text-gray-900">{totalJobs}</span> results
                            </p>
                            {newJobsCount > 0 && (
                                <button 
                                    onClick={handleShowNewJobs} 
                                    className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <RefreshIcon />
                                    Show {newJobsCount} New {newJobsCount > 1 ? 'Jobs' : 'Job'}
                                </button>
                            )}
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center py-10"><Spinner /></div>
                        ) : jobs.length > 0 ? (
                            <div className="space-y-4">
                                {jobs.map((job, index) => (
                                    <JobCard 
                                        key={`${job._id}-${index}`} 
                                        job={job} 
                                        isSaved={savedJobIds.has(job._id)} 
                                        onSaveToggle={handleSaveToggle} 
                                    />
                                ))}
                                {page < totalPages && (
                                    <div ref={ref} className="flex justify-center py-6">
                                        {isFetchingMore && <Spinner />}
                                    </div>
                                )}
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