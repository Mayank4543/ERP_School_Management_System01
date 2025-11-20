import apiClient from '../client';

export interface ReportFilters {
  schoolId: string;
  startDate?: string;
  endDate?: string;
  standard?: number;
  section?: string;
  academic_year_id?: string;
}

const reportsService = {
  /**
   * Get attendance report
   */
  async getAttendanceReport(filters: ReportFilters): Promise<Blob> {
    const response = await apiClient.get('/reports/attendance', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get fee collection report
   */
  async getFeeReport(filters: ReportFilters): Promise<Blob> {
    const response = await apiClient.get('/reports/fees', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get exam results report
   */
  async getExamReport(examId: string): Promise<Blob> {
    const response = await apiClient.get(`/reports/exam/${examId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get student report card
   */
  async getStudentReportCard(
    studentId: string,
    academicYearId: string
  ): Promise<Blob> {
    const response = await apiClient.get(`/reports/student/${studentId}/report-card`, {
      params: { academic_year_id: academicYearId },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get defaulters list
   */
  async getDefaultersList(schoolId: string): Promise<Blob> {
    const response = await apiClient.get(`/reports/defaulters/${schoolId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get teacher performance report
   */
  async getTeacherReport(
    schoolId: string,
    startDate: string,
    endDate: string
  ): Promise<Blob> {
    const response = await apiClient.get('/reports/teachers', {
      params: {
        school_id: schoolId,
        start_date: startDate,
        end_date: endDate,
      },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get class-wise report
   */
  async getClassReport(
    schoolId: string,
    standard: number,
    section: string,
    academicYearId: string
  ): Promise<Blob> {
    const response = await apiClient.get('/reports/class', {
      params: {
        school_id: schoolId,
        standard,
        section,
        academic_year_id: academicYearId,
      },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get monthly summary report
   */
  async getMonthlySummary(
    schoolId: string,
    month: number,
    year: number
  ): Promise<any> {
    const response = await apiClient.get('/reports/monthly-summary', {
      params: {
        school_id: schoolId,
        month,
        year,
      },
    });
    return response.data.data;
  },
};

export default reportsService;
