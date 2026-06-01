import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token header to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh logic (simplified for this demo)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If a 401 Unauthorized is returned, we could attempt to refresh the token here.
    // For simplicity in this demo, if we get a 401, we might just log out the user.
    if (error.response?.status === 401) {
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
      // window.location.href = '/login'; // Or handle statefully
    }
    return Promise.reject(error);
  }
);
