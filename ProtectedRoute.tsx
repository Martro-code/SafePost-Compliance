import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isLoggingOut } from './useAuth';
import { useAccount } from './src/context/AccountContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireOwner = false }) => {
  const { user, loading } = useAuth();
  const { role, accountLoading } = useAccount();

  if (loading) return null;
  if (!user) {
    if (isLoggingOut) return <Navigate to="/" replace />;
    return <Navigate to="/login" replace />;
  }

  // Wait for account data before enforcing role
  if (requireOwner && !accountLoading && role === 'member') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
