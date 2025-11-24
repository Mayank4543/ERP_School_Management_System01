import { apiClient } from './client';

export const studentsService = {
  async getStudentByUserId(userId: string): Promise<any> {
    return apiClient.get(`/students/user/${userId}`);
  },

  async getStudentById(id: string): Promise<any> {
    return apiClient.get(`/students/${id}`);
  },

  async getAttendance(studentId: string, params?: any): Promise<any> {
    return apiClient.get(`/attendance/user/${studentId}`, { params });
  },

  async getAssignments(studentId: string): Promise<any> {
    return apiClient.get('/assignments', {
      params: { student_id: studentId },
    });
  },

  async submitAssignment(assignmentId: string, data: any): Promise<any> {
    return apiClient.post(`/assignments/${assignmentId}/submit`, data);
  },

  async getExams(studentId: string): Promise<any> {
    return apiClient.get('/exams', {
      params: { student_id: studentId },
    });
  },

  async getFees(studentId: string): Promise<any> {
    return apiClient.get('/fees', {
      params: { student_id: studentId },
    });
  },

  async getTimetable(studentId: string): Promise<any> {
    return apiClient.get('/timetable', {
      params: { student_id: studentId },
    });
  },
};



