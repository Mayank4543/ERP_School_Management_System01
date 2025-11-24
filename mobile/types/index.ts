export interface User {
  id: string;
  _id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  mobile_no?: string;
  profile_picture?: string;
  school_id?: string;
  usergroup_id?: string;
  roles?: string[];
  ref_id?: string;
}

export interface Student {
  _id: string;
  user_id: string;
  admission_no: string;
  first_name: string;
  last_name: string;
  standard: number;
  section_id: string;
  parent_id?: string;
  status: string;
}

export interface Teacher {
  _id: string;
  user_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  department?: string;
  subjects?: string[];
}

export interface Attendance {
  _id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class_id: string;
  due_date: string;
  created_by: string;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  _id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string;
  file_url?: string;
  grade?: number;
  status: 'submitted' | 'graded' | 'late';
}

export interface Exam {
  _id: string;
  name: string;
  subject: string;
  class_id: string;
  exam_date: string;
  total_marks: number;
  passing_marks: number;
}

export interface Fee {
  _id: string;
  student_id: string;
  fee_type: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  paid_date?: string;
}



