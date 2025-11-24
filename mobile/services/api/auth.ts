import { apiClient } from './client';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: string;
    user: any;
  };
}

export interface UserResponse {
  success: boolean;
  data: any;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post('/auth/login', { email, password });
  },

  async logout(token: string): Promise<void> {
    return apiClient.post('/auth/logout');
  },

  async getCurrentUser(token: string): Promise<any> {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  },

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    return apiClient.post('/auth/password/change', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  async updateProfile(profileData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    profile_picture?: string;
  }): Promise<any> {
    return apiClient.patch('/auth/profile', profileData);
  },
};



