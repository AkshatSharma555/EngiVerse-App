// Filename: client/src/context/AppContext.jsx (FINAL & MOST ROBUST VERSION)

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from 'react-toastify';

export const AppContent = createContext(null);

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [notificationTrigger, setNotificationTrigger] = useState(0);

    // This effect fetches the user's initial status. It only runs once.
    useEffect(() => {
        const checkUserStatus = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
                if (data.success) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.log("User not authenticated.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserStatus();
    }, [backendUrl]);

    // This effect manages the socket connection.
    // It is now dependent on user._id (a primitive string), not the whole user object.
    // This prevents it from re-running unnecessarily if setUser is called elsewhere with the same user data.
    useEffect(() => {
        if (user?._id) {
            const newSocket = io(backendUrl, {
                query: { userId: user._id },
                // Important for preventing immediate disconnects in some environments
                transports: ['websocket'] 
            });

            setSocket(newSocket);

            // Setup listeners
            newSocket.on('newNotification', (notification) => {
                toast.info(`🔔 New friend request from ${notification.sender.name}!`);
            });
            
            // This is the cleanup function. It runs ONLY when user._id changes (i.e., on logout).
            return () => {
                newSocket.close();
            };
        } else {
            // If there's no user, ensure any existing socket is disconnected.
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    // The dependency array is the key to the fix.
    }, [user?._id, backendUrl]); 

    const value = {
        backendUrl,
        user,
        setUser,
        loading,
        socket,
        setNotificationTrigger
    };

    return (
        <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
    );
};