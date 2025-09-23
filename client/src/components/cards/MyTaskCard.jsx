// Filename: client/src/components/cards/MyTaskCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-yellow-500" viewBox="0 0 16 16"><path d="M8 16a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.75-2.125a.25.25 0 0 1 .33-.428A6.995 6.995 0 0 0 8 13.5a6.995 6.995 0 0 0 1.42-.053.25.25 0 0 1 .33.428 7.5 7.5 0 0 1-3.5 0zm1.42-1.637c.362.03.727.047 1.09.047.363 0 .728-.017 1.09-.047a.25.25 0 0 1 .285.253 7.5 7.5 0 0 1-.336 1.432.25.25 0 0 1-.462.015A6.484 6.484 0 0 0 8 12.5a6.484 6.484 0 0 0-.58.183.25.25 0 0 1-.462-.015 7.5 7.5 0 0 1-.336-1.432.25.25 0 0 1 .285-.253zM4.18 5.432a.25.25 0 0 1 .32.43A6.996 6.996 0 0 0 8 7.5c1.45 0 2.803-.438 3.93-1.22a.25.25 0 0 1 .398.283 7.5 7.5 0 0 1-8.318 0 .25.25 0 0 1 .17-.431z"/></svg>;

const MyTaskCard = ({ task, role }) => {
    const otherUser = role === 'owner' ? task.assignedTo : task.user;

    const statusStyles = {
        open: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800',
    };

    return (
        <Link to={`/tasks/${task._id}`} className="block bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 pr-4">{task.title}</h3>
                <span className={`capitalize text-xs font-bold px-3 py-1 rounded-full ${statusStyles[task.status] || 'bg-gray-100'}`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>
            <div className="flex justify-between items-end mt-4">
                {otherUser ? (
                    <div className="flex items-center gap-2">
                        <img src={otherUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.name}`} alt="user" className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm text-gray-600">{role === 'owner' ? `Assigned to ${otherUser.name}` : `Created by ${otherUser.name}`}</span>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500">{role === 'owner' ? 'Awaiting assignment' : `Created by ${task.user?.name}`}</div>
                )}
                <div className="flex items-center gap-2 font-bold text-yellow-600">
                    <CoinIcon />
                    <span>{task.bounty}</span>
                </div>
            </div>
        </Link>
    );
};

export default MyTaskCard;