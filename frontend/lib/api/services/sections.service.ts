import api from '../client';
import { Section, CreateSectionDto, PaginatedResponse } from '@/types/academic';

export interface SectionFilters {
  search?: string;
  standard?: number;
  shift?: 'morning' | 'afternoon' | 'evening';
  schoolId?: string;
  academicYearId?: string;
  hasClassTeacher?: boolean;
  page?: number;
  limit?: number;
}

class SectionsService {
  private baseUrl = '/sections';

  async getAll(filters: SectionFilters = {}): Promise<PaginatedResponse<Section>> {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.standard) params.append('standard', filters.standard.toString());
      if (filters.shift) params.append('shift', filters.shift);
      if (filters.schoolId) params.append('schoolId', filters.schoolId);
      if (filters.academicYearId) params.append('academicYearId', filters.academicYearId);
      if (filters.hasClassTeacher !== undefined) params.append('hasClassTeacher', filters.hasClassTeacher.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`${this.baseUrl}?${params.toString()}`);

      // Backend returns: { success: true, data: { data: [...], total: 39, page: 1, totalPages: 1 } }
      // We need to return: { data: [...], total: 39, page: 1, totalPages: 1 }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Section> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching section:', error);
      throw error;
    }
  }

  async create(data: CreateSectionDto): Promise<Section> {
    try {
      console.log('Creating section with data:', data);
      const response = await api.post(this.baseUrl, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating section:', error);

      // Extract the specific error message from the backend
      // Backend returns: { success: false, error: { message: "..." }, timestamp: "..." }
      if (error.response?.data?.error?.message) {
        const backendError = new Error(error.response.data.error.message);
        backendError.name = 'ConflictError';
        throw backendError;
      } else if (error.response?.data?.message) {
        // Fallback to direct message
        const backendError = new Error(error.response.data.message);
        backendError.name = 'ConflictError';
        throw backendError;
      }

      throw error;
    }
  }

  async update(id: string, data: Partial<CreateSectionDto>): Promise<Section> {
    try {
      console.log('Updating section with data:', data);
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating section:', error);

      // Extract the specific error message from the backend
      if (error.response?.data?.error?.message) {
        const backendError = new Error(error.response.data.error.message);
        backendError.name = 'ConflictError';
        throw backendError;
      } else if (error.response?.data?.message) {
        const backendError = new Error(error.response.data.message);
        backendError.name = 'ConflictError';
        throw backendError;
      }

      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  }

  async getByStandard(standard: number, academicYearId?: string): Promise<Section[]> {
    try {
      const params = academicYearId ? { academicYearId } : {};
      const url = `${this.baseUrl}/standard/${standard}`;

      console.log('🔍 [SECTIONS SERVICE] API Call Details:');
      console.log('  - URL:', url);
      console.log('  - Params:', params);
      console.log('  - Standard:', standard);
      console.log('  - Academic Year ID:', academicYearId);

      const response = await api.get(url, { params });

      console.log('📦 [SECTIONS SERVICE] API Response:');
      console.log('  - Status:', response.status);
      console.log('  - Response data:', response.data);
      console.log('  - Response.data.data:', response.data.data);
      console.log('  - Final result:', response.data.data || response.data || []);

      const result = response.data.data || response.data || [];

      if (!Array.isArray(result)) {
        console.warn('⚠️ [SECTIONS SERVICE] Response is not an array:', result);
        return [];
      }

      return result;
    } catch (error: any) {
      console.error('❌ [SECTIONS SERVICE] Error fetching sections by standard:', error);
      console.error('❌ [SECTIONS SERVICE] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params
      });
      throw error;
    }
  }

  async updateClassTeacher(sectionId: string, teacherId: string | null): Promise<Section> {
    try {
      const response = await api.patch(`${this.baseUrl}/${sectionId}/class-teacher`, {
        class_teacher_id: teacherId
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating class teacher:', error);
      throw error;
    }
  }

  async getSectionStats(schoolId: string, academicYearId: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`, {
        params: { school_id: schoolId, academic_year_id: academicYearId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching section stats:', error);
      throw error;
    }
  }

  async getUniqueStandards(academicYearId?: string): Promise<number[]> {
    try {
      const params = academicYearId ? { academicYearId } : {};
      const url = `${this.baseUrl}/standards`;

      console.log('🔍 [SECTIONS SERVICE] Fetching unique standards:');
      console.log('  - URL:', url);
      console.log('  - Params:', params);

      const response = await api.get(url, { params });

      console.log('📦 [SECTIONS SERVICE] Standards Response:');
      console.log('  - Status:', response.status);
      console.log('  - Response data:', response.data);
      console.log('  - Final standards:', response.data.data || response.data || []);

      return response.data.data || response.data || [];
    } catch (error: any) {
      console.error('❌ [SECTIONS SERVICE] Error fetching unique standards:', error);
      console.error('❌ [SECTIONS SERVICE] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params
      });
      throw error;
    }
  }
}

export const sectionsService = new SectionsService();
export default sectionsService;