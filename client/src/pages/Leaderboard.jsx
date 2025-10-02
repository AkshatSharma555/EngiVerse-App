// Filename: client/src/pages/Leaderboard.jsx (SIMPLIFIED & CORRECTED)

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

// Helper Components
const Spinner = () => ( <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div> );
const TrophyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5.5A.5.5 0 0 1 3 .5V2h10V.5a.5.5 0 0 1 1 0V2a1 1 0 0 1 1 1v2.538a2 2 0 0 1-.808 1.586l-3.67 1.932-1.266 3.165A.5.5 0 0 1 8 11.5l-1.266-3.165-3.67-1.932A2 2 0 0 1 1 5.538V3a1 1 0 0 1 1-1V.5a.5.5 0 0 1 .5-.5zM3 3v2.538a1 1 0 0 0 .404.793l3.072 1.616L8 9.5l1.52-3.793 3.072-1.616A1 1 0 0 0 13 5.538V3H3z"/><path d="M8 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M6 14.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1z"/></svg> );

const tabClasses = (active) => `px-4 py-2 font-semibold border-b-2 transition-colors duration-150 ${active ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-indigo-600'}`;
const rankBg = ['bg-amber-100/50 border-amber-200', 'bg-slate-200/50 border-slate-300', 'bg-orange-100/50 border-orange-200'];

const Leaderboard = () => {
  const { backendUrl } = useContext(AppContent);
  const [topHelpers, setTopHelpers] = useState([]);
  const [wealthiestUsers, setWealthiestUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('helpers');

  useEffect(() => {
    setLoading(true);
    axios.get(`${backendUrl}/api/leaderboard`)
      .then(res => {
        if (res.data.success) {
          setTopHelpers(res.data.data.topHelpers || []);
          setWealthiestUsers(res.data.data.wealthiestUsers || []);
        }
      })
      .catch((err) => {
        toast.error("Could not load leaderboard data.");
      })
      .finally(() => setLoading(false));
  }, [backendUrl]);

  const renderList = (list, type) => {
    if (loading) return <Spinner />;
    if (!list || list.length === 0) return <div className="py-20 text-center text-gray-500 bg-white/50 rounded-lg">{type === 'helpers' ? 'No data available for this month.' : 'No ranked users yet.'}</div>;
    
    return (
      <ul className="space-y-3">
        {list.map((user, idx) => (
          <li key={user._id}>
            <Link to={`/profile/${user._id}`} className={`flex items-center gap-4 p-4 rounded-xl shadow-sm border ${rankBg[idx] || 'bg-white/70 border-gray-200/80'} backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02]`}> 
              <span className={`text-2xl font-bold w-10 text-center ${idx < 3 ? 'text-amber-600' : 'text-gray-400'}`}>#{idx + 1}</span>
              <img src={user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
              <span className="font-semibold text-gray-900 group-hover:underline">{user.name}</span>
              <span className="ml-auto text-sm text-indigo-700 font-bold">
                {type === 'helpers' ? `${user.tasksCompleted} Tasks Completed` : `${user.engiCoins} EngiCoins`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  // The Navbar and main layout are now handled by CommunityLayout.jsx
  // This component only needs to render its own content.
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <TrophyIcon />
        Leaderboards
      </h1>
      
      <div className="border-b border-gray-200/80 mt-6">
        <nav className="flex space-x-4">
          <button className={tabClasses(activeTab === 'helpers')} onClick={() => setActiveTab('helpers')}>Top Helpers (Monthly)</button>
          <button className={tabClasses(activeTab === 'wealth')} onClick={() => setActiveTab('wealth')}>Wealthiest Users</button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'helpers' ? renderList(topHelpers, 'helpers') : renderList(wealthiestUsers, 'wealth')}
      </div>
    </>
  );
};

export default Leaderboard;