// AuthContext.js
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    console.log('Validating token:', token ? token.substring(0, 10) + '...' : 'No token');
    if (!token) {
      console.log('No token found in localStorage');
      setIsSignedIn(false);
      setUser(null);
      localStorage.removeItem('userinfo');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/auth/validate');
      console.log('Validation response:', response.data);
      if (response.status === 200 && response.data.valid) {
        setIsSignedIn(true);
        setUser(response.data.user);
        localStorage.setItem('userinfo', JSON.stringify(response.data.user));
        console.log('User signed in:', response.data.user);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      setIsSignedIn(false);
      setUser(null);
      localStorage.removeItem('userinfo');
      localStorage.removeItem('accessToken');
    }
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      if (response.status === 200 && response.data.accessToken) {
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        console.log('Access token stored:', accessToken);
        setIsSignedIn(true);
        await validateToken(); // Fetch user data
        setError(null);
        router.push('/dashboard');
      } else {
        throw new Error('Login failed: No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred during login');
    }
  }, [router, validateToken]);

  const signup = useCallback(async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { username, password });
      if (response.status === 201) {
        setError(null);
        router.push('/sign-in');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.error || 'An unexpected error occurred during signup');
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsSignedIn(false);
    setUser(null);
    localStorage.removeItem('userinfo');
    setError(null);
    router.push('/sign-in');
    // You might want to add a call to the backend to invalidate the refresh token
  }, [router]);

  const authContextValue = {
    isSignedIn,
    user,
    error,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}