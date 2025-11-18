// API Endpoints Configuration

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/password/change',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  // Users
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
  },

  // Schools
  SCHOOLS: {
    LIST: '/schools',
    GET: (id: string) => `/schools/${id}`,
    CREATE: '/schools',
    UPDATE: (id: string) => `/schools/${id}`,
    DELETE: (id: string) => `/schools/${id}`,
  },

  // Academic Years
  ACADEMIC: {
    LIST: '/academic-years',
    GET: (id: string) => `/academic-years/${id}`,
    CURRENT: '/academic-years/current',
    CREATE: '/academic-years',
    UPDATE: (id: string) => `/academic-years/${id}`,
    DELETE: (id: string) => `/academic-years/${id}`,
  },

  // Students
  STUDENTS: {
    LIST: '/students',
    GET: (id: string) => `/students/${id}`,
    CREATE: '/students',
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
    BY_CLASS: '/students/by-class',
    IMPORT: '/students/import',
    EXPORT: '/students/export',
  },

  // Teachers
  TEACHERS: {
    LIST: '/teachers',
    GET: (id: string) => `/teachers/${id}`,
    CREATE: '/teachers',
    UPDATE: (id: string) => `/teachers/${id}`,
    DELETE: (id: string) => `/teachers/${id}`,
  },

  // Attendance
  ATTENDANCE: {
    MARK: '/attendance/mark',
    GET_BY_DATE: (date: string) => `/attendance/date/${date}`,
    GET_BY_USER: (userId: string) => `/attendance/user/${userId}`,
    SUMMARY: '/attendance/summary',
    MONTHLY: '/attendance/monthly',
  },

  // Exams
  EXAMS: {
    LIST: '/exams',
    GET: (id: string) => `/exams/${id}`,
    CREATE: '/exams',
    UPDATE: (id: string) => `/exams/${id}`,
    DELETE: (id: string) => `/exams/${id}`,
    MARKS: '/exams/marks',
  },

  // Assignments
  ASSIGNMENTS: {
    LIST: '/assignments',
    GET: (id: string) => `/assignments/${id}`,
    CREATE: '/assignments',
    UPDATE: (id: string) => `/assignments/${id}`,
    DELETE: (id: string) => `/assignments/${id}`,
    SUBMIT: (id: string) => `/assignments/${id}/submit`,
  },

  // Homework
  HOMEWORK: {
    LIST: '/homework',
    GET: (id: string) => `/homework/${id}`,
    CREATE: '/homework',
    UPDATE: (id: string) => `/homework/${id}`,
    DELETE: (id: string) => `/homework/${id}`,
    SUBMIT: (id: string) => `/homework/${id}/submit`,
  },

  // Fees
  FEES: {
    LIST: '/fees',
    GET: (id: string) => `/fees/${id}`,
    CREATE: '/fees',
    UPDATE: (id: string) => `/fees/${id}`,
    DELETE: (id: string) => `/fees/${id}`,
    PAY: '/fees/pay',
    RECEIPT: (id: string) => `/fees/receipt/${id}`,
  },

  // Library
  LIBRARY: {
    BOOKS: '/library/books',
    ISSUE: '/library/issue',
    RETURN: '/library/return',
    HISTORY: '/library/history',
  },

  // Transport
  TRANSPORT: {
    ROUTES: '/transport/routes',
    VEHICLES: '/transport/vehicles',
    ASSIGN: '/transport/assign',
  },

  // Communication
  COMMUNICATION: {
    NOTICES: '/communication/notices',
    SEND_MESSAGE: '/communication/send',
    INBOX: '/communication/inbox',
  },

  // Events
  EVENTS: {
    LIST: '/events',
    GET: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },

  // Leaves
  LEAVES: {
    LIST: '/leaves',
    GET: (id: string) => `/leaves/${id}`,
    APPLY: '/leaves',
    APPROVE: (id: string) => `/leaves/${id}/approve`,
    REJECT: (id: string) => `/leaves/${id}/reject`,
  },

  // Payroll
  PAYROLL: {
    LIST: '/payroll',
    GET: (id: string) => `/payroll/${id}`,
    GENERATE: '/payroll/generate',
    SLIP: (id: string) => `/payroll/slip/${id}`,
  },

  // Reports
  REPORTS: {
    STUDENT_REPORT: '/reports/student',
    ATTENDANCE_REPORT: '/reports/attendance',
    FEE_REPORT: '/reports/fees',
    EXAM_REPORT: '/reports/exams',
  },

  // Activity Logs
  ACTIVITY_LOGS: {
    LIST: '/activity-logs',
    MY_ACTIVITY: '/activity-logs/my-activity',
  },
};
