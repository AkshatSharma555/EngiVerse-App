// Filename: client/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AppContent);

  // Jab tak check ho raha hai, loading dikhao
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Check complete hone ke baad, decide karo
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;