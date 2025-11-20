import apiClient from '../client';
import { Exam, ExamResult } from '@/types';

export interface ExamFilters {
  schoolId: string;
  page?: number;
  limit?: number;
  academic_year_id?: string;
  standard?: number;
  exam_type?: string;
}

export interface CreateExamData {
  school_id: string;
  name: string;
  exam_type: string;
  academic_year_id: string;
  standard: number;
  start_date: string;
  end_date: string;
  subjects: Array<{
    subject_id: string;
    date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    passing_marks: number;
  }>;
}

export interface MarksEntryData {
  exam_id: string;
  student_id: string;
  subject_id: string;
  marks_obtained: number;
  total_marks: number;
  grade?: string;
  remarks?: string;
}

const examsService = {
  /**
   * Get all exams
   */
  async getAll(filters: ExamFilters): Promise<any> {
    const response = await apiClient.get('/exams', {
      params: {
        school_id: filters.schoolId,
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.academic_year_id && { academic_year_id: filters.academic_year_id }),
        ...(filters.standard && { standard: filters.standard }),
        ...(filters.exam_type && { exam_type: filters.exam_type }),
      },
    });
    return response.data;
  },

  /**
   * Get exam by ID
   */
  async getById(id: string): Promise<Exam> {
    const response = await apiClient.get(`/exams/${id}`);
    return response.data.data;
  },

  /**
   * Create new exam
   */
  async create(data: CreateExamData): Promise<Exam> {
    const response = await apiClient.post('/exams', data);
    return response.data.data;
  },

  /**
   * Update exam
   */
  async update(id: string, data: Partial<CreateExamData>): Promise<Exam> {
    const response = await apiClient.patch(`/exams/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete exam
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/exams/${id}`);
  },

  /**
   * Enter marks for student
   */
  async enterMarks(data: MarksEntryData): Promise<ExamResult> {
    const response = await apiClient.post('/exams/marks', data);
    return response.data.data;
  },

  /**
   * Get student exam results
   */
  async getStudentResults(
    studentId: string,
    examId?: string
  ): Promise<ExamResult[]> {
    const url = examId 
      ? `/exams/student/${studentId}/exam/${examId}`
      : `/exams/student/${studentId}/exam/all`;
    
    const response = await apiClient.get(url);
    return response.data.data;
  },

  /**
   * Get exam results by class
   */
  async getClassResults(
    examId: string,
    standard: number,
    section?: string
  ): Promise<any> {
    const response = await apiClient.get(`/exams/${examId}/results`, {
      params: {
        standard,
        ...(section && { section }),
      },
    });
    return response.data.data;
  },

  /**
   * Publish exam results
   */
  async publishResults(examId: string): Promise<void> {
    await apiClient.post(`/exams/${examId}/publish`);
  },

  /**
   * Export exam results
   */
  async exportResults(examId: string): Promise<Blob> {
    const response = await apiClient.get(`/exams/${examId}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default examsService;
