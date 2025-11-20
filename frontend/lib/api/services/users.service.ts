import apiClient from '../client';

export interface User {
    _id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    date_of_birth: string;
    profile_picture?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    is_active: boolean;
    role: string;
    school_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserDto {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    date_of_birth: string;
    profile_picture?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    role: string;
    school_id: string;
}

const usersService = {
    /**
     * Create new user
     */
    async create(data: CreateUserDto): Promise<User> {
        const response = await apiClient.post('/users', data);
        return response.data.data;
    },

    /**
     * Get user by ID
     */
    async getById(id: string): Promise<User> {
        const response = await apiClient.get(`/users/${id}`);
        return response.data.data;
    },

    /**
     * Update user
     */
    async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
        const response = await apiClient.put(`/users/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete user
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/users/${id}`);
    },

    /**
     * Create user profile
     */
    async createProfile(userId: string, data: any): Promise<any> {
        const response = await apiClient.put(`/users/${userId}/profile`, data);
        return response.data.data;
    },
};

export default usersService;