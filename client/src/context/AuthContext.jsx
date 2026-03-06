import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add axios response interceptor for token expiration
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
          setError('Your session has expired. Please log in again.');
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/api/users/me', {
            headers: { 'x-auth-token': token }
          });
          setUser(res.data);
          setError(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    // Redirect to home after logout
    delete axios.defaults.headers.common['x-auth-token'];
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [user]); // Run when user state changes


  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login, 
      logout 
    }}>
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

export default AuthContext;