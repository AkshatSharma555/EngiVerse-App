// Filename: client/src/App.jsx
// (Updated by your AI assistant with the new Jobs route)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import Login from './pages/Login.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Jobs from './pages/Jobs.jsx'; // STEP 1: Naye Jobs page ko import karein
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';

const App = () => {
  return (
    <div className="relative w-full min-h-screen">
      <div className="relative z-10">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            
            {/* STEP 2: Naya /jobs route yahan add karein */}
            <Route path='/jobs' element={<Jobs />} />
            
            {/* Future mein AI Bot aur P2P Exchange ke routes bhi yahan aayenge */}
          </Route>
          
        </Routes>
      </div>
    </div>
  );
}

export default App;