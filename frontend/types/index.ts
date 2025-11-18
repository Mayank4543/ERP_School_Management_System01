// User roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  ACCOUNTANT = 'accountant',
  LIBRARIAN = 'librarian',
  RECEPTIONIST = 'receptionist',
}

// User interface
export interface User {
  _id?: string;
  id?: string;
  email: string;
  username?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  roles?: string[];
  school_id?: string;
  usergroup_id?: string;
  profile_picture?: string;
  phone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Auth interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: string;
    user: {
      id: string;
      name: string;
      email: string;
      school_id: string;
      usergroup_id: string;
      roles: string[];
    };
  };
  message: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  school_id?: string;
  phone?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// School
export interface School {
  _id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  website?: string;
  logo?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Student
export interface Student {
  _id: string;
  school_id: string;
  admission_no: string;
  roll_no?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  blood_group?: string;
  religion?: string;
  caste?: string;
  category?: string;
  mother_tongue?: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  admission_date: string;
  academic_year_id: string;
  standard: number;
  section: string;
  profile_picture?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Teacher
export interface Teacher {
  _id: string;
  school_id: string;
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  blood_group?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  joining_date: string;
  qualification: string;
  experience_years?: number;
  subjects?: string[];
  designation?: string;
  department?: string;
  profile_picture?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Attendance
export interface Attendance {
  _id: string;
  school_id: string;
  student_id?: string;
  teacher_id?: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  remarks?: string;
  marked_by: string;
  created_at: string;
  updated_at: string;
}

// Exam
export interface Exam {
  _id: string;
  school_id: string;
  name: string;
  exam_type: string;
  academic_year_id: string;
  standard: number;
  start_date: string;
  end_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Exam Result
export interface ExamResult {
  _id: string;
  school_id: string;
  exam_id: string;
  student_id: string;
  subject_id: string;
  marks_obtained: number;
  total_marks: number;
  grade?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// Fee
export interface Fee {
  _id: string;
  school_id: string;
  name: string;
  amount: number;
  fee_type: string;
  academic_year_id: string;
  standard?: number;
  due_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fee Payment
export interface FeePayment {
  _id: string;
  school_id: string;
  student_id: string;
  fee_id: string;
  amount_paid: number;
  payment_date: string;
  payment_mode: 'cash' | 'card' | 'cheque' | 'online' | 'upi';
  transaction_id?: string;
  receipt_no: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// Library Book
export interface LibraryBook {
  _id: string;
  school_id: string;
  book_no: string;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  category: string;
  quantity: number;
  available_quantity: number;
  price?: number;
  rack_no?: string;
  created_at: string;
  updated_at: string;
}

// Book Issue
export interface BookIssue {
  _id: string;
  school_id: string;
  book_id: string;
  member_id: string;
  member_type: 'student' | 'teacher';
  issue_date: string;
  due_date: string;
  return_date?: string;
  fine_amount?: number;
  status: 'issued' | 'returned' | 'overdue';
  created_at: string;
  updated_at: string;
}

// Notification
export interface Notification {
  _id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link?: string;
  created_at: string;
}
