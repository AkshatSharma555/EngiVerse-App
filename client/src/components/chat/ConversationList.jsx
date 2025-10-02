// Filename: client/src/components/chat/ConversationList.jsx (PREMIUM VERSION)

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Spinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
);

// Helper function to format timestamps
const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diff / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
};

const ConversationList = ({ conversations, loading }) => {
    const { recipientId } = useParams();

    if (loading) {
        return <Spinner />;
    }

    if (!conversations || conversations.length === 0) {
        return <div className="p-4 text-center text-gray-500">No conversations yet.</div>;
    }

    return (
        // Removed divide-y for custom borders
        <ul>
            {conversations.map(convo => {
                const otherUser = convo.participants[0];
                if (!otherUser || !otherUser._id) {
                    return null;
                }

                const isActive = otherUser._id === recipientId;
                const isOnline = false; // Placeholder for online status logic

                return (
                    <li key={convo._id} className="border-b border-gray-200/80">
                        <Link
                            to={`/messages/${otherUser._id}`}
                            className={`relative flex items-center gap-4 p-4 transition-colors duration-200 ease-in-out ${
                                isActive ? 'bg-indigo-50' : 'hover:bg-gray-100/50'
                            }`}
                        >
                            {/* --- Active State Indicator --- */}
                            {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r-full"></div>}

                            {/* --- Avatar with Online Status --- */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={otherUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.name}`}
                                    alt={otherUser.name}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                {isOnline && (
                                    <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></span>
                                )}
                            </div>
                            
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className={`font-bold truncate ${isActive ? 'text-indigo-700' : 'text-gray-800'}`}>
                                        {otherUser.name}
                                    </p>
                                    {/* --- Relative Timestamp --- */}
                                    {convo.lastMessage?.createdAt && (
                                        <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                            {formatTimestamp(convo.lastMessage.createdAt)}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate mt-1">
                                    {convo.lastMessage?.text || "Click to start chatting"}
                                </p>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default ConversationList;