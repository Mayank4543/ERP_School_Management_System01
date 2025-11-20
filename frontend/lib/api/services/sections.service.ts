import apiClient from '../client';

export interface Section {
    _id: string;
    name: string;
    standard: number;
    capacity: number;
    school_id: string;
    academic_year_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Mock sections data - in a real app this would come from API
const MOCK_SECTIONS: Section[] = [
    {
        _id: '507f1f77bcf86cd799439013',
        name: 'A',
        standard: 6,
        capacity: 40,
        school_id: '507f1f77bcf86cd799439011',
        academic_year_id: '507f1f77bcf86cd799439012',
        is_active: true,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
    },
    {
        _id: '507f1f77bcf86cd799439014',
        name: 'B',
        standard: 6,
        capacity: 40,
        school_id: '507f1f77bcf86cd799439011',
        academic_year_id: '507f1f77bcf86cd799439012',
        is_active: true,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
    },
    {
        _id: '507f1f77bcf86cd799439015',
        name: 'C',
        standard: 6,
        capacity: 40,
        school_id: '507f1f77bcf86cd799439011',
        academic_year_id: '507f1f77bcf86cd799439012',
        is_active: true,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
    },
];

// Generate sections for classes 6-12 with proper ObjectIds
for (let standard = 7; standard <= 12; standard++) {
    ['A', 'B', 'C','D','E'].forEach((sectionName, index) => {
        const baseId = '507f1f77bcf86cd799439';
        const uniqueId = (100 + standard * 10 + index).toString().padStart(3, '0');
        MOCK_SECTIONS.push({
            _id: baseId + uniqueId,
            name: sectionName,
            standard: standard,
            capacity: 40,
            school_id: '507f1f77bcf86cd799439011',
            academic_year_id: '507f1f77bcf86cd799439012',
            is_active: true,
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
        });
    });
}

const sectionsService = {
    /**
     * Get all sections for a specific standard (class)
     */
    async getByStandard(standard: number): Promise<Section[]> {
        // For now, return mock data. In real app, this would be:
        // const response = await apiClient.get(`/sections?standard=${standard}`);
        // return response.data.data;

        return MOCK_SECTIONS.filter(section => section.standard === standard);
    },

    /**
     * Get all sections
     */
    async getAll(): Promise<Section[]> {
        // For now, return mock data. In real app, this would be:
        // const response = await apiClient.get('/sections');
        // return response.data.data;

        return MOCK_SECTIONS;
    },

    /**
     * Get section by ID
     */
    async getById(id: string): Promise<Section | undefined> {
        return MOCK_SECTIONS.find(section => section._id === id);
    },
};

export default sectionsService;