import api from '../client';
import { TeacherAssignment, CreateTeacherAssignmentDto, TeacherWorkload, PaginatedResponse } from '@/types/academic';

export class TeacherAssignmentsService {
  private baseUrl = '/teacher-assignments';

  async create(assignmentData: CreateTeacherAssignmentDto): Promise<TeacherAssignment> {
    const response = await api.post(this.baseUrl, assignmentData);
    return response.data;
  }

  async getAll(params?: {
    academicYearId?: string;
    teacherId?: string;
    subjectId?: string;
    standard?: number;
    sectionId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TeacherAssignment>> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  async getById(id: string): Promise<TeacherAssignment> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getTeacherWorkload(teacherId: string, academicYearId: string): Promise<TeacherWorkload> {
    const response = await api.get(`${this.baseUrl}/teacher/${teacherId}/workload`, {
      params: { academicYearId }
    });
    return response.data;
  }

  async getClassTeacher(standard: number, sectionId: string, academicYearId: string): Promise<TeacherAssignment | null> {
    try {
      const response = await api.get(`${this.baseUrl}/class-teacher/${standard}/${sectionId}`, {
        params: { academicYearId }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getSubjectTeachers(subjectId: string, academicYearId: string, standard?: number): Promise<TeacherAssignment[]> {
    const params: any = { academicYearId };
    if (standard) {
      params.standard = standard;
    }

    const response = await api.get(`${this.baseUrl}/subject/${subjectId}/teachers`, { params });
    return response.data;
  }

  async update(id: string, assignmentData: Partial<CreateTeacherAssignmentDto>): Promise<TeacherAssignment> {
    const response = await api.patch(`${this.baseUrl}/${id}`, assignmentData);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // Utility methods
  getAssignmentTypeOptions(): Array<{ value: TeacherAssignment['assignment_type']; label: string }> {
    return [
      { value: 'primary', label: 'Primary Teacher' },
      { value: 'secondary', label: 'Secondary/Support Teacher' },
    ];
  }

  getStatusOptions(): Array<{ value: TeacherAssignment['status']; label: string }> {
    return [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'completed', label: 'Completed' },
    ];
  }

  // Assignment validation helpers
  validateWorkload(assignments: TeacherAssignment[]): {
    isOverloaded: boolean;
    isUnderloaded: boolean;
    totalPeriods: number;
    maxRecommended: number;
  } {
    const totalPeriods = assignments.reduce((sum, assignment) => sum + (assignment.periods_per_week || 0), 0);
    const maxRecommended = 35; // Maximum recommended periods per week
    const minRecommended = 20; // Minimum recommended periods per week

    return {
      isOverloaded: totalPeriods > maxRecommended,
      isUnderloaded: totalPeriods < minRecommended,
      totalPeriods,
      maxRecommended,
    };
  }

  // Get conflict detection for scheduling
  detectConflicts(assignments: TeacherAssignment[]): {
    hasConflicts: boolean;
    conflicts: Array<{
      type: 'same_time' | 'same_subject_section' | 'multiple_class_teacher';
      assignments: TeacherAssignment[];
      message: string;
    }>;
  } {
    const conflicts = [];

    // Check for multiple class teacher assignments
    const classTeacherAssignments = assignments.filter(a => a.is_class_teacher);
    if (classTeacherAssignments.length > 1) {
      conflicts.push({
        type: 'multiple_class_teacher' as const,
        assignments: classTeacherAssignments,
        message: 'Teacher is assigned as class teacher for multiple sections',
      });
    }

    // Check for same subject in same section (duplicate assignments)
    const subjectSectionMap = new Map();
    assignments.forEach(assignment => {
      const key = `${assignment.subject_id}-${assignment.standard}-${assignment.section_id}`;
      if (subjectSectionMap.has(key)) {
        conflicts.push({
          type: 'same_subject_section' as const,
          assignments: [subjectSectionMap.get(key), assignment],
          message: `Duplicate assignment for same subject in Class ${assignment.standard}`,
        });
      } else {
        subjectSectionMap.set(key, assignment);
      }
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
    };
  }

  // Generate assignment summary
  generateAssignmentSummary(assignments: TeacherAssignment[]): {
    bySubject: Record<string, TeacherAssignment[]>;
    byStandard: Record<number, TeacherAssignment[]>;
    bySection: Record<string, TeacherAssignment[]>;
    totalPeriods: number;
    totalClasses: number;
    classTeacherFor?: TeacherAssignment;
  } {
    const bySubject: Record<string, TeacherAssignment[]> = {};
    const byStandard: Record<number, TeacherAssignment[]> = {};
    const bySection: Record<string, TeacherAssignment[]> = {};
    let totalPeriods = 0;
    let classTeacherFor: TeacherAssignment | undefined;

    assignments.forEach(assignment => {
      // Group by subject
      const subjectName = assignment.subject?.name || 'Unknown Subject';
      if (!bySubject[subjectName]) bySubject[subjectName] = [];
      bySubject[subjectName].push(assignment);

      // Group by standard
      if (!byStandard[assignment.standard]) byStandard[assignment.standard] = [];
      byStandard[assignment.standard].push(assignment);

      // Group by section
      const sectionKey = `${assignment.standard}-${assignment.section?.name}`;
      if (!bySection[sectionKey]) bySection[sectionKey] = [];
      bySection[sectionKey].push(assignment);

      // Sum periods
      totalPeriods += assignment.periods_per_week || 0;

      // Find class teacher assignment
      if (assignment.is_class_teacher) {
        classTeacherFor = assignment;
      }
    });

    return {
      bySubject,
      byStandard,
      bySection,
      totalPeriods,
      totalClasses: Object.keys(bySection).length,
      classTeacherFor,
    };
  }
}

export const teacherAssignmentsService = new TeacherAssignmentsService();