import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isLoggingOut } from '../hooks/useAuth';
import { useAccount } from '../context/AccountContext';
import { supabase } from '../services/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireOwner = false }) => {
  const { user, loading } = useAuth();
  const { role, accountLoading } = useAccount();
  const [aalChecked, setAalChecked] = useState(false);
  const [needsMfa, setNeedsMfa] = useState(false);

  useEffect(() => {
    if (!user) {
      setAalChecked(true);
      return;
    }
    (async () => {
      const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (data && data.nextLevel === 'aal2' && data.currentLevel === 'aal1') {
        setNeedsMfa(true);
      }
      setAalChecked(true);
    })();
  }, [user]);

  if (loading || !aalChecked) return null;

  if (!user) {
    if (isLoggingOut) return <Navigate to="/" replace />;
    return <Navigate to="/login" replace />;
  }

  if (needsMfa) {
    return <Navigate to="/mfa-challenge" replace />;
  }

  // Wait for account data before enforcing role
  if (requireOwner && !accountLoading && role === 'member') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
