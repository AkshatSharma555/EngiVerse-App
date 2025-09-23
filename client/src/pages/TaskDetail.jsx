import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- Self-contained Helper Components ---
const Spinner = () => <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div></div>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>;
const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-yellow-500" viewBox="0 0 16 16"><path d="M8 16a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.75-2.125a.25.25 0 0 1 .33-.428A6.995 6.995 0 0 0 8 13.5a6.995 6.995 0 0 0 1.42-.053a.25.25 0 0 1 .33.428 7.5 7.5 0 0 1-3.5 0zm1.42-1.637c.362.03.727.047 1.09.047.363 0 .728-.017 1.09-.047a.25.25 0 0 1 .285.253 7.5 7.5 0 0 1-.336 1.432.25.25 0 0 1-.462.015A6.484 6.484 0 0 0 8 12.5a6.484 6.484 0 0 0-.58.183.25.25 0 0 1-.462-.015 7.5 7.5 0 0 1-.336-1.432.25.25 0 0 1 .285-.253zM4.18 5.432a.25.25 0 0 1 .32.43A6.996 6.996 0 0 0 8 7.5c1.45 0 2.803-.438 3.93-1.22a.25.25 0 0 1 .398.283 7.5 7.5 0 0 1-8.318 0 .25.25 0 0 1 .17-.431z"/></svg>;

const TaskDetail = () => {
    const { taskId } = useParams();
    const { backendUrl, user, setNotificationTrigger } = useContext(AppContent);

    const [task, setTask] = useState(null);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newOfferMessage, setNewOfferMessage] = useState('');
    const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const fetchData = useCallback(async () => {
        if (!taskId) {
            setLoading(false);
            return;
        }
        try {
            const [taskResponse, offersResponse] = await Promise.all([
                axios.get(`${backendUrl}/api/tasks/${taskId}`),
                axios.get(`${backendUrl}/api/tasks/${taskId}/offers`)
            ]);
            if (taskResponse.data.success) setTask(taskResponse.data.data);
            if (offersResponse.data.success) setOffers(offersResponse.data.data);
        } catch (error) {
            toast.error("Failed to load task details.");
            setTask(null);
        } finally {
            setLoading(false);
        }
    }, [taskId, backendUrl]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        if (!newOfferMessage.trim()) return toast.error("Offer message cannot be empty.");
        setIsSubmittingOffer(true);
        try {
            const response = await axios.post(`${backendUrl}/api/tasks/${taskId}/offers`, { message: newOfferMessage });
            if (response.data.success) {
                toast.success("Offer submitted successfully!");
                fetchData();
                setNewOfferMessage('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit offer.");
        } finally {
            setIsSubmittingOffer(false);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        if (!window.confirm("Are you sure you want to accept this offer?")) return;
        try {
            const response = await axios.put(`${backendUrl}/api/tasks/${taskId}/accept-offer`, { offerId });
            if (response.data.success) {
                toast.success("Offer Accepted! The task is now in progress.");
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept offer.");
        }
    };
    
    const handleCompleteTask = async () => {
        if (!window.confirm("Are you sure you want to mark this task as complete? This will transfer the EngiCoins to the helper.")) return;
        
        setIsCompleting(true);
        try {
            const response = await axios.put(`${backendUrl}/api/tasks/${taskId}/complete`);
            if (response.data.success) {
                toast.success(response.data.message);
                setNotificationTrigger(prev => prev + 1);
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to complete task.");
        } finally {
            setIsCompleting(false);
        }
    };

    const isTaskOwner = user && task?.user && user._id === task.user._id;

    if (loading) return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><Spinner /></div>;

    if (!task) {
        return (
            <div className='min-h-screen bg-slate-50'>
                <Navbar theme="light" />
                <div className="text-center pt-40">
                    <h1 className="text-2xl font-bold text-gray-700">Task Not Found</h1>
                    <p className="text-gray-500 mt-2">The task you are looking for does not exist or has been deleted.</p>
                    <Link to="/skill-exchange" className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Back to Skill Exchange
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar theme="light" />
            <div className='container mx-auto max-w-4xl pt-24 sm:pt-28 p-4 sm:p-6'>
                <Link to="/skill-exchange" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group">
                    <ArrowLeftIcon />
                    <span className="font-semibold group-hover:underline">Back to Skill Exchange</span>
                </Link>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{task.title}</h1>
                        <span className={`capitalize text-xs font-bold px-3 py-1.5 rounded-full text-white ${
                            task.status === 'open' ? 'bg-blue-500' :
                            task.status === 'in_progress' ? 'bg-yellow-500' :
                            task.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                            {task.status.replace('_', ' ')}
                        </span>
                    </div>

                    {task.user ? (
                        <div className="flex items-center gap-4 mt-4">
                            <img src={task.user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${task.user.name}`} alt="Author" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-700">{task.user.name}</p>
                                <p className="text-xs text-gray-500">Posted on {new Date(task.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                         <p className="text-sm text-gray-500 mt-4">Posted by an unknown user.</p>
                    )}

                    <div className="mt-5 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex flex-wrap gap-2">
                            {task.skills.map(skill => (
                                <span key={skill} className="text-sm font-semibold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">{skill}</span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 font-bold text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                            <CoinIcon />
                            <span>{task.bounty}</span>
                        </div>
                    </div>
                    
                    <p className="text-gray-700 mt-6 whitespace-pre-wrap">{task.description}</p>
                </div>

                {isTaskOwner && task.status === 'in_progress' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <h3 className="font-semibold text-green-800">This task is in progress.</h3>
                        <p className="text-sm text-green-700 mt-1">Once the helper has completed the work, mark it as complete to transfer the EngiCoins.</p>
                        <button 
                            onClick={handleCompleteTask}
                            disabled={isCompleting}
                            className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-400"
                        >
                            {isCompleting ? 'Processing...' : 'Mark as Complete'}
                        </button>
                    </div>
                )}
                
                {task.status === 'completed' && (
                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                        <h3 className="font-semibold text-indigo-800">Task Completed!</h3>
                        <p className="text-sm text-indigo-700 mt-1">{task.bounty} EngiCoins have been transferred.</p>
                    </div>
                )}

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">
                        {isTaskOwner ? "Offers Received" : "Make an Offer"} ({offers.filter(o => o.user).length})
                    </h2>

                    {user && !isTaskOwner && task.status === 'open' && (
                        <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
                            <form onSubmit={handleOfferSubmit}>
                                <textarea
                                    value={newOfferMessage}
                                    onChange={(e) => setNewOfferMessage(e.target.value)}
                                    placeholder="Write your offer here..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                                    rows="3"
                                    disabled={isSubmittingOffer}
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={isSubmittingOffer}
                                    className="mt-3 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                                >
                                    {isSubmittingOffer ? 'Submitting...' : 'Submit Offer'}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="space-y-5">
                        {offers.filter(offer => offer.user).map(offer => (
                            <div key={offer._id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                                <Link to={`/profile/${offer.user._id}`} className="flex items-center gap-4 group">
                                    <img src={offer.user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${offer.user.name}`} alt="Offer User" className="w-11 h-11 rounded-full object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800 group-hover:text-indigo-600 group-hover:underline">{offer.user.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">{offer.message}</p>
                                    </div>
                                </Link>
                                {isTaskOwner && task.status === 'open' && (
                                    <button
                                        onClick={() => handleAcceptOffer(offer._id)}
                                        className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors flex-shrink-0"
                                    >
                                        Accept Offer
                                    </button>
                                )}
                            </div>
                        ))}
                        {offers.filter(o => o.user).length === 0 && (
                            <p className="text-gray-500 text-center py-8 bg-white rounded-lg border">
                                {isTaskOwner ? "No valid offers received yet." : "Be the first one to make an offer!"}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;