import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/api/auth';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      // API client returns response.data directly, so response is already the data object
      // Backend returns: { success: true, message: '...', data: { access_token, user, ... } }
      if (response.success && response.data) {
        const { access_token, user: userData } = response.data;

        if (!access_token || !userData) {
          throw new Error('Invalid response from server');
        }

        await AsyncStorage.setItem(TOKEN_KEY, access_token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

        setToken(access_token);
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      if (!token) return;

      const userData = await authService.getCurrentUser(token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


