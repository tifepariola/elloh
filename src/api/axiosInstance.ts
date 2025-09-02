import axios from "axios";

const api = axios.create({
  baseURL: "https://inboxdev-core-api.stack.internal.elloh.studio/api/v1", // Base URL for all requests
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('elloh_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('elloh_auth_token');
      localStorage.removeItem('elloh_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;