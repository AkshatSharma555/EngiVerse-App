// Filename: client/src/components/cards/UserCard.jsx (UPDATED)

import React from 'react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../ui/SpotlightCard'; // Import the new component

const UserCard = ({ user, onConnect }) => {
    return (
        // Use SpotlightCard as the main wrapper
        <SpotlightCard className="p-4 flex flex-col items-center text-center shadow-md">
            <Link to={`/profile/${user._id}`} className="flex flex-col items-center">
                <img
                    src={user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <h3 className="mt-4 font-bold text-lg text-gray-900">{user.name}</h3>
            </Link>
            <p className="text-sm text-gray-500">{user.collegeName || 'College Not specified'}</p>
            <div className="mt-4 w-full">
                {user.friendshipStatus === 'friends' ? (
                    <span className="inline-block w-full px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-lg">
                        Friend 🤝
                    </span>
                ) : (
                    <button 
                        onClick={() => onConnect(user._id)}
                        className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Connect
                    </button>
                )}
            </div>
        </SpotlightCard>
    );
};

export default UserCard;