import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If the user already has an active local session, NEVER block the screen with a spinner
  const hasLocalSession = typeof window !== 'undefined' && Boolean(localStorage.getItem('nutrivita_token'));

  if (loading && !hasLocalSession) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-medium text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated && !hasLocalSession) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
