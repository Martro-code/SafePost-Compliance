import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isLoggingOut } from './useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    if (isLoggingOut) return <Navigate to="/" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
