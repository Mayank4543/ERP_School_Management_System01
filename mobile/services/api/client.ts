import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Determine API URL based on platform
// Android Emulator uses 10.0.2.2 to access host machine's localhost
// iOS Simulator and physical devices can use localhost or your computer's IP
const getApiUrl = () => {
  // Check for environment variable first
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Default based on platform
  if (Platform.OS === 'android') {
    // Android emulator - use 10.0.2.2 to access host machine
    return 'http://10.0.2.2:8080';
  } else {
    // iOS simulator or physical device - use localhost
    return 'http://localhost:8080';
  }
};

const API_URL = getApiUrl();
const API_PREFIX = process.env.EXPO_PUBLIC_API_PREFIX || 'api/v1';

// Log the API URL being used (for debugging)
console.log('📱 API URL configured:', API_URL);
console.log('📱 Platform:', Platform.OS);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/${API_PREFIX}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add school ID if available
        const userStr = await AsyncStorage.getItem('@auth_user');
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

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('API Response:', response.config.url, response.status);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Log errors for debugging
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.response?.data || error.message,
        });

        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('@auth_token');
          await AsyncStorage.removeItem('@auth_user');
          // You might want to redirect to login here
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();


