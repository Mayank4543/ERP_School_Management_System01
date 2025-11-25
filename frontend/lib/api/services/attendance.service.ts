import apiClient from '../client';
import { Attendance } from '@/types';

export interface AttendanceFilters {
  schoolId: string;
  date?: string;
  class?: number;
  section?: string;
  student_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface MarkAttendanceData {
  school_id: string;
  date: string;
  user_type: 'student' | 'teacher' | 'staff';
  academic_year_id?: string;
  standard?: number;
  section_id?: string;
  attendance: Array<{
    user_id: string;
    status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
    reason?: string;
    remarks?: string;
  }>;
}

export interface AttendanceReport {
  student_id: string;
  student_name: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  percentage: number;
  class?: string;
  standard?: number;
  section?: string;
}

export interface AttendanceSummary {
  total_students: number;
  present: number;
  absent: number;
  late: number;
  on_leave: number;
  half_day: number;
  attendance_percentage: number;
}

const attendanceService = {
  /**
   * Mark attendance for class
   */
  async markAttendance(data: MarkAttendanceData): Promise<any> {
    try {
      console.log('Sending attendance data:', data);
      const response = await apiClient.post('/attendance/mark', data);
      console.log('Attendance response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Attendance marking failed:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get attendance for specific date and class
   */
  async getByDateAndClass(
    schoolId: string,
    date: string,
    standard: number,
    section: string
  ): Promise<Attendance[]> {
    const response = await apiClient.get(`/attendance/date/${date}`, {
      params: {
        user_type: 'student',
        standard,
        section_id: section,
      },
    });
    return response.data.data || [];
  },

  /**
   * Get student attendance history
   */
  async getStudentAttendance(
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Attendance[]> {
    const response = await apiClient.get(`/attendance/student/${studentId}`, {
      params: {
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      },
    });
    return response.data.data || [];
  },

  /**
   * Get attendance report for class
   */
  async getClassReport(
    schoolId: string,
    standard: number,
    section: string,
    startDate: string,
    endDate: string
  ): Promise<AttendanceReport[]> {
    const response = await apiClient.get('/attendance/report/class', {
      params: {
        school_id: schoolId,
        standard,
        section,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data.data || [];
  },

  /**
   * Get attendance summary
   */
  async getSummary(
    schoolId: string,
    academicYearId: string,
    userType: string = 'student',
    date?: string
  ): Promise<AttendanceSummary> {
    const response = await apiClient.get('/attendance/summary', {
      params: {
        academic_year_id: academicYearId,
        user_type: userType,
        ...(date && { date }),
      },
    });
    return response.data.data || {
      total_students: 0,
      present: 0,
      absent: 0,
      late: 0,
      on_leave: 0,
      half_day: 0,
      attendance_percentage: 0,
    };
  },

  /**
   * Export attendance report
   */
  async exportReport(filters: AttendanceFilters): Promise<Blob> {
    const response = await apiClient.get('/attendance/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default attendanceService;
