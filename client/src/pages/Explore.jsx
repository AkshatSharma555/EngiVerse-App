// Filename: client/src/pages/Explore.jsx (SIMPLIFIED & CORRECTED)

import React, { useState, useEffect, useContext } from 'react';
import UserCard from '../components/cards/UserCard';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Spinner = () => <div className="flex justify-center items-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

const Explore = () => {
    const { backendUrl } = useContext(AppContent);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchTerm) {
                    params.append('name', searchTerm);
                }
                const response = await axios.get(`${backendUrl}/api/users/explore?${params.toString()}`);
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [backendUrl, searchTerm]);

    const handleConnect = async (userId) => {
        try {
            const response = await axios.post(`${backendUrl}/api/friends/requests/send/${userId}`);
            toast.success(response.data.message || "Friend request sent!");
            // Update the UI to show "Request Sent"
            setUsers(currentUsers => currentUsers.map(u => {
                if (u._id === userId) {
                    return { ...u, friendshipStatus: 'request_sent_by_me' }; // A new status for UI
                }
                return u;
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request.");
        }
    };

    return (
        // The Navbar, Sidenav, and main layout are handled by CommunityLayout.jsx.
        // This component only renders its own content inside the <Outlet />.
        <>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Explore Engineers</h1>
                <p className="mt-2 text-lg text-gray-600">Find and connect with peers from your community.</p>
                <div className="mt-6 max-w-xl mx-auto">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, skill, or college..."
                        className="w-full px-5 py-3 rounded-full border-2 border-gray-300 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {users.map(user => (
                        <UserCard key={user._id} user={user} onConnect={handleConnect} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Explore;