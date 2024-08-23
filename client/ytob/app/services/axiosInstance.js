// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Change this to your actual backend URL
  withCredentials: true, // Enable sending cookies with requests
});

// Function to refresh the access token
const refreshToken = async () => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
    console.log('Refresh token response:', response.data);
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Add a request interceptor to add token to headers and handle token refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    console.log('Request interceptor - token:', token ? 'Token exists' : 'No token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      if (Date.now() >= expirationTime) {
        console.log('Token expired, refreshing...');
        token = await refreshToken();
      }
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('No token after refresh, redirecting to login');
        window.location.href = '/sign-in';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors (unauthorized)
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        // Token refresh failed, redirect to login
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;