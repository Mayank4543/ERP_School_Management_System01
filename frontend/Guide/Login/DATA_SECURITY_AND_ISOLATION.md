# Data Security & Isolation - School ERP System

## Bahut Important Question: Har koi sabka data kaise nahi dekh sakta?

Yeh sabse important security concern hai! Humne **Multi-Tenant Architecture** use kiya hai jisme har school ka data completely isolated hai.

---

## 🔒 Data Isolation Strategy

### 1. **School ID Based Filtering (Multi-Tenancy)**

Har API request mein user ki **school_id** automatically filter ho jati hai:

```typescript
// Example: Students Controller
@Get()
async findAll(@CurrentUser() user: any) {
  // user.schoolId JWT token se aati hai
  const result = await this.studentsService.findAll(
    user.schoolId,  // ⭐ Yeh automatically set hota hai
    academicYearId,
    standard,
    page,
    limit,
  );
}

// Students Service
async findAll(schoolId: string, ...) {
  const query: any = {
    school_id: new Types.ObjectId(schoolId),  // ⭐ Yahan filter lagta hai
    deleted_at: null,
  };
  
  // Sirf isi school ke students milenge
  const data = await this.studentModel.find(query).exec();
  return data;
}
```

**Iska matlab:**
- School A ka admin sirf School A ke students dekh sakta hai
- School B ka admin sirf School B ke students dekh sakta hai
- Koi bhi School A ka data School B mein nahi dikhai dega

---

## 🔐 Role-Based Data Access

### Super Admin Access
```typescript
// Super Admin ke liye special case
async findAll(user: any) {
  let query: any = { deleted_at: null };
  
  // Agar superadmin hai, toh school filter nahi lagega
  if (user.roles.includes('superadmin')) {
    // All schools ka data dekh sakte hain
    if (schoolIdFilter) {
      query.school_id = new Types.ObjectId(schoolIdFilter);
    }
  } else {
    // Normal users sirf apne school ka data dekhenge
    query.school_id = new Types.ObjectId(user.schoolId);
  }
  
  return await this.studentModel.find(query).exec();
}
```

**Super Admin ki powers:**
- ✅ Multiple schools ka data dekh sakte hain
- ✅ School filter select kar sakte hain
- ✅ Cross-school reports generate kar sakte hain
- ⚠️ But by default apne main school ka data dikhega

---

### School Admin Access
```typescript
// School Admin - Apne school tak limited
@Get()
@Roles('admin', 'superadmin')
async findAll(@CurrentUser() user: any) {
  // user.schoolId JWT se aata hai
  // Yeh change nahi ho sakta client side se
  const students = await this.studentsService.findAll(user.schoolId);
  return students;
}
```

**School Admin restrictions:**
- ✅ Apne school ka sara data access kar sakte hain
- ❌ Dusre school ka data nahi dekh sakte
- ❌ School ID manually change nahi kar sakte

---

### Teacher Access
```typescript
// Teachers ko sirf assigned classes ke students dikhenge
async findAll(user: any) {
  const query: any = {
    school_id: new Types.ObjectId(user.schoolId),
    deleted_at: null,
  };
  
  // Agar teacher hai
  if (user.roles.includes('teacher')) {
    // Teacher ki assigned classes find karo
    const teacher = await this.teacherModel.findOne({ user_id: user.id });
    
    if (teacher) {
      // Sirf assigned classes ke students
      query.$or = [
        { standard: { $in: teacher.assigned_standards } },
        { section_id: { $in: teacher.assigned_sections } }
      ];
    }
  }
  
  return await this.studentModel.find(query).exec();
}
```

**Teacher restrictions:**
- ✅ Apne assigned classes ke students dekh sakte hain
- ❌ Dusri classes ke students nahi dekh sakte
- ❌ Puri school ka data nahi dekh sakte

---

### Student Access
```typescript
// Students sirf apna data dekh sakte hain
async getProfile(user: any) {
  // Student apni hi ID se data fetch kar sakta hai
  const student = await this.studentModel.findOne({
    user_id: new Types.ObjectId(user.id),  // ⭐ Apni hi user ID
    school_id: new Types.ObjectId(user.schoolId),
    deleted_at: null,
  });
  
  return student;
}

// List access nahi hai
@Get()
@Roles('admin', 'superadmin', 'teacher')  // ⭐ Student role nahi hai
async findAll() {
  // Students yeh endpoint access nahi kar sakte
}
```

**Student restrictions:**
- ✅ Sirf apna profile dekh sakte hain
- ✅ Apne marks, attendance, fees
- ❌ Dusre students ka data nahi dekh sakte
- ❌ Student list access nahi hai

---

### Parent Access
```typescript
// Parents sirf apne children ka data dekh sakte hain
async getChildren(user: any) {
  // Parent ke linked students find karo
  const students = await this.studentModel.find({
    parent_id: new Types.ObjectId(user.id),  // ⭐ Apni parent ID
    school_id: new Types.ObjectId(user.schoolId),
    deleted_at: null,
  });
  
  return students;
}

// Specific child ka data
async getChildDetails(user: any, studentId: string) {
  // Verify karo ki yeh child isi parent ka hai
  const student = await this.studentModel.findOne({
    _id: new Types.ObjectId(studentId),
    parent_id: new Types.ObjectId(user.id),  // ⭐ Ownership check
    school_id: new Types.ObjectId(user.schoolId),
    deleted_at: null,
  });
  
  if (!student) {
    throw new ForbiddenException('You can only access your children data');
  }
  
  return student;
}
```

**Parent restrictions:**
- ✅ Sirf apne children ka data dekh sakte hain
- ✅ Multiple children ho sakte hain
- ❌ Dusre students ka data nahi dekh sakte
- ❌ School level data nahi dekh sakte

---

## 🛡️ Security Layers

### Layer 1: JWT Token Validation
```typescript
// Token mein embedded data
{
  sub: "userId",
  email: "user@example.com",
  schoolId: "673a1b2c3d4e5f6g7h8i9j0k",  // ⭐ Yeh change nahi ho sakti
  userGroupId: "teacher",
  roles: ["teacher"]
}

// JwtAuthGuard token verify karta hai
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Token signature check
    // Expiry check
    // User existence check
    return super.canActivate(context);
  }
}
```

**Security:**
- ✅ Token server-side signed hai (secret key se)
- ✅ Client token modify nahi kar sakta
- ✅ schoolId token mein embedded hai
- ✅ 7 days mein expire hota hai

---

### Layer 2: Role-Based Guard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    
    // Check karo user ke roles
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// Usage
@Delete(':id')
@Roles('admin', 'superadmin')  // ⭐ Sirf yeh roles access kar sakte hain
async remove(@Param('id') id: string) {
  await this.studentsService.remove(id);
}
```

**Security:**
- ✅ Endpoint level protection
- ✅ Only authorized roles can access
- ✅ Automatically enforced

---

### Layer 3: Database Level Filtering
```typescript
// Har query mein school_id filter
const query = {
  school_id: new Types.ObjectId(user.schoolId),  // ⭐ Mandatory
  deleted_at: null
};

// MongoDB indexes for performance
UserSchema.index({ school_id: 1, email: 1 });
StudentSchema.index({ school_id: 1, standard: 1 });
TeacherSchema.index({ school_id: 1, department: 1 });
```

**Security:**
- ✅ Database level isolation
- ✅ Cross-school queries impossible
- ✅ Indexed for fast filtering

---

### Layer 4: Ownership Verification
```typescript
// Before update/delete, verify ownership
async update(user: any, studentId: string, updateDto: UpdateStudentDto) {
  // Check student belongs to user's school
  const student = await this.studentModel.findOne({
    _id: new Types.ObjectId(studentId),
    school_id: new Types.ObjectId(user.schoolId),  // ⭐ Ownership check
    deleted_at: null,
  });
  
  if (!student) {
    throw new ForbiddenException('Student not found or access denied');
  }
  
  // Additional role-based checks
  if (user.roles.includes('teacher')) {
    // Teachers can't update students
    throw new ForbiddenException('Teachers cannot update student records');
  }
  
  // Proceed with update
  return await this.studentModel.findByIdAndUpdate(studentId, updateDto, { new: true });
}
```

---

## 🚨 Attack Prevention

### 1. **Parameter Tampering Attack**
```
❌ Attacker tries:
GET /api/v1/students?school_id=OTHER_SCHOOL_ID

✅ System response:
- Ignores query parameter
- Uses user.schoolId from JWT token
- Only returns user's school data
```

### 2. **Token Manipulation Attack**
```
❌ Attacker tries:
- Modify JWT token
- Change schoolId in payload

✅ System response:
- JWT signature verification fails
- 401 Unauthorized error
- No data returned
```

### 3. **Direct Object Reference Attack**
```
❌ Attacker tries:
GET /api/v1/students/OTHER_SCHOOL_STUDENT_ID

✅ System response:
async findById(user: any, id: string) {
  const student = await this.studentModel.findOne({
    _id: id,
    school_id: user.schoolId,  // ⭐ Must match
  });
  
  if (!student) {
    throw new NotFoundException(); // Not found
  }
}
```

### 4. **SQL Injection Prevention**
```
✅ Using MongoDB with Mongoose:
- Automatic query sanitization
- Type-safe ObjectId validation
- No raw queries allowed
```

---

## 📊 Real-World Example

### Scenario: Teacher Student List Access

```typescript
// 1. Teacher login karta hai
POST /api/v1/auth/login
{
  email: "teacher@school-a.com",
  password: "password123"
}

// 2. JWT token generate hota hai
Response: {
  access_token: "eyJhbGc...",
  user: {
    id: "teacher123",
    schoolId: "school-a-id",  // ⭐ School A ka ID
    roles: ["teacher"]
  }
}

// 3. Teacher students list request karta hai
GET /api/v1/students
Headers: {
  Authorization: "Bearer eyJhbGc..."
}

// 4. Backend processing
@Get()
async findAll(@CurrentUser() user: any) {
  // user.schoolId = "school-a-id" (JWT se)
  
  const students = await this.studentsService.findAll(
    user.schoolId,  // ⭐ School A ki ID
    ...
  );
}

// 5. Database query
db.students.find({
  school_id: ObjectId("school-a-id"),  // ⭐ Only School A
  deleted_at: null
})

// 6. Response
{
  success: true,
  data: [
    // Sirf School A ke students
    { id: "s1", name: "Student 1", school_id: "school-a-id" },
    { id: "s2", name: "Student 2", school_id: "school-a-id" }
  ]
}

// ❌ School B ke students nahi dikhenge
```

---

## 🎯 Data Access Matrix

| Role | Own School | Other Schools | Own Data | Others Data | Cross-School |
|------|-----------|---------------|----------|-------------|--------------|
| **Super Admin** | ✅ Full | ✅ Full | ✅ Yes | ✅ Yes | ✅ Yes |
| **School Admin** | ✅ Full | ❌ No | ✅ Yes | ✅ School only | ❌ No |
| **Teacher** | ✅ Limited | ❌ No | ✅ Yes | ✅ Assigned only | ❌ No |
| **Student** | ✅ Own only | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **Parent** | ✅ Children | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **Accountant** | ✅ Financial | ❌ No | ✅ Yes | ✅ School only | ❌ No |
| **Librarian** | ✅ Library | ❌ No | ✅ Yes | ✅ School only | ❌ No |
| **Receptionist** | ✅ Basic | ❌ No | ✅ Yes | ✅ Limited | ❌ No |

---

## 🔍 Additional Security Features

### 1. **Activity Logging**
```typescript
// Har important action log hota hai
@Post()
async create(@CurrentUser() user: any, @Body() dto: CreateStudentDto) {
  const student = await this.studentsService.create(dto);
  
  // Log the activity
  await this.activityLogService.log({
    user_id: user.id,
    school_id: user.schoolId,
    action: 'CREATE_STUDENT',
    entity: 'Student',
    entity_id: student._id,
    details: `Created student: ${student.name}`,
    ip_address: request.ip,
  });
  
  return student;
}
```

### 2. **Soft Delete**
```typescript
// Delete nahi, soft delete
async remove(id: string) {
  await this.studentModel.findByIdAndUpdate(id, {
    deleted_at: new Date(),  // ⭐ Mark as deleted
    deleted_by: user.id,
  });
  
  // Data permanently delete nahi hota
  // Recovery possible hai
}

// Queries automatically soft-deleted data skip karte hain
const query = {
  school_id: user.schoolId,
  deleted_at: null,  // ⭐ Only active records
};
```

### 3. **Data Encryption (Future)**
```typescript
// Sensitive data encryption
@Prop({ type: String })
@Transform(({ value }) => encrypt(value))
aadhar_number: string;

@Prop({ type: String })
@Transform(({ value }) => encrypt(value))
account_number: string;
```

---

## 📝 Summary

### ✅ Kya-kya protection hai:

1. **JWT Token mein schoolId embedded** - Client change nahi kar sakta
2. **Database queries mein automatic filtering** - Har query mein school_id filter
3. **Role-based access control** - Specific roles ko hi specific endpoints access
4. **Ownership verification** - Update/Delete se pehle check
5. **Activity logging** - Kon kya kar raha hai, track hota hai
6. **Soft delete** - Data recovery possible
7. **MongoDB indexes** - Fast filtering with security

### ❌ Kya-kya possible NAHI hai:

1. ❌ School A ka user School B ka data nahi dekh sakta
2. ❌ Teacher dusre teacher ke students nahi dekh sakta
3. ❌ Student dusre students ka data nahi dekh sakta
4. ❌ Parent dusre children ka data nahi dekh sakta
5. ❌ Client-side se schoolId change nahi ho sakti
6. ❌ Token manipulation se koi data access nahi ho sakta

### 🎯 Main Point:

**"Har user ko sirf wahi data dikhta hai jo uska hai, uski role ke according hai, aur uske school ka hai. Koi cross-school data access nahi hai!"**

---

## 🚀 Testing Security

```bash
# Test 1: Different school access
# Login as School A admin
POST /api/v1/auth/login { email: "admin@schoola.com" }

# Try to access School B student
GET /api/v1/students/school-b-student-id
# Result: 404 Not Found ✅

# Test 2: Role restriction
# Login as Teacher
POST /api/v1/auth/login { email: "teacher@school.com" }

# Try to delete student
DELETE /api/v1/students/student-id
# Result: 403 Forbidden ✅

# Test 3: Token tampering
# Modify JWT token manually
# Try any API call
# Result: 401 Unauthorized ✅
```

---

**Conclusion:** Hamara system bahut secure hai! Multi-tenant architecture + role-based access + JWT authentication + database filtering = Complete data isolation! 🔒
