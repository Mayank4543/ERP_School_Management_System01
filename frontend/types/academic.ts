import { Teacher } from './index';

// Subject Management Types
export interface Subject {
  _id: string;
  school_id: string;
  academic_year_id: string;
  name: string;
  code: string;
  type: 'core' | 'elective' | 'language' | 'science' | 'arts' | 'vocational' | 'sports';
  description?: string;
  standards: number[];
  total_periods_per_week: number;
  max_marks: number;
  pass_marks: number;
  is_practical: boolean;
  is_theory: boolean;
  syllabus_url?: string;
  textbook_name?: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectDto {
  school_id: string;
  academic_year_id: string;
  name: string;
  code: string;
  type?: Subject['type'];
  description?: string;
  standards: number[];
  total_periods_per_week?: number;
  max_marks?: number;
  pass_marks?: number;
  is_practical?: boolean;
  is_theory?: boolean;
  syllabus_url?: string;
  textbook_name?: string;
}

// Section Management Types
export interface Section {
  _id: string;
  school_id: string;
  academic_year_id: string;
  name: string;
  standard: number;
  capacity: number;
  current_strength: number;
  class_teacher_id?: string;
  class_teacher?: Teacher;
  room_number?: string;
  building?: string;
  floor?: string;
  shift: 'morning' | 'afternoon' | 'evening';
  is_active: boolean;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSectionDto {
  school_id: string;
  academic_year_id: string;
  name: string;
  standard: number;
  capacity?: number;
  class_teacher_id?: string;
  room_number?: string;
  building?: string;
  floor?: string;
  shift?: Section['shift'];
  remarks?: string;
}

// Teacher Assignment Types
export interface TeacherAssignment {
  _id: string;
  school_id: string;
  academic_year_id: string;
  teacher_id: string;
  teacher?: Teacher;
  subject_id: string;
  subject?: Subject;
  standard: number;
  section_id: string;
  section?: Section;
  periods_per_week: number;
  assignment_type: 'primary' | 'secondary';
  is_class_teacher: boolean;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTeacherAssignmentDto {
  school_id: string;
  academic_year_id: string;
  teacher_id: string;
  subject_id: string;
  standard: number;
  section_id: string;
  periods_per_week?: number;
  assignment_type?: TeacherAssignment['assignment_type'];
  is_class_teacher?: boolean;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface TeacherWorkload {
  assignments: TeacherAssignment[];
  summary: {
    total_periods_per_week: number;
    total_subjects: number;
    total_classes: number;
    is_class_teacher: boolean;
  };
}

// Enhanced Teacher Type with Assignments
export interface TeacherWithAssignments extends Teacher {
  assignments?: TeacherAssignment[];
  workload?: TeacherWorkload['summary'];
}

// Academic Dashboard Types
export interface AcademicStats {
  total_subjects: number;
  total_sections: number;
  total_teacher_assignments: number;
  subjects_by_type: Record<Subject['type'], number>;
  sections_by_standard: Record<number, number>;
  teacher_workload_summary: {
    avg_periods_per_teacher: number;
    overloaded_teachers: number;
    underloaded_teachers: number;
  };
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}