import api from '../client';
import { Subject, CreateSubjectDto, PaginatedResponse } from '@/types/academic';

export class SubjectsService {
  private baseUrl = '/subjects';

  async create(subjectData: CreateSubjectDto): Promise<Subject> {
    const response = await api.post(this.baseUrl, subjectData);
    return response.data;
  }

  async getAll(params?: {
    academicYearId?: string;
    standard?: number;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Subject>> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  async getById(id: string): Promise<Subject> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<Subject> {
    const response = await api.get(`${this.baseUrl}/code/${code}`);
    return response.data;
  }

  async getByStandard(standard: number, academicYearId?: string): Promise<Subject[]> {
    const params = academicYearId ? { academicYearId } : {};
    const response = await api.get(`${this.baseUrl}/standard/${standard}`, { params });
    return response.data;
  }

  async getByType(type: string, academicYearId?: string): Promise<Subject[]> {
    const params = academicYearId ? { academicYearId } : {};
    const response = await api.get(`${this.baseUrl}/type/${type}`, { params });
    return response.data;
  }

  async update(id: string, subjectData: Partial<CreateSubjectDto>): Promise<Subject> {
    const response = await api.patch(`${this.baseUrl}/${id}`, subjectData);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // Utility methods for frontend
  getSubjectTypeOptions(): Array<{ value: Subject['type']; label: string }> {
    return [
      { value: 'core', label: 'Core Subject' },
      { value: 'elective', label: 'Elective' },
      { value: 'language', label: 'Language' },
      { value: 'science', label: 'Science' },
      { value: 'arts', label: 'Arts' },
      { value: 'vocational', label: 'Vocational' },
      { value: 'sports', label: 'Sports & Physical Education' },
    ];
  }

  getStandardOptions(): Array<{ value: number; label: string }> {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: `Class ${i + 1}`,
    }));
  }
}

export const subjectsService = new SubjectsService();