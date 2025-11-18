# 🔧 Backend Integration Status & Guide

**Last Updated:** November 18, 2025  
**Project:** School ERP Management System

---

## ✅ Completed Backend Work

### **1. Students Module** ✅
**Location:** `src/modules/students/`

**Controller Endpoints:**
- ✅ `POST /students` - Create new student (Admin only)
- ✅ `GET /students` - Get all students (with pagination, filters)
  - Query params: `academic_year_id`, `standard`, `page`, `limit`
- ✅ `GET /students/:id` - Get student by ID
- ✅ `GET /students/admission/:admissionNo` - Get student by admission number
- ✅ `GET /students/user/:userId` - **Get student by user ID** (for dashboard)
- ✅ `PATCH /students/:id` - Update student (Admin only)
- ✅ `DELETE /students/:id` - Soft delete student (Admin only)
- ✅ `GET /students/class/:standard/:sectionId` - Get students by class

**Service Methods:**
- ✅ `create()` - Create student with validation
- ✅ `findAll()` - List students with pagination and filters
- ✅ `findById()` - Find by student ID
- ✅ `findByAdmissionNo()` - Find by admission number
- ✅ `findByUserId()` - Find student by user_id (used in dashboard)
- ✅ `update()` - Update student details
- ✅ `remove()` - Soft delete student
- ✅ `getStudentsByClass()` - Get all students in a class/section

**Key Features:**
- Pagination support (page, limit)
- Soft delete (deleted_at field)
- Role-based access control (JwtAuthGuard, RolesGuard)
- MongoDB ObjectId validation
- Swagger API documentation

**Database Schema:**
```typescript
{
  _id: ObjectId,
  user_id: ObjectId,           // Links to users collection
  school_id: ObjectId,
  academic_year_id: ObjectId,
  admission_no: string,
  roll_no: number,
  standard: number,            // Class/Grade
  section_id: ObjectId,
  first_name: string,
  last_name: string,
  date_of_birth: Date,
  gender: string,
  blood_group: string,
  address: string,
  city: string,
  state: string,
  pincode: string,
  parent_name: string,
  parent_phone: string,
  parent_email: string,
  emergency_contact: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}
```

---

### **2. Attendance Module** ✅
**Location:** `src/modules/attendance/`

**Controller Endpoints:**
- ✅ `POST /attendance/mark` - Mark attendance for students
- ✅ `GET /attendance/date/:date` - Get attendance by date
  - Query params: `user_type`, `standard`, `section_id`
- ✅ `GET /attendance/user/:userId` - **Get user attendance by date range**
  - Query params: `start_date`, `end_date`
  - **Used in Student Dashboard**
- ✅ `GET /attendance/summary` - Get attendance summary
  - Query params: `academic_year_id`, `user_type`, `user_id`
- ✅ `GET /attendance/monthly` - Get monthly attendance report
  - Query params: `academic_year_id`, `month`, `year`, `standard`, `section_id`

**Service Methods:**
- ✅ `markAttendance()` - Mark single/bulk attendance
- ✅ `getAttendanceByDate()` - Get attendance for specific date
- ✅ `getUserAttendance()` - Get user's attendance history (dashboard use)
- ✅ `getAttendanceSummary()` - Calculate attendance statistics
- ✅ `getMonthlyAttendance()` - Monthly attendance report

**Key Features:**
- Bulk attendance marking
- Date range queries
- User type filtering (student/teacher)
- Monthly reports
- Attendance percentage calculation

**Database Schema:**
```typescript
{
  _id: ObjectId,
  school_id: ObjectId,
  academic_year_id: ObjectId,
  user_id: ObjectId,
  user_type: 'student' | 'teacher',
  date: Date,
  status: 'present' | 'absent' | 'late' | 'half_day',
  marked_by: ObjectId,
  remarks: string,
  created_at: Date
}
```

---

### **3. Exams Module** ✅
**Location:** `src/modules/exams/`

**Controller Endpoints:**
- ✅ `POST /exams` - Create new exam
- ✅ `GET /exams` - Get all exams
  - Query params: `academic_year_id`
  - **Used in Student Dashboard for upcoming exams**
- ✅ `GET /exams/:id` - Get single exam details
- ✅ `POST /exams/marks` - Enter/update student marks
- ✅ `GET /exams/student/:studentId/exam/:examId` - Get student marks for specific exam
  - **Used in Student Dashboard for grades**
- ✅ `GET /exams/:id/results` - Get exam results with rankings

**Service Methods:**
- ✅ `createExam()` - Create exam schedule
- ✅ `findAllExams()` - List exams with filters
- ✅ `findExamById()` - Get exam details
- ✅ `enterMarks()` - Record student marks
- ✅ `getStudentMarks()` - Get student's exam results
- ✅ `getExamResults()` - Get all results for an exam

**Key Features:**
- Exam scheduling
- Marks entry and updates
- Grade calculation
- Result publishing
- Academic year filtering

**Database Schema:**
```typescript
// Exams Collection
{
  _id: ObjectId,
  school_id: ObjectId,
  academic_year_id: ObjectId,
  name: string,
  exam_type: 'unit_test' | 'mid_term' | 'final' | 'practical',
  subject_id: ObjectId,
  subject_name: string,
  standard: number,
  section_id: ObjectId,
  start_date: Date,
  end_date: Date,
  total_marks: number,
  passing_marks: number,
  syllabus: string,
  created_at: Date
}

// Marks Collection
{
  _id: ObjectId,
  exam_id: ObjectId,
  student_id: ObjectId,
  obtained_marks: number,
  total_marks: number,
  grade: string,
  remarks: string,
  entered_by: ObjectId,
  created_at: Date
}
```

---

### **4. Academic Module** ✅
**Location:** `src/modules/academic/`

**Controller Endpoints:**
- ✅ `GET /academic-years` - Get all academic years
- ✅ `GET /academic-years/current` - **Get current academic year**
  - **Used in Student Dashboard** to get current year ID

**Service Methods:**
- ✅ `findAll()` - List all academic years
- ✅ `findCurrent()` - Get active academic year

**Key Features:**
- Academic year management
- Current year detection
- School-specific filtering

**Database Schema:**
```typescript
{
  _id: ObjectId,
  school_id: ObjectId,
  name: string,              // e.g., "2024-2025"
  start_date: Date,
  end_date: Date,
  is_current: boolean,
  created_at: Date
}
```

---

### **5. Authentication Module** ✅
**Location:** `src/modules/auth/`

**Controller Endpoints:**
- ✅ `POST /auth/login` - User login (returns JWT token)
- ✅ `POST /auth/register` - User registration
- ✅ `GET /auth/profile` - Get current user profile
- ✅ `POST /auth/logout` - User logout

**Service Methods:**
- ✅ `login()` - Authenticate user and generate JWT
- ✅ `register()` - Create new user account
- ✅ `validateUser()` - Validate credentials
- ✅ `getProfile()` - Get user details

**Key Features:**
- JWT authentication
- Password hashing (bcrypt)
- Role-based authorization
- Token expiration

---

### **6. Users Module** ✅
**Location:** `src/modules/users/`

**Controller Endpoints:**
- ✅ `GET /users` - Get all users
- ✅ `GET /users/:id` - Get user by ID
- ✅ `PATCH /users/:id` - Update user
- ✅ `DELETE /users/:id` - Delete user

**Service Methods:**
- ✅ `findAll()` - List users
- ✅ `findById()` - Find user
- ✅ `findByEmail()` - Find by email
- ✅ `update()` - Update user
- ✅ `remove()` - Delete user

---

### **7. Activity Log Module** ✅
**Location:** `src/modules/activity-log/`

**Controller Endpoints:**
- ✅ `GET /activity-log` - Get all activity logs
- ✅ `GET /activity-log/user/:userId` - Get user's activity logs

**Service Methods:**
- ✅ `log()` - Create activity log entry
- ✅ `getUserActivities()` - Get user activities

**Key Features:**
- Automatic activity logging via interceptor
- User action tracking
- Timestamp recording

---

### **8. Teachers Module** ✅
**Location:** `src/modules/teachers/`

**Controller Endpoints:**
- ✅ `POST /teachers` - Create teacher
- ✅ `GET /teachers` - Get all teachers
- ✅ `GET /teachers/:id` - Get teacher by ID
- ✅ `PATCH /teachers/:id` - Update teacher
- ✅ `DELETE /teachers/:id` - Delete teacher

---

### **9. Schools Module** ✅
**Location:** `src/modules/schools/`

**Controller Endpoints:**
- ✅ `POST /schools` - Create school
- ✅ `GET /schools` - Get all schools
- ✅ `GET /schools/:id` - Get school by ID
- ✅ `PATCH /schools/:id` - Update school

---

## 🔧 Backend Changes Made for Dashboard Integration

### **1. Fixed Route Ordering in Students Controller**
**Issue:** Route `@Get(':id')` was matching before `@Get('user/:userId')`

**Solution:** Moved specific routes before generic `:id` route
```typescript
// CORRECT ORDER:
@Get('admission/:admissionNo')  // Specific route first
@Get('user/:userId')            // Specific route first
@Get(':id')                     // Generic route last
```

**Impact:** Dashboard can now fetch student by user_id

---

### **2. Added findByUserId() Method**
**File:** `src/modules/students/students.service.ts`

```typescript
async findByUserId(userId: string): Promise<Student> {
  const student = await this.studentModel
    .findOne({ user_id: new Types.ObjectId(userId), deleted_at: null })
    .exec();

  if (!student) {
    throw new NotFoundException(`Student with user ID ${userId} not found`);
  }

  return student;
}
```

**Purpose:** Links user account to student record for dashboard

---

### **3. Academic Year ID Handling**
**Issue:** Frontend was sending `'current'` as academic_year_id (string instead of ObjectId)

**Solution:** Frontend now fetches actual ObjectId from `/academic-years/current` before making exam queries

**Flow:**
1. GET `/academic-years/current` → returns `{ _id: "673abc..." }`
2. Use that `_id` for GET `/exams?academic_year_id=673abc...`
3. MongoDB accepts valid ObjectId

---

## ❌ Pending Backend Work

### **1. Timetable Module** ❌
**Location:** `src/modules/timetable/` (folder exists, but no controller/service)

**Required Endpoints:**
```typescript
POST   /timetable                        - Create timetable
GET    /timetable/student/:studentId     - Get student's timetable ⭐ HIGH PRIORITY
GET    /timetable/teacher/:teacherId     - Get teacher's timetable
GET    /timetable/class/:classId         - Get class timetable
PATCH  /timetable/:id                    - Update timetable
DELETE /timetable/:id                    - Delete timetable
```

**Required Database Schema:**
```typescript
{
  _id: ObjectId,
  school_id: ObjectId,
  academic_year_id: ObjectId,
  class_id: ObjectId,
  section_id: ObjectId,
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
  periods: [
    {
      period_number: number,
      subject_id: ObjectId,
      subject_name: string,
      teacher_id: ObjectId,
      teacher_name: string,
      start_time: string,  // "09:00"
      end_time: string,    // "10:00"
      room_no: string,
      is_break: boolean
    }
  ],
  created_at: Date
}
```

**Why Needed:** Student dashboard shows "Today's Class Schedule" (currently using mock data)

---

### **2. Assignments Module** ❌
**Location:** `src/modules/assignments/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /assignments                          - Create assignment
GET    /assignments                          - Get all assignments
GET    /assignments/student/:studentId       - Get student's assignments ⭐ HIGH PRIORITY
GET    /assignments/:id                      - Get assignment details
POST   /assignments/:id/submit               - Submit assignment
PATCH  /assignments/:id                      - Update assignment
DELETE /assignments/:id                      - Delete assignment
GET    /assignments/:id/submissions          - Get all submissions
POST   /assignments/:id/grade                - Grade submission
```

**Required Database Schemas:**
```typescript
// Assignments Collection
{
  _id: ObjectId,
  school_id: ObjectId,
  academic_year_id: ObjectId,
  subject_id: ObjectId,
  class_id: ObjectId,
  section_id: ObjectId,
  teacher_id: ObjectId,
  title: string,
  description: string,
  instructions: string,
  assigned_date: Date,
  due_date: Date,
  max_marks: number,
  attachment_url: string,
  status: 'active' | 'closed',
  created_at: Date
}

// Submissions Collection
{
  _id: ObjectId,
  assignment_id: ObjectId,
  student_id: ObjectId,
  submission_date: Date,
  file_url: string,
  text_content: string,
  remarks: string,
  marks_obtained: number,
  grade: string,
  graded_by: ObjectId,
  graded_at: Date,
  status: 'pending' | 'submitted' | 'graded' | 'late',
  created_at: Date
}
```

**Why Needed:** Student dashboard shows "Pending Assignments" (currently using mock data)

---

### **3. Homework Module** ❌
**Location:** `src/modules/homework/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /homework                          - Create homework
GET    /homework                          - Get all homework
GET    /homework/student/:studentId       - Get student's homework ⭐
GET    /homework/:id                      - Get homework details
POST   /homework/:id/submit               - Mark as complete
DELETE /homework/:id                      - Delete homework
```

**Required Database Schema:**
```typescript
{
  _id: ObjectId,
  school_id: ObjectId,
  academic_year_id: ObjectId,
  subject_id: ObjectId,
  class_id: ObjectId,
  teacher_id: ObjectId,
  title: string,
  description: string,
  assigned_date: Date,
  due_date: Date,
  completed: boolean,
  completed_date: Date,
  created_at: Date
}
```

**Why Needed:** Can be displayed in student dashboard activities

---

### **4. Fees Module** ❌
**Location:** `src/modules/fees/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /fees/create-structure              - Create fee structure
GET    /fees/student/:studentId            - Get student fees ⭐ HIGH PRIORITY
POST   /fees/payment                       - Record payment
GET    /fees/payments/:studentId           - Get payment history
GET    /fees/defaulters                    - Get fee defaulters
GET    /fees/receipts/:paymentId           - Get receipt
```

**Required Database Schemas:**
```typescript
// Fee Structure
{
  _id: ObjectId,
  school_id: ObjectId,
  academic_year_id: ObjectId,
  standard: number,
  fee_type: string,           // "Tuition", "Transport", "Library"
  amount: number,
  due_date: Date,
  created_at: Date
}

// Student Fees
{
  _id: ObjectId,
  student_id: ObjectId,
  academic_year_id: ObjectId,
  total_fees: number,
  paid_fees: number,
  pending_fees: number,
  fee_items: [
    {
      fee_type: string,
      amount: number,
      status: 'paid' | 'pending' | 'overdue'
    }
  ]
}

// Payments
{
  _id: ObjectId,
  student_id: ObjectId,
  receipt_no: string,
  amount: number,
  payment_date: Date,
  payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer',
  fee_type: string,
  created_by: ObjectId,
  created_at: Date
}
```

**Why Needed:** Student dashboard shows "Pending Fees" stat (currently returns 0 from fallback)

---

### **5. Library Module** ❌
**Location:** `src/modules/library/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /library/books                      - Add new book
GET    /library/books                      - Get all books
GET    /library/books/:id                  - Get book details
POST   /library/issue                      - Issue book
POST   /library/return                     - Return book
GET    /library/student/:studentId/issued  - Get student's issued books ⭐
GET    /library/overdue                    - Get overdue books
```

**Required Database Schemas:**
```typescript
// Books
{
  _id: ObjectId,
  school_id: ObjectId,
  book_no: string,
  title: string,
  author: string,
  isbn: string,
  category: string,
  total_copies: number,
  available_copies: number,
  created_at: Date
}

// Book Issues
{
  _id: ObjectId,
  student_id: ObjectId,
  book_id: ObjectId,
  issue_date: Date,
  due_date: Date,
  return_date: Date,
  fine_amount: number,
  status: 'issued' | 'returned' | 'overdue',
  created_at: Date
}
```

---

### **6. Leaves Module** ❌
**Location:** `src/modules/leaves/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /leaves/apply                      - Apply for leave
GET    /leaves/student/:studentId         - Get student's leaves ⭐
GET    /leaves/:id                        - Get leave details
PATCH  /leaves/:id/approve                - Approve leave
PATCH  /leaves/:id/reject                 - Reject leave
```

**Required Database Schema:**
```typescript
{
  _id: ObjectId,
  user_id: ObjectId,
  user_type: 'student' | 'teacher',
  leave_type: 'sick' | 'casual' | 'emergency',
  start_date: Date,
  end_date: Date,
  reason: string,
  status: 'pending' | 'approved' | 'rejected',
  approved_by: ObjectId,
  approved_at: Date,
  created_at: Date
}
```

---

### **7. Transport Module** ❌
**Location:** `src/modules/transport/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /transport/routes                  - Create route
GET    /transport/routes                  - Get all routes
GET    /transport/student/:studentId      - Get student transport details ⭐
POST   /transport/assign                  - Assign student to route
```

---

### **8. Communication Module** ❌
**Location:** `src/modules/communication/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /communication/send                - Send message/notification
GET    /communication/student/:studentId  - Get student messages ⭐
POST   /communication/broadcast           - Broadcast message
```

---

### **9. Events Module** ❌
**Location:** `src/modules/events/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /events                           - Create event
GET    /events                           - Get all events
GET    /events/upcoming                  - Get upcoming events ⭐
GET    /events/:id                       - Get event details
```

---

### **10. Lesson Plans Module** ❌
**Location:** `src/modules/lesson-plans/` (folder exists, schemas only)

**Required Endpoints:**
```typescript
POST   /lesson-plans                     - Create lesson plan
GET    /lesson-plans/teacher/:teacherId  - Get teacher's plans
GET    /lesson-plans/class/:classId      - Get class plans
```

---

### **11. Notifications Module** ❌
**Location:** `src/modules/notifications/` (folder exists)

**Required Endpoints:**
```typescript
GET    /notifications/user/:userId       - Get user notifications ⭐
PATCH  /notifications/:id/read           - Mark as read
POST   /notifications/send               - Send notification
```

---

### **12. Reports Module** ❌
**Location:** `src/modules/reports/` (folder exists)

**Required Endpoints:**
```typescript
GET    /reports/student/:studentId/progress    - Progress report
GET    /reports/attendance                     - Attendance report
GET    /reports/fees                           - Fee collection report
GET    /reports/exams                          - Exam results report
```

---

## 🎯 Priority Implementation Order

### **Phase 1: Critical for Student Dashboard** (Next 1-2 weeks)
1. **Timetable Module** - Today's schedule (HIGH PRIORITY)
2. **Fees Module** - Pending fees display (HIGH PRIORITY)
3. **Assignments Module** - Pending assignments (HIGH PRIORITY)
4. **Homework Module** - Daily homework tracking (MEDIUM)

### **Phase 2: Enhanced Student Features** (Week 3-4)
5. **Library Module** - Book tracking
6. **Leaves Module** - Leave application
7. **Communication Module** - Messages/notifications
8. **Notifications Module** - Real-time alerts

### **Phase 3: Additional Features** (Week 5-6)
9. **Transport Module** - Bus tracking
10. **Events Module** - School events calendar
11. **Reports Module** - Downloadable reports

### **Phase 4: Teacher & Admin Features** (Week 7-8)
12. **Lesson Plans Module** - Teacher planning
13. Complete other dashboard integrations

---

## 📋 Implementation Checklist

For each pending module, follow this checklist:

### **Step 1: Create Module Structure**
```bash
nest g module <module-name>
nest g controller <module-name>
nest g service <module-name>
```

### **Step 2: Define DTOs**
```typescript
// dto/create-<entity>.dto.ts
// dto/update-<entity>.dto.ts
```

### **Step 3: Define Schema**
```typescript
// schemas/<entity>.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
```

### **Step 4: Implement Service**
```typescript
// <module-name>.service.ts
@Injectable()
export class XService {
  constructor(@InjectModel(X.name) private xModel: Model<XDocument>) {}
}
```

### **Step 5: Implement Controller**
```typescript
// <module-name>.controller.ts
@Controller('<module-name>')
@UseGuards(JwtAuthGuard, RolesGuard)
export class XController {}
```

### **Step 6: Add to App Module**
```typescript
// app.module.ts
import { XModule } from './modules/x/x.module';

@Module({
  imports: [XModule, ...],
})
```

### **Step 7: Test Endpoints**
- Use Postman/Thunder Client
- Test with valid JWT token
- Verify response format

### **Step 8: Update Frontend**
- Create service in `frontend/lib/api/services/`
- Update dashboard component
- Remove mock data

---

## 🔐 Security & Best Practices

### **All Endpoints Must Have:**
1. ✅ JWT Authentication (`@UseGuards(JwtAuthGuard)`)
2. ✅ Role-based authorization where needed (`@Roles('admin', 'teacher')`)
3. ✅ Input validation (class-validator decorators)
4. ✅ Error handling (try-catch blocks)
5. ✅ Swagger documentation (`@ApiTags`, `@ApiOperation`)

### **Database Best Practices:**
1. ✅ Always use soft delete (deleted_at field)
2. ✅ Index frequently queried fields
3. ✅ Use ObjectId for relationships
4. ✅ Validate ObjectId format before queries
5. ✅ Add timestamps (created_at, updated_at)

### **API Response Format:**
```typescript
// Success
{
  success: true,
  data: {...},
  message: "Operation successful"
}

// Error
{
  success: false,
  error: "Error message",
  statusCode: 400
}
```

---

## 🚀 Quick Start Commands

### **Start Backend Dev Server:**
```bash
cd backend
npm run start:dev
```

### **Generate New Module:**
```bash
nest g module modules/timetable
nest g controller modules/timetable
nest g service modules/timetable
```

### **Run Tests:**
```bash
npm run test
npm run test:e2e
```

### **Build for Production:**
```bash
npm run build
```

---

## 📊 Current Backend Status Summary

| Module | Status | Controller | Service | Schema | Priority |
|--------|--------|------------|---------|--------|----------|
| Students | ✅ Complete | ✅ | ✅ | ✅ | - |
| Attendance | ✅ Complete | ✅ | ✅ | ✅ | - |
| Exams | ✅ Complete | ✅ | ✅ | ✅ | - |
| Academic | ✅ Complete | ✅ | ✅ | ✅ | - |
| Auth | ✅ Complete | ✅ | ✅ | ✅ | - |
| Users | ✅ Complete | ✅ | ✅ | ✅ | - |
| Teachers | ✅ Complete | ✅ | ✅ | ✅ | - |
| Schools | ✅ Complete | ✅ | ✅ | ✅ | - |
| Activity Log | ✅ Complete | ✅ | ✅ | ✅ | - |
| **Timetable** | ❌ Pending | ❌ | ❌ | ✅ | 🔴 HIGH |
| **Fees** | ❌ Pending | ❌ | ❌ | ✅ | 🔴 HIGH |
| **Assignments** | ❌ Pending | ❌ | ❌ | ✅ | 🔴 HIGH |
| **Homework** | ❌ Pending | ❌ | ❌ | ✅ | 🟡 MEDIUM |
| **Library** | ❌ Pending | ❌ | ❌ | ✅ | 🟡 MEDIUM |
| **Leaves** | ❌ Pending | ❌ | ❌ | ✅ | 🟡 MEDIUM |
| **Transport** | ❌ Pending | ❌ | ❌ | ✅ | 🟢 LOW |
| **Communication** | ❌ Pending | ❌ | ❌ | ✅ | 🟡 MEDIUM |
| **Events** | ❌ Pending | ❌ | ❌ | ✅ | 🟢 LOW |
| **Lesson Plans** | ❌ Pending | ❌ | ❌ | ✅ | 🟢 LOW |
| **Notifications** | ❌ Pending | ❌ | ❌ | ✅ | 🟡 MEDIUM |
| **Reports** | ❌ Pending | ❌ | ❌ | ❌ | 🟢 LOW |

**Progress:** 9/21 modules complete (43%)

---

## 📝 Notes

1. **Route Ordering:** Always place specific routes (with literal path segments) before generic routes with parameters
2. **ObjectId Validation:** Use `new Types.ObjectId(id)` for MongoDB queries
3. **Soft Delete:** Always check `deleted_at: null` in queries
4. **Pagination:** Default page size is 20, always include pagination metadata
5. **Authentication:** All endpoints require JWT token except `/auth/login` and `/auth/register`

---

**Last Updated:** November 18, 2025  
**Version:** 1.0  
**Maintainer:** Development Team
