'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';

interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  role: string;
  roles: string[];
  school_id: string | null;
  usergroup_id: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from cookies on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = Cookies.get('access_token');
        const userStr = Cookies.get('user');

        if (token && userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        Cookies.remove('access_token');
        Cookies.remove('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        const { access_token, user: backendUser } = response.data.data;

        // Store token
        Cookies.set('access_token', access_token, { expires: 7 });

        // Transform backend user to frontend format
        const user: User = {
          _id: backendUser.id,
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name,
          first_name: backendUser.name?.split(' ')[0] || '',
          last_name: backendUser.name?.split(' ').slice(1).join(' ') || '',
          role: backendUser.roles?.[0] || backendUser.usergroup_id,
          roles: backendUser.roles || [backendUser.usergroup_id],
          school_id: backendUser.school_id,
          usergroup_id: backendUser.usergroup_id,
        };

        // Store user data
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        setUser(user);

        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setIsLoading(true);
      
      const response = await apiClient.post('/auth/register', data);

      if (response.data.success && response.data.data) {
        const { access_token, user: backendUser } = response.data.data;

        // Store token
        Cookies.set('access_token', access_token, { expires: 7 });

        // Transform backend user to frontend format
        const user: User = {
          _id: backendUser.id,
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name,
          first_name: backendUser.name?.split(' ')[0] || '',
          last_name: backendUser.name?.split(' ').slice(1).join(' ') || '',
          role: backendUser.roles?.[0] || backendUser.usergroup_id,
          roles: backendUser.roles || [backendUser.usergroup_id],
          school_id: backendUser.school_id,
          usergroup_id: backendUser.usergroup_id,
        };

        // Store user data
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        setUser(user);

        toast.success('Registration successful!');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('user');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.some(role => 
      user.roles?.includes(role) || user.role === role
    );
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
