// Filename: client/src/context/AppContext.jsx
// (Refactored by your AI assistant for robustness and efficiency)

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContent = createContext(null);

export const AppContextProvider = (props) => {
  // Best practice: isse main.jsx mein rakhein, par yahan bhi kaam karega
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // Hum 'isLoggedin' ki jagah sirf 'user' state se kaam chalayenge
  // Agar 'user' null nahi hai, toh user logged in hai.
  const [user, setUser] = useState(null);
  
  // Yeh 'flicker' problem ko solve karegi
  const [loading, setLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      // Hum ab sirf ek hi API call karenge
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setUser(data.user); // User ka poora data set karein
      }
    } catch (error) {
      // Agar error aaye (e.g., 401), toh user logged in nahi hai
      console.log("User not authenticated.");
      setUser(null);
    } finally {
      // Chahe success ho ya error, check complete ho gaya hai
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const value = {
    backendUrl,
    user, // userData ki jagah ab hum 'user' use karenge
    setUser,
    loading, // loading state ko bhi provide karein
    checkUserStatus, // Taki logout ke baad re-check kar sakein
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};