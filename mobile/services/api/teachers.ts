import { apiClient } from './client';

export const teachersService = {
  async getTeacherByUserId(userId: string): Promise<any> {
    return apiClient.get(`/teachers/user/${userId}`);
  },

  async getClasses(teacherId: string): Promise<any> {
    return apiClient.get('/teacher-assignments', {
      params: { teacher_id: teacherId },
    });
  },

  async markAttendance(data: {
    date: string;
    class_id: string;
    students: Array<{ student_id: string; status: 'present' | 'absent' }>;
  }): Promise<any> {
    return apiClient.post('/attendance/mark', data);
  },

  async getAttendanceByDate(date: string, classId: string): Promise<any> {
    return apiClient.get(`/attendance/date/${date}`, {
      params: { class_id: classId },
    });
  },

  async createAssignment(data: any): Promise<any> {
    return apiClient.post('/assignments', data);
  },

  async getAssignments(teacherId: string): Promise<any> {
    return apiClient.get('/assignments', {
      params: { teacher_id: teacherId },
    });
  },

  async gradeAssignment(assignmentId: string, submissionId: string, grade: number): Promise<any> {
    return apiClient.patch(`/assignments/${assignmentId}/submissions/${submissionId}`, {
      grade,
    });
  },
};



