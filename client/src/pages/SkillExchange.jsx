// Filename: client/src/pages/SkillExchange.jsx (SIMPLIFIED & CORRECTED)

import React, { useState, useEffect, useContext } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TaskCard from '../components/cards/TaskCard';

// Helper Components
const Spinner = () => ( <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div></div> );
const ErrorDisplay = ({ message }) => ( <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg"><h3 className="text-lg font-semibold">Oops! Something went wrong.</h3><p className="mt-1">{message}</p></div> );
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2zm4.672-1H9.828a1 1 0 0 0-.707.293L8.354 2H5.528l-.255-.83A1 1 0 0 1 6.26 0h4.596a1 1 0 0 1 .92.624z"/></svg>;

const SkillExchange = () => {
    const { backendUrl } = useContext(AppContent);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        // The Navbar, Sidenav, and main grid layout are now handled by CommunityLayout.jsx
        // This component only needs to render the content for the <main> section.
        <>
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Skill Exchange
                </h1>
                <div className="flex items-center gap-3">
                    <Link
                        to="/my-tasks"
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <FolderIcon /> My Tasks
                    </Link>
                    <Link
                        to="/create-task"
                        className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        Post a Task
                    </Link>
                </div>
            </div>
            {renderContent()}
        </>
    );
};

export default SkillExchange;