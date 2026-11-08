import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Proactively warm up backend on application load so Render cold-start finishes while user navigates
    api.get('/health').catch(() => {});

    // Check if user is already logged in from localStorage
    const savedUser = authService.getCurrentUser();
    const token = authService.getToken();

    if (savedUser && token) {
      setUser(savedUser);
      // Verify token in background
      authService.getMe()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('nutrivita_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // Token expired or invalid
          authService.logout();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const getErrorMessage = (err, defaultMsg) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return 'The backend server took too long to respond. If you are using Render, the free server may be cold-starting; please wait a moment and try again.';
    }
    if (err.message === 'Network Error' || !err.response) {
      return 'Cannot reach the backend server. Please verify your network connection or verify that the server is online.';
    }
    return defaultMsg;
  };

  const login = async (credentials) => {
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      // If the server was waking up from cold-start, auto-retry once seamlessly
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        try {
          const retryData = await authService.login(credentials);
          setUser(retryData.user);
          return { success: true, user: retryData.user };
        } catch (retryErr) {
          const message = getErrorMessage(retryErr, 'Login failed. Please check your credentials.');
          setError(message);
          return { success: false, error: message };
        }
      }
      const message = getErrorMessage(err, 'Login failed. Please check your credentials.');
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      // If the server was waking up from cold-start, auto-retry once seamlessly
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        try {
          const retryData = await authService.register(userData);
          setUser(retryData.user);
          return { success: true, user: retryData.user };
        } catch (retryErr) {
          const message = getErrorMessage(retryErr, 'Registration failed. Please try again.');
          setError(message);
          return { success: false, error: message };
        }
      }
      const message = getErrorMessage(err, 'Registration failed. Please try again.');
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
