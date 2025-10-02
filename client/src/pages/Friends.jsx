// Filename: client/src/pages/Friends.jsx (SIMPLIFIED & CORRECTED)

import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- Helper Components ---
const Spinner = () => <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>;

const Friends = () => {
    const { backendUrl, setNotificationTrigger } = useContext(AppContent);
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [requestsRes, friendsRes] = await Promise.all([
                axios.get(`${backendUrl}/api/friends/requests/pending`),
                axios.get(`${backendUrl}/api/friends`),
            ]);
            if (requestsRes.data.success) setRequests(requestsRes.data.data);
            if (friendsRes.data.success) setFriends(friendsRes.data.data);
        } catch (error) {
            toast.error("Failed to load friends data.");
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const handleRespondRequest = async (requestId, action) => {
        try {
            const response = await axios.put(`${backendUrl}/api/friends/requests/respond/${requestId}`, { action });
            if (response.data.success) {
                toast.success(`Request ${action}ed!`);
                fetchData();
                setNotificationTrigger((prev) => prev + 1);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed.");
        }
    };

    // The Navbar, Sidenav, and main grid are now handled by CommunityLayout.jsx
    // This component only needs to render the content for the <main> section.
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Friends</h1>
            {loading ? (
                <div className="flex justify-center"><Spinner /></div>
            ) : (
                <div className="space-y-10">
                    {/* Pending Requests Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Friend Requests ({requests.length})</h2>
                        <div className="space-y-4">
                            {requests.length > 0 ? (
                                requests.filter(req => req.fromUser && req.fromUser._id).map(req => (
                                    <div key={req._id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                                        <Link to={`/profile/${req.fromUser._id}`} className="flex items-center gap-3 group">
                                            <img src={req.fromUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${req.fromUser.name}`} alt={req.fromUser.name} className="w-10 h-10 rounded-full object-cover" />
                                            <span className="font-bold text-gray-700 group-hover:underline">{req.fromUser.name}</span>
                                        </Link>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleRespondRequest(req._id, "accept")} className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-md hover:bg-green-600">Accept</button>
                                            <button onClick={() => handleRespondRequest(req._id, "reject")} className="px-3 py-1 bg-gray-300 text-gray-800 text-xs font-bold rounded-md hover:bg-gray-400">Decline</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-6 rounded-lg border text-center text-gray-500">No pending friend requests.</div>
                            )}
                        </div>
                    </div>

                    {/* Friends List Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Friends ({friends.filter(f => f && f._id).length})</h2>
                        <div className="space-y-4">
                            {friends.length > 0 ? (
                                friends.filter(friend => friend && friend._id).map(friend => (
                                    <div key={friend._id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                                        <Link to={`/profile/${friend._id}`} className="flex items-center gap-3 group">
                                            <img src={friend.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${friend.name}`} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-gray-700 group-hover:underline">{friend.name}</p>
                                                <p className="text-xs text-gray-500">{friend.collegeName}</p>
                                            </div>
                                        </Link>
                                        <Link to={`/messages/${friend._id}`} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-md hover:bg-indigo-700">
                                            Chat
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-6 rounded-lg border text-center text-gray-500">You haven't added any friends yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Friends;