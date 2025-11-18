import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || 'api/v1';

const apiClient = axios.create({
  baseURL: `${API_URL}/${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add school ID if available
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.school_id) {
          config.headers['X-School-Id'] = user.school_id;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        Cookies.remove('access_token');
        Cookies.remove('user');
        
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        console.error('Access forbidden:', data.message);
      }

      if (status === 404) {
        console.error('Resource not found:', data.message);
      }

      if (status >= 500) {
        console.error('Server error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server. Please check your connection.');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
