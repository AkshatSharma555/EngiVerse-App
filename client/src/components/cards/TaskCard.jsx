// Filename: client/src/components/cards/TaskCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task }) => {
  if (!task) return null;

  return (
    // Har card ek clickable link hoga jo task detail page par le jayega
    <Link 
      to={`/tasks/${task._id}`} 
      className="block bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg hover:border-indigo-300 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <img 
          src={task.user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${task.user?.name}`} 
          alt={task.user?.name}
          className="w-10 h-10 rounded-full bg-gray-200 object-cover"
        />
        <div className="flex-1">
          {/* Task Title */}
          <h2 className="text-lg font-bold text-gray-800 hover:text-indigo-600">
            {task.title}
          </h2>
          {/* User Name */}
          <p className="text-sm text-gray-500 mt-1">
            Posted by <span className="font-semibold">{task.user?.name || 'Anonymous'}</span>
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {task.skills.slice(0, 4).map(skill => ( // Sirf 4 skills dikhayenge
          <span key={skill} className="text-xs font-semibold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>

      {/* Description Snippet */}
      <p className="text-gray-600 mt-4 text-sm line-clamp-2">
        {task.description}
      </p>
    </Link>
  );
};

export default TaskCard;