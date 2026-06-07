import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  // Render child routes if logged in
  return <Outlet />;
};
