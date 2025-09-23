// Filename: client/src/pages/CreateTask.jsx (UPDATED WITH ENGICOINS)

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>;
const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.75-2.125a.25.25 0 0 1 .33-.428A6.995 6.995 0 0 0 8 13.5a6.995 6.995 0 0 0 1.42-.053.25.25 0 0 1 .33.428 7.5 7.5 0 0 1-3.5 0zm1.42-1.637c.362.03.727.047 1.09.047.363 0 .728-.017 1.09-.047a.25.25 0 0 1 .285.253 7.5 7.5 0 0 1-.336 1.432.25.25 0 0 1-.462.015A6.484 6.484 0 0 0 8 12.5a6.484 6.484 0 0 0-.58.183.25.25 0 0 1-.462-.015 7.5 7.5 0 0 1-.336-1.432.25.25 0 0 1 .285-.253zM4.18 5.432a.25.25 0 0 1 .32.43A6.996 6.996 0 0 0 8 7.5c1.45 0 2.803-.438 3.93-1.22a.25.25 0 0 1 .398.283 7.5 7.5 0 0 1-8.318 0 .25.25 0 0 1 .17-.431z"/></svg>;


const CreateTask = () => {
    // Get the current user to check their coin balance
    const { backendUrl, user } = useContext(AppContent);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: '',
        bounty: '', // <-- NEW: Add bounty to our form state
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Updated validation to include bounty
        if (!formData.title || !formData.description || !formData.skills || !formData.bounty) {
            return toast.error("Please fill out all fields, including the bounty.");
        }
        
        const bountyAmount = Number(formData.bounty);
        if (isNaN(bountyAmount) || bountyAmount <= 0) {
            return toast.error("Bounty must be a positive number.");
        }
        if (user && user.engiCoins < bountyAmount) {
            return toast.error(`You don't have enough EngiCoins! Your balance: ${user.engiCoins}`);
        }
        
        setIsSubmitting(true);
        try {
            const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);

            if (skillsArray.length === 0) {
                toast.error("Please provide at least one skill.");
                setIsSubmitting(false);
                return;
            }

            // Create payload including the bounty
            const payload = {
                title: formData.title,
                description: formData.description,
                skills: skillsArray,
                bounty: bountyAmount, // <-- NEW: Send bounty to backend
            };

            const response = await axios.post(`${backendUrl}/api/tasks`, payload);

            if (response.data.success) {
                toast.success("Task posted successfully!");
                navigate(`/tasks/${response.data.data._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post task.");
            console.error("Create Task Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar theme="light" />
            <div className='container mx-auto max-w-2xl pt-24 sm:pt-28 p-4 sm:p-6'>
                <Link to="/skill-exchange" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group">
                    <ArrowLeftIcon />
                    <span className="font-semibold group-hover:underline">Back to Skill Exchange</span>
                </Link>

                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Task</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Need help with a React project"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Describe your task in detail..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">Skills Required</label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g., React, JavaScript, Node.js"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2">Enter skills separated by commas.</p>
                        </div>

                        {/* --- NEW BOUNTY FIELD --- */}
                        <div>
                            <label htmlFor="bounty" className="block text-sm font-semibold text-gray-700 mb-2">Bounty (EngiCoins)</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CoinIcon />
                                </div>
                                <input
                                    type="number"
                                    id="bounty"
                                    name="bounty"
                                    value={formData.bounty}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="e.g., 20"
                                    className="block w-full rounded-md border-gray-300 shadow-sm pl-10 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                                    required
                                />
                            </div>
                            {user && <p className="text-xs text-gray-500 mt-2">Your current balance: {user.engiCoins} EngiCoins</p>}
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                            >
                                {isSubmitting ? 'Submitting...' : 'Post Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;