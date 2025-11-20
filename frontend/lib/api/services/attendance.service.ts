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
  class: number;
  section: string;
  attendance_records: Array<{
    student_id: string;
    status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
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
}

const attendanceService = {
  /**
   * Mark attendance for class
   */
  async markAttendance(data: MarkAttendanceData): Promise<any> {
    const response = await apiClient.post('/attendance/mark', data);
    return response.data;
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
    const response = await apiClient.get('/attendance', {
      params: {
        school_id: schoolId,
        date,
        standard,
        section,
      },
    });
    return response.data.data;
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
    return response.data.data;
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
    return response.data.data;
  },

  /**
   * Get attendance summary
   */
  async getSummary(
    schoolId: string,
    date?: string
  ): Promise<any> {
    const response = await apiClient.get('/attendance/summary', {
      params: {
        school_id: schoolId,
        ...(date && { date }),
      },
    });
    return response.data.data;
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
