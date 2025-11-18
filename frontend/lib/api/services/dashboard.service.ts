import apiClient from '../client';

export interface StudentDashboardData {
  personalStats: {
    attendance: number;
    averageScore: number;
    classRank: number;
    pendingFees: number;
    totalStudents: number;
  };
  todaySchedule: Array<{
    time: string;
    subject: string;
    teacher: string;
    room: string;
    status: 'completed' | 'ongoing' | 'upcoming';
  }>;
  upcomingExams: Array<{
    subject: string;
    date: string;
    syllabus: string;
    type: string;
    marks: string;
  }>;
  pendingAssignments: Array<{
    subject: string;
    title: string;
    dueDate: string;
    daysLeft: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  recentGrades: Array<{
    subject: string;
    topic: string;
    marks: string;
    grade: string;
    date: string;
    percentage: number;
  }>;
  activities: Array<{
    action: string;
    details: string;
    time: string;
  }>;
}

export const dashboardService = {
  /**
   * Get student dashboard data (composite API)
   */
  async getStudentDashboard(userId: string): Promise<StudentDashboardData> {
    try {
      // First, get student info by user_id to get the actual student _id
      const studentInfoResponse = await apiClient.get(`/students/user/${userId}`);
      const studentId = studentInfoResponse.data.data._id;

      // Get current academic year
      const academicYearResponse = await apiClient.get('/academic-years/current').catch(() => null);
      const currentAcademicYearId = academicYearResponse?.data?.data?._id || null;

      // Fetch all data in parallel
      const [
        studentInfo,
        attendanceData,
        examsData,
        marksData,
        feesData,
        // timetableData,
        // assignmentsData,
      ] = await Promise.all([
        // Student info already fetched above
        Promise.resolve(studentInfoResponse),
        
        // Get attendance summary
        apiClient.get(`/attendance/user/${studentId}`, {
          params: {
            start_date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
            end_date: new Date().toISOString(),
          },
        }),
        
        // Get upcoming exams (only if we have academic year ID)
        currentAcademicYearId 
          ? apiClient.get('/exams', {
              params: {
                academic_year_id: currentAcademicYearId,
              },
            })
          : Promise.resolve({ data: { data: [] } }),
        
        // Get student marks
        apiClient.get(`/exams/student/${studentId}/exam/all`).catch(() => ({ data: { data: [] } })),
        
        // Get fees info (if API exists)
        apiClient.get(`/fees/student/${studentId}`).catch(() => ({ data: { data: { pending: 0 } } })),
        
        // Get timetable (if API exists)
        // apiClient.get(`/timetable/student/${studentId}`).catch(() => ({ data: { data: [] } })),
        
        // Get assignments (if API exists)
        // apiClient.get(`/assignments/student/${studentId}`).catch(() => ({ data: { data: [] } })),
      ]);

      // Calculate attendance percentage
      const attendanceRecords = attendanceData.data.data || [];
      const totalDays = attendanceRecords.length;
      const presentDays = attendanceRecords.filter(
        (record: any) => record.status === 'present'
      ).length;
      const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      // Calculate average score from marks
      const marks = marksData.data.data || [];
      const totalMarks = marks.reduce((sum: number, mark: any) => {
        return sum + (mark.obtained_marks / mark.total_marks) * 100;
      }, 0);
      const averageScore = marks.length > 0 ? totalMarks / marks.length : 0;

      // Format upcoming exams
      const upcomingExams = (examsData.data.data || [])
        .filter((exam: any) => new Date(exam.start_date) >= new Date())
        .slice(0, 3)
        .map((exam: any) => ({
          subject: exam.subject_name || exam.name,
          date: exam.start_date,
          syllabus: exam.syllabus || 'To be announced',
          type: exam.exam_type || 'Regular',
          marks: exam.total_marks?.toString() || '100',
        }));

      // Format recent grades
      const recentGrades = marks.slice(0, 4).map((mark: any) => ({
        subject: mark.subject_name || 'Subject',
        topic: mark.exam_name || 'Assessment',
        marks: `${mark.obtained_marks}/${mark.total_marks}`,
        grade: mark.grade || this.calculateGrade(mark.obtained_marks, mark.total_marks),
        date: mark.exam_date || new Date().toISOString(),
        percentage: (mark.obtained_marks / mark.total_marks) * 100,
      }));

      // Mock data for features not yet available in backend
      const todaySchedule = [
        { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Sharma', room: '101', status: 'completed' as const },
        { time: '10:00 - 11:00', subject: 'English', teacher: 'Ms. Gupta', room: '102', status: 'completed' as const },
        { time: '11:15 - 12:15', subject: 'Physics', teacher: 'Dr. Kumar', room: '201', status: 'ongoing' as const },
        { time: '12:15 - 01:15', subject: 'Chemistry', teacher: 'Ms. Patel', room: '202', status: 'upcoming' as const },
        { time: '02:00 - 03:00', subject: 'Computer Science', teacher: 'Mr. Singh', room: '301', status: 'upcoming' as const },
      ];

      const pendingAssignments = [
        { subject: 'Science', title: 'Project Work - Solar System', dueDate: '2025-11-20', daysLeft: 3, priority: 'high' as const },
        { subject: 'English', title: 'Essay - Environmental Issues', dueDate: '2025-11-22', daysLeft: 5, priority: 'medium' as const },
        { subject: 'Math', title: 'Problem Set - Calculus', dueDate: '2025-11-24', daysLeft: 7, priority: 'low' as const },
      ];

      const activities = [
        { action: 'Assignment submitted', details: 'Science Project completed', time: '2 hours ago' },
        { action: 'Grade received', details: 'Math Test - 85/100 (A)', time: '1 day ago' },
        { action: 'Attendance marked', details: 'Present in all classes', time: '1 day ago' },
      ];

      return {
        personalStats: {
          attendance: Math.round(attendancePercentage * 10) / 10,
          averageScore: Math.round(averageScore * 10) / 10,
          classRank: 5, // This needs class ranking logic
          pendingFees: feesData.data.data?.pending || 0,
          totalStudents: 45, // This needs to come from class info
        },
        todaySchedule,
        upcomingExams,
        pendingAssignments,
        recentGrades,
        activities,
      };
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
      throw error;
    }
  },

  /**
   * Calculate grade based on percentage
   */
  calculateGrade(obtained: number, total: number): string {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  },

  /**
   * Get attendance details for date range
   */
  async getStudentAttendance(studentId: string, startDate: string, endDate: string) {
    const response = await apiClient.get(`/attendance/user/${studentId}`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  /**
   * Get student exam results
   */
  async getStudentExamResults(studentId: string, examId: string) {
    const response = await apiClient.get(`/exams/student/${studentId}/exam/${examId}`);
    return response.data;
  },

  /**
   * Get attendance summary
   */
  async getAttendanceSummary(schoolId: string, academicYearId: string, userId: string) {
    const response = await apiClient.get('/attendance/summary', {
      params: {
        academic_year_id: academicYearId,
        user_type: 'student',
        user_id: userId,
      },
    });
    return response.data;
  },
};
