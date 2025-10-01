// Filename: client/src/pages/Friends.jsx (FINAL CORRECTED VERSION)

import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- Self-contained Helper Components ---
const Spinner = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
);
const ExchangeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M5.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-1.5-7a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
    <path d="M1.716 5.158c.21-1.33.956-2.45 1.94-3.21.984-.76 2.24-1.233 3.6-1.402a1 1 0 1 1 .283 1.983c-1.13.143-2.115.54-2.88 1.14-.764.6-1.32 1.48-1.483 2.593a1 1 0 1 1-1.96-.284zM14.284 5.158a1 1 0 0 1-1.96-.284c-.164-1.114-.72-1.994-1.484-2.594-.765-.6-1.75-.997-2.88-1.14a1 1 0 1 1 .283-1.983c1.36.17 2.616.642 3.6 1.402.984.76 1.73 1.88 1.94 3.21a1 1 0 0 1-1.696.568z" />
  </svg>
);
const FriendsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M15 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm8.5 5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);
const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M2.5.5A.5.5 0 0 1 3 .5V2h10V.5a.5.5 0 0 1 1 0V2a1 1 0 0 1 1 1v2.538a2 2 0 0 1-.808 1.586l-3.67 1.932-1.266 3.165A.5.5 0 0 1 8 11.5l-1.266-3.165-3.67-1.932A2 2 0 0 1 1 5.538V3a1 1 0 0 1 1-1V.5a.5.5 0 0 1 .5-.5zM3 3v2.538a1 1 0 0 0 .404.793l3.072 1.616L8 9.5l1.52-3.793 3.072-1.616A1 1 0 0 0 13 5.538V3H3z" />
    <path d="M8 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    <path d="M6 14.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1z" />
  </svg>
);

const Friends = () => {
  const { backendUrl, setNotificationTrigger } = useContext(AppContent);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const navLinkClasses =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors";
  const activeClass = "bg-indigo-100 text-indigo-700 font-semibold";
  const inactiveClass = "text-gray-600 hover:bg-gray-100";

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
      const response = await axios.put(
        `${backendUrl}/api/friends/requests/respond/${requestId}`,
        { action }
      );
      if (response.data.success) {
        toast.success(`Request ${action}ed!`);
        fetchData();
        setNotificationTrigger((prev) => prev + 1); // Notify other components
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar theme="light" />
      <div className="container mx-auto max-w-7xl pt-24 sm:pt-28 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2 sticky top-24">
              <NavLink
                to="/skill-exchange"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <ExchangeIcon /> Skill Exchange
              </NavLink>
              {/* Leaderboard NavLink inserted here */}
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <TrophyIcon /> Leaderboard
              </NavLink>
              <NavLink
                to="/friends"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <FriendsIcon /> Friends
              </NavLink>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <ChatIcon /> Messages
              </NavLink>
              // TrophyIcon for Leaderboard NavLink const TrophyIcon = () = (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.5.5A.5.5 0 0 1 3 .5V2h10V.5a.5.5 0 0 1 1 0V2a1 1 0 0 1 1 1v2.538a2 2 0 0 1-.808 1.586l-3.67 1.932-1.266 3.165A.5.5 0 0 1 8 11.5l-1.266-3.165-3.67-1.932A2 2 0 0 1 1 5.538V3a1 1 0 0 1 1-1V.5a.5.5 0 0 1 .5-.5zM3 3v2.538a1 1 0 0 0 .404.793l3.072 1.616L8 9.5l1.52-3.793 3.072-1.616A1 1 0 0 0 13 5.538V3H3z" />
                <path d="M8 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <path d="M6 14.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1z" />
              </svg>
              );
            </div>
          </aside>

          <main className="md:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Manage Friends
            </h1>
            {loading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-10">
                {/* Pending Requests Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Friend Requests ({requests.length})
                  </h2>
                  <div className="space-y-4">
                    {requests.length > 0 ? (
                      requests
                        .filter((req) => req.fromUser && req.fromUser._id)
                        .map((req) => (
                          <div
                            key={req._id}
                            className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between"
                          >
                            <Link
                              to={`/profile/${req.fromUser._id}`}
                              className="flex items-center gap-3 group"
                            >
                              <img
                                src={
                                  req.fromUser.profilePicture ||
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${req.fromUser.name}`
                                }
                                alt={req.fromUser.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <span className="font-bold text-gray-700 group-hover:underline">
                                {req.fromUser.name}
                              </span>
                            </Link>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleRespondRequest(req._id, "accept")
                                }
                                className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-md hover:bg-green-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleRespondRequest(req._id, "reject")
                                }
                                className="px-3 py-1 bg-gray-300 text-gray-800 text-xs font-bold rounded-md hover:bg-gray-400"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="bg-white p-6 rounded-lg border text-center text-gray-500">
                        No pending friend requests.
                      </div>
                    )}
                  </div>
                </div>

                {/* Friends List Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Friends ({friends.filter((f) => f && f._id).length})
                  </h2>
                  <div className="space-y-4">
                    {friends.length > 0 ? (
                      // --- FIX IS HERE ---
                      // We filter the array first to remove any friends with missing or invalid data.
                      friends
                        .filter((friend) => friend && friend._id)
                        .map((friend) => (
                          <div
                            key={friend._id}
                            className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between"
                          >
                            <Link
                              to={`/profile/${friend._id}`}
                              className="flex items-center gap-3 group"
                            >
                              <img
                                src={
                                  friend.profilePicture ||
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${friend.name}`
                                }
                                alt={friend.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold text-gray-700 group-hover:underline">
                                  {friend.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {friend.collegeName}
                                </p>
                              </div>
                            </Link>
                            <Link
                              to={`/messages/${friend._id}`}
                              className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-md hover:bg-indigo-700"
                            >
                              Chat
                            </Link>
                          </div>
                        ))
                    ) : (
                      <div className="bg-white p-6 rounded-lg border text-center text-gray-500">
                        You haven't added any friends yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Friends;
