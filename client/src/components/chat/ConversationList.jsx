// Filename: client/src/components/chat/ConversationList.jsx (FINAL CORRECTED VERSION)

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Spinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
);

const ConversationList = ({ conversations, loading }) => {
    const { recipientId } = useParams();

    if (loading) {
        return <Spinner />;
    }

    if (!conversations || conversations.length === 0) {
        return <div className="p-4 text-center text-gray-500">No conversations yet.</div>;
    }

    return (
        <ul className="divide-y divide-gray-200">
            {conversations.map(convo => {
                const otherUser = convo.participants[0];

                // --- THIS IS THE FIX ---
                // Agar conversation mein otherUser ka data nahi hai, toh usko list mein dikhao hi mat.
                if (!otherUser || !otherUser._id) {
                    return null;
                }

                const isActive = otherUser._id === recipientId;

                return (
                    <li key={convo._id}>
                        <Link
                            to={`/messages/${otherUser._id}`} // Ab yahan kabhi 'undefined' nahi aayega
                            className={`flex items-center gap-4 p-3 transition-colors ${
                                isActive ? 'bg-indigo-100' : 'hover:bg-gray-50'
                            }`}
                        >
                            <img
                                src={otherUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.name}`}
                                alt={otherUser.name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className={`font-bold truncate ${isActive ? 'text-indigo-700' : 'text-gray-800'}`}>
                                    {otherUser.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
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