// Filename: client/src/pages/SkillExchange.jsx (UPDATED)

import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/ui/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import TaskCard from '../components/cards/TaskCard';

// Helper Components
const Spinner = () => ( <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div></div> );
const ErrorDisplay = ({ message }) => ( <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg"><h3 className="text-lg font-semibold">Oops! Something went wrong.</h3><p className="mt-1">{message}</p></div> );

// Sidenav Icons
const ExchangeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-1.5-7a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/><path d="M1.716 5.158c.21-1.33.956-2.45 1.94-3.21.984-.76 2.24-1.233 3.6-1.402a1 1 0 1 1 .283 1.983c-1.13.143-2.115.54-2.88 1.14-.764.6-1.32 1.48-1.483 2.593a1 1 0 1 1-1.96-.284zM14.284 5.158a1 1 0 0 1-1.96-.284c-.164-1.114-.72-1.994-1.484-2.594-.765-.6-1.75-.997-2.88-1.14a1 1 0 1 1 .283-1.983c1.36.17 2.616.642 3.6 1.402.984.76 1.73 1.88 1.94 3.21a1 1 0 0 1-1.696.568z"/></svg>;
const FriendsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm8.5 5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2zm4.672-1H9.828a1 1 0 0 0-.707.293L8.354 2H5.528l-.255-.83A1 1 0 0 1 6.26 0h4.596a1 1 0 0 1 .92.624z"/></svg>;


const SkillExchange = () => {
    const { backendUrl } = useContext(AppContent);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navLinkClasses = "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors";
    const activeClass = "bg-indigo-100 text-indigo-700 font-semibold";
    const inactiveClass = "text-gray-600 hover:bg-gray-100";

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${backendUrl}/api/tasks`);
                if (response.data.success) {
                    setTasks(response.data.data);
                } else {
                    throw new Error(response.data.message || "Failed to fetch tasks.");
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [backendUrl]);

    const renderContent = () => {
        if (loading) return <Spinner />;
        if (error) return <ErrorDisplay message={error} />;
        if (tasks.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-xl border">
                    <h3 className="text-xl font-semibold text-gray-700">No tasks available right now.</h3>
                    <p className="text-gray-500 mt-2">Why not be the first to post a task?</p>
                </div>
            );
        }
        return (
            <div className="space-y-6">
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                ))}
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar theme="light" />
            <div className='container mx-auto max-w-7xl pt-24 sm:pt-28 p-4 sm:p-6'>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    <aside className="md:col-span-1">
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2 sticky top-24">
                            <NavLink to="/skill-exchange" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><ExchangeIcon /> Skill Exchange</NavLink>
                            <NavLink to="/friends" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><FriendsIcon /> Friends</NavLink>
                            <NavLink to="/messages" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}><ChatIcon /> Messages</NavLink>
                        </div>
                    </aside>

                    <main className="md:col-span-3">
                        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Skill Exchange</h1>
                            
                            {/* --- BUTTONS ARE HERE --- */}
                            <div className="flex items-center gap-3">
                                <Link to="/my-tasks" className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors">
                                    <FolderIcon /> My Tasks
                                </Link>
                                <Link to="/create-task" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                                    Post a Task
                                </Link>
                            </div>
                        </div>
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SkillExchange;