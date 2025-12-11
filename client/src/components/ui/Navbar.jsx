import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
  </svg>
);
const CoinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="currentColor"
    className="text-yellow-500"
    viewBox="0 0 16 16"
  >
    <path d="M8 16a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.75-2.125a.25.25 0 0 1 .33-.428A6.995 6.995 0 0 0 8 13.5a6.995 6.995 0 0 0 1.42-.053.25.25 0 0 1 .33.428 7.5 7.5 0 0 1-3.5 0zm1.42-1.637c.362.03.727.047 1.09.047.363 0 .728-.017 1.09-.047a.25.25 0 0 1 .285.253 7.5 7.5 0 0 1-.336 1.432.25.25 0 0 1-.462.015A6.484 6.484 0 0 0 8 12.5a6.484 6.484 0 0 0-.58.183.25.25 0 0 1-.462-.015 7.5 7.5 0 0 1-.336-1.432.25.25 0 0 1 .285-.253zM4.18 5.432a.25.25 0 0 1 .32.43A6.996 6.996 0 0 0 8 7.5c1.45 0 2.803-.438 3.93-1.22a.25.25 0 0 1 .398.283 7.5 7.5 0 0 1-8.318 0 .25.25 0 0 1 .17-.431z" />
  </svg>
);

const Navbar = ({ theme = "light" }) => {
  const navigate = useNavigate();
  const { user, backendUrl, setUser, socket, notificationTrigger } =
    useContext(AppContent);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // --- FIX 1: Add Loading State for OTP Button ---
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const isTransparent = theme === "transparent";
  const navClasses = isTransparent
    ? "bg-white/5 backdrop-blur-lg border-b border-white/20"
    : "bg-white shadow-sm";

  const buttonClasses = isTransparent
    ? "border-white/50 text-white hover:bg-white/20"
    : "border-gray-400 text-gray-800 hover:bg-gray-100";
  const arrowIconClass = isTransparent ? "w-4 invert" : "w-4";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      )
        setIsProfileDropdownOpen(false);
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      )
        setIsNotificationDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/notifications`);
          if (response.data.success) {
            const fetchedNotifs = response.data.data;
            setNotifications(fetchedNotifs);
            setUnreadCount(fetchedNotifs.filter((n) => !n.isRead).length);
          }
        } catch (error) {
          console.error("Failed to fetch notifications");
        }
      };
      fetchNotifications();
    }
  }, [user, backendUrl, notificationTrigger]);

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (newNotification) => {
        switch (newNotification.type) {
          case "badge_awarded":
            toast.success(`🏆 You've earned a new badge!`);
            break;
          case "friend_request_accepted":
            toast.success(
              `🎉 ${newNotification.sender.name} accepted your friend request!`
            );
            break;
          default:
            toast.info(
              `🔔 New notification from ${newNotification.sender.name}!`
            );
        }
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
      return () => socket.off("newNotification");
    }
  }, [socket]);

  function renderNotificationText(notif) {
    const senderName = (
      <span className="font-bold">{notif.sender?.name || "Someone"}</span>
    );
    switch (notif.type) {
      case "friend_request":
        return <>{senderName} has sent you a friend request.</>;
      case "friend_request_accepted":
        return <>{senderName} accepted your friend request.</>;
      case "badge_awarded":
        return <>Congratulations! You've earned a new badge.</>;
      default:
        return <>You have a new notification.</>;
    }
  }

  const handleBellClick = async () => {
    setIsNotificationDropdownOpen((prev) => !prev);
    setIsProfileDropdownOpen(false);
    if (unreadCount > 0 && !isNotificationDropdownOpen) {
      setUnreadCount(0);
      try {
        await axios.put(`${backendUrl}/api/notifications/read`);
      } catch (error) {
        console.error("Failed to mark notifications as read");
      }
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setUser(null);
        toast.success("Logged out successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsProfileDropdownOpen(false);
  };

  // --- FIX 2: Protected OTP Sending Function ---
  const sendVerificationOtp = async () => {
    // Agar pehle se bhej raha hai, toh click ignore karo
    if (isSendingOtp) return; 

    try {
      setIsSendingOtp(true); // LOCK 🔒
      
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
        setIsProfileDropdownOpen(false);
        // Note: Navigate ho gaya toh state reset ki zarurat nahi, 
        // par agar page yahi rehta hai toh niche reset logic hai.
      } else {
        toast.error(data.message);
        setIsSendingOtp(false); // UNLOCK only on error 🔓
      }
    } catch (error) {
      toast.error(error.message);
      setIsSendingOtp(false); // UNLOCK only on error 🔓
    }
  };

  return (
    <div
      className={`w-full flex justify-between items-center p-4 sm:px-12 fixed top-0 z-50 transition-colors duration-300 ${navClasses}`}
    >
      <Link to={user ? "/dashboard" : "/"}>
        <img
          src={assets.logo}
          alt="EngiVerse Logo"
          className="w-32 h-9 cursor-pointer"
        />
      </Link>
      {user ? (
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 font-bold px-3 py-1.5 rounded-full">
            <CoinIcon />
            <span>{user?.engiCoins ?? 0}</span>
          </div>
          
          <div className="relative" ref={notificationDropdownRef}>
            <button
              onClick={handleBellClick}
              className="relative text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>
            <div
              className={`absolute top-full right-0 z-10 mt-2 text-black rounded-md shadow-lg transition-all duration-200 ease-in-out ${
                isNotificationDropdownOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <div className="w-80 bg-white rounded-lg shadow-xl border overflow-hidden">
                <div className="p-3 font-bold text-gray-800 border-b">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Link
                        to={notif.link}
                        key={notif._id}
                        onClick={() => setIsNotificationDropdownOpen(false)}
                        className="block p-3 hover:bg-gray-50 border-b"
                      >
                        <p className="text-sm text-gray-700">
                          {renderNotificationText(notif)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No new notifications.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile UI */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
              className="focus:outline-none"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className={`w-10 h-10 rounded-full object-cover cursor-pointer ring-2 transition-all ${
                    isProfileDropdownOpen
                      ? "ring-indigo-400"
                      : "ring-transparent"
                  }`}
                />
              ) : (
                <div
                  className={`w-10 h-10 flex justify-center items-center rounded-full font-bold text-lg cursor-pointer ring-2 transition-all ${
                    isProfileDropdownOpen
                      ? "ring-indigo-400"
                      : "ring-transparent"
                  } ${
                    isTransparent
                      ? "bg-white/20 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {user.name ? user.name[0].toUpperCase() : "?"}
                </div>
              )}
            </button>
            <div
              className={`absolute top-full right-0 z-10 mt-2 text-black rounded-md shadow-lg transition-all duration-200 ease-in-out ${
                isProfileDropdownOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <ul className="list-none m-0 bg-white text-sm w-48 border border-gray-100 rounded-md">
                <li
                  onClick={() => navigate("/profile")}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                >
                  My Profile
                </li>
                {!user.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    // --- FIX 3: Visual Feedback for Disabled State ---
                    className={`py-2 px-4 hover:bg-gray-100 cursor-pointer ${isSendingOtp ? 'opacity-50 cursor-wait' : ''}`}
                  >
                   {/* Text change ho jayega jab bhej raha hoga */}
                   {isSendingOtp ? "Sending OTP..." : "Verify Email"}
                  </li>
                )}
                <li
                  onClick={logout}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer border-t border-gray-100"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          className={`flex items-center gap-2 border-2 rounded-full px-5 py-2 font-semibold transition-all ${buttonClasses}`}
        >
          Login{" "}
          <img src={assets.arrow_icon} alt="" className={arrowIconClass} />
        </Link>
      )}
    </div>
  );
};

export default Navbar;