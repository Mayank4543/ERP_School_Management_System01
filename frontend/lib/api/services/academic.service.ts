import apiClient from '../client';

export interface AcademicYear {
    _id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    school_id: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
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
};

export default academicService;