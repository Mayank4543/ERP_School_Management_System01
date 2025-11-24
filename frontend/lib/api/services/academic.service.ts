import apiClient from '../client';

export interface AcademicYear {
    _id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    school_id: string;
    status: 'active' | 'inactive' | 'completed';
    created_at: string;
    updated_at: string;
}

export interface CreateAcademicYearDto {
    name: string;
    start_date: string;
    end_date: string;
    is_current?: boolean;
    status?: 'active' | 'inactive';
}

export interface UpdateAcademicYearDto {
    name?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
    status?: 'active' | 'inactive' | 'completed';
}

const academicService = {
    /**
     * Get all academic years for the school
     */
    async getAll(): Promise<AcademicYear[]> {
        const response = await apiClient.get('/academic-years');
        return response.data.data;
    },

    /**
     * Get current academic year for the school
     */
    async getCurrent(): Promise<AcademicYear> {
        const response = await apiClient.get('/academic-years/current');
        return response.data.data;
    },

    /**
     * Create a new academic year
     */
    async create(data: CreateAcademicYearDto): Promise<AcademicYear> {
        const response = await apiClient.post('/academic-years', data);
        return response.data.data;
    },

    /**
     * Update an academic year
     */
    async update(id: string, data: UpdateAcademicYearDto): Promise<AcademicYear> {
        const response = await apiClient.put(`/academic-years/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete an academic year
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/academic-years/${id}`);
    },

    /**
     * Set as current academic year
     */
    async setCurrent(id: string): Promise<AcademicYear> {
        const response = await apiClient.patch(`/academic-years/${id}/set-current`);
        return response.data.data;
    },
};

export default academicService;