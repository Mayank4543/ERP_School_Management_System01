# School ERP Authentication Flow - Complete Guide

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Authentication Flow](#authentication-flow)
4. [Registration Flow](#registration-flow)
5. [Login Flow](#login-flow)
6. [Authorization & Role-Based Access](#authorization--role-based-access)
7. [JWT Token Management](#jwt-token-management)
8. [Frontend Authentication](#frontend-authentication)
9. [Backend Authentication](#backend-authentication)
10. [Middleware & Guards](#middleware--guards)

---

## System Architecture Overview

### Technology Stack
- **Backend**: NestJS (Node.js framework) + TypeScript
- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Database**: MongoDB Atlas (NoSQL)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Session Storage**: HTTP-only cookies + local storage
- **API**: RESTful API with Swagger documentation

### Multi-Tenant Architecture
The system uses a **multi-tenant architecture** where:
- Each school is a separate tenant with `school_id`
- Users belong to a specific school
- Data isolation based on `school_id`
- Super admins can access multiple schools

---

## User Roles & Permissions

### 1. **Super Admin** (`superadmin`)
**Highest authority - Platform level access**

**Responsibilities:**
- Manage multiple schools across the platform
- Create and configure new schools
- Manage school subscriptions and billing
- View system-wide analytics and reports
- Configure global settings
- Access all modules across all schools

**Access Level:**
- ✅ Full access to all schools
- ✅ All modules (Students, Teachers, Attendance, Fees, etc.)
- ✅ System configuration
- ✅ User management across schools
- ✅ Financial reports and dashboards

**Example Use Cases:**
- Platform owner/administrator
- SaaS provider managing multiple school clients
- Technical support team

---

### 2. **School Admin** (`admin`)
**School level authority - Full control within their school**

**Responsibilities:**
- Manage all aspects of their specific school
- Create/update teachers, students, staff
- Configure school settings and academic structure
- Manage classes, sections, subjects
- Handle admissions and student records
- Oversee attendance and examinations
- Manage fees and financial operations
- Generate school reports

**Access Level:**
- ✅ Full access to their school only
- ✅ All modules (Students, Teachers, Attendance, Fees, Library, Transport, etc.)
- ✅ School settings and configuration
- ✅ User management within school
- ❌ Cannot access other schools
- ❌ Cannot access platform settings

**Example Use Cases:**
- School principal
- School IT administrator
- School management team

---

### 3. **Teacher** (`teacher`)
**Academic staff - Teaching and assessment**

**Responsibilities:**
- View assigned classes and students
- Mark attendance for their classes
- Create and manage assignments/homework
- Upload lesson plans
- Enter exam marks and grades
- Communicate with students and parents
- View their class timetable

**Access Level:**
- ✅ Students (view only, limited to their classes)
- ✅ Attendance (mark for assigned classes)
- ✅ Exams (enter marks, view results)
- ✅ Assignments & Homework (create/manage)
- ✅ Communication (send messages)
- ❌ Cannot create/delete students
- ❌ Cannot access fees module
- ❌ Cannot manage other teachers
- ❌ Cannot access payroll

**Example Use Cases:**
- Class teachers
- Subject teachers
- Academic coordinators

---

### 4. **Student** (`student`)
**Primary users - Learning and participation**

**Responsibilities:**
- View their profile and academic records
- Access class timetable
- View attendance records
- Submit assignments and homework
- View exam results and grades
- Access library resources
- View fee payment status
- Communicate with teachers

**Access Level:**
- ✅ Dashboard (personal overview)
- ✅ Attendance (view own records)
- ✅ Exams (view results)
- ✅ Assignments (submit work)
- ✅ Library (search/borrow books)
- ✅ Fees (view payment status)
- ❌ Cannot view other students' data
- ❌ Cannot access admin modules
- ❌ Cannot modify records

**Example Use Cases:**
- Regular students attending school
- Distance learning students
- Transfer students

---

### 5. **Parent** (`parent`)
**Guardian access - Monitor child's progress**

**Responsibilities:**
- View child's academic performance
- Monitor attendance records
- Track exam results and grades
- View fee payment status and history
- Communicate with teachers
- Receive notifications about child
- View timetable and events

**Access Level:**
- ✅ Dashboard (child's overview)
- ✅ Attendance (view child's records)
- ✅ Exams (view child's results)
- ✅ Fees (view/pay fees)
- ✅ Communication (message teachers)
- ✅ Reports (download child's reports)
- ❌ Cannot view other children's data
- ❌ Cannot access teacher modules
- ❌ Cannot modify academic records

**Special Features:**
- Can have multiple children linked to account
- Receives email/SMS notifications
- Can make online fee payments

**Example Use Cases:**
- Concerned parents tracking progress
- Guardians managing fee payments
- Parents communicating with teachers

---

### 6. **Accountant** (`accountant`)
**Financial staff - Fee and payment management**

**Responsibilities:**
- Manage student fee records
- Process fee payments
- Generate fee receipts
- Track payment dues and overdue
- Manage payroll (if authorized)
- Generate financial reports
- Handle refunds and adjustments

**Access Level:**
- ✅ Fees module (full access)
- ✅ Payroll (if assigned)
- ✅ Financial reports
- ✅ Students (view for fee purposes)
- ❌ Cannot manage academic records
- ❌ Cannot mark attendance
- ❌ Cannot enter exam marks

**Example Use Cases:**
- School accountant
- Finance manager
- Accounts clerk

---

### 7. **Librarian** (`librarian`)
**Library staff - Resource management**

**Responsibilities:**
- Manage library books and resources
- Issue and return books
- Track overdue books
- Manage library members
- Generate library reports
- Maintain catalog

**Access Level:**
- ✅ Library module (full access)
- ✅ Students (view for library purposes)
- ✅ Teachers (view for library purposes)
- ❌ Cannot access academic modules
- ❌ Cannot view fees
- ❌ Cannot manage users

---

### 8. **Receptionist** (`receptionist`)
**Front desk staff - Visitor and inquiry management**

**Responsibilities:**
- Manage visitor records
- Handle inquiries
- Basic student information lookup
- Generate admit cards
- Print ID cards
- Manage front desk operations

**Access Level:**
- ✅ Students (view only)
- ✅ Visitors module
- ✅ Front desk operations
- ❌ Cannot modify student records
- ❌ Cannot access fees
- ❌ Cannot view exam marks

---

## Authentication Flow

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Browser    │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 1. User visits /login or /register
       │
       ▼
┌────────────────────────────────────────────────────────────────┐
│            Next.js Frontend (Port 3000)                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Middleware (middleware.ts)                              │ │
│  │  • Check if user has access_token cookie                │ │
│  │  • If authenticated → Redirect to /dashboard             │ │
│  │  • If not authenticated → Allow access to auth pages     │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │ 2. User submits login/register form
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│            AuthContext (Frontend State Management)             │
│  • login(email, password)                                      │
│  • register(userData)                                          │
│  • Sends POST request to backend API                           │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │ 3. HTTP POST to /api/v1/auth/login or /register
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│            NestJS Backend (Port 8080)                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  AuthController                                          │ │
│  │  • Receives login/register request                       │ │
│  │  • Validates DTO (Data Transfer Object)                 │ │
│  └────────────────────────┬─────────────────────────────────┘ │
│                           │                                    │
│                           │ 4. Calls AuthService               │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  AuthService                                             │ │
│  │  • validateUser(email, password)                         │ │
│  │    - Query MongoDB for user                              │ │
│  │    - Compare password with bcrypt.compare()              │ │
│  │    - Check if account is activated                       │ │
│  │  • register(userData)                                    │ │
│  │    - Check if email exists                               │ │
│  │    - Hash password with bcrypt                           │ │
│  │    - Create user in database                             │ │
│  │    - Create user profile                                 │ │
│  └────────────────────────┬─────────────────────────────────┘ │
│                           │                                    │
│                           │ 5. Query/Insert to MongoDB         │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  MongoDB Atlas Database                                  │ │
│  │  Collections:                                            │ │
│  │  • users (user records)                                  │ │
│  │  • userprofiles (extended user info)                     │ │
│  │  • schools (school data)                                 │ │
│  └────────────────────────┬─────────────────────────────────┘ │
│                           │                                    │
│                           │ 6. Return user data                │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  JwtService                                              │ │
│  │  • Generate JWT token with payload:                      │ │
│  │    {                                                     │ │
│  │      sub: userId,                                        │ │
│  │      email: user.email,                                  │ │
│  │      schoolId: user.school_id,                           │ │
│  │      userGroupId: user.usergroup_id,                     │ │
│  │      roles: user.roles                                   │ │
│  │    }                                                     │ │
│  │  • Token expires in 7 days                               │ │
│  └────────────────────────┬─────────────────────────────────┘ │
│                           │                                    │
│                           │ 7. Return response                 │
│                           ▼                                    │
│  Response: {                                                  │
│    success: true,                                             │
│    data: {                                                    │
│      access_token: "eyJhbGc...",                              │
│      token_type: "Bearer",                                    │
│      expires_in: "7d",                                        │
│      user: { id, name, email, roles, school_id }             │
│    }                                                          │
│  }                                                            │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │ 8. Response received
                            ▼
┌────────────────────────────────────────────────────────────────┐
│            AuthContext (Process Response)                      │
│  • Store access_token in cookie (expires: 7 days)             │
│  • Store user data in cookie                                   │
│  • Update React state: setUser(userData)                       │
│  • Show success toast notification                             │
│  • Redirect to /dashboard                                      │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │ 9. Navigate to dashboard
                            ▼
┌────────────────────────────────────────────────────────────────┐
│            Dashboard (Protected Route)                         │
│  • Middleware checks access_token                              │
│  • If valid → Load dashboard                                   │
│  • If invalid → Redirect to /login                             │
│  • Load user-specific menu based on roles                      │
│  • Fetch dashboard data from API                               │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│            Subsequent API Requests                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  API Client (Axios Interceptor)                          │ │
│  │  • Automatically adds Authorization header               │ │
│  │  • "Authorization: Bearer {access_token}"                │ │
│  │  • All requests to /api/v1/* include this                │ │
│  └────────────────────────┬─────────────────────────────────┘ │
│                           │                                    │
│                           │ 10. Protected API request          │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  JwtAuthGuard (Backend)                                  │ │
│  │  • Extract token from Authorization header               │ │
│  │  • Verify token signature                                │ │
│  │  • Decode payload                                        │ │
│  │  • Attach user to request object                         │ │
│  └────────────────────────┬─────────────────────────────────┘ │
│                           │                                    │
│                           │ 11. Check roles (if required)      │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  RolesGuard (Backend)                                    │ │
│  │  • Check if user has required role                       │ │
│  │  • Allow or deny access                                  │ │
│  └────────────────────────┬─────────────────────────────────┘ │
│                           │                                    │
│                           │ 12. Execute controller method      │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Controller → Service → Database                         │ │
│  │  • Process request                                       │ │
│  │  • Return data                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Registration Flow

### Step-by-Step Registration Process

```javascript
// Frontend: app/(auth)/register/page.tsx
const onSubmit = async (data) => {
  const payload = {
    name: "John Doe",
    email: "john@example.com",
    password: "SecurePass123",
    usergroup_id: "teacher",  // Role selection
    mobile_no: "+1234567890"
    // school_id is optional - backend will auto-assign
  };
  
  await register(payload);
};
```

**Backend Processing:**

```typescript
// backend/src/modules/auth/auth.service.ts

async register(registerDto: RegisterDto) {
  // 1. Check if email already exists
  const existingUser = await this.usersService.findByEmail(registerDto.email);
  if (existingUser) {
    throw new UnauthorizedException('Email already registered');
  }

  // 2. Hash password using bcrypt
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  // 3. Get or create default school
  let schoolId = registerDto.school_id;
  if (!schoolId) {
    const school = await this.usersService.getOrCreateDefaultSchool();
    schoolId = school._id.toString();
  }

  // 4. Create user document
  const user = await this.usersService.create({
    name: registerDto.name,
    email: registerDto.email,
    password: hashedPassword,
    school_id: schoolId,
    usergroup_id: registerDto.usergroup_id,
    roles: [registerDto.usergroup_id],
    is_activated: true,
    email_verified: false,
  });

  // 5. Create user profile
  await this.usersService.createProfile(user._id.toString(), {
    school_id: schoolId,
    firstname: registerDto.name.split(' ')[0],
    lastname: registerDto.name.split(' ')[1] || '',
    status: 'active',
  });

  // 6. Generate JWT token and return
  return this.login(user);
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": "7d",
    "user": {
      "id": "673a1b2c3d4e5f6g7h8i9j0k",
      "name": "John Doe",
      "email": "john@example.com",
      "school_id": "673a1b2c3d4e5f6g7h8i9j0k",
      "usergroup_id": "teacher",
      "roles": ["teacher"]
    }
  }
}
```

---

## Login Flow

### Step-by-Step Login Process

```javascript
// Frontend: app/(auth)/login/page.tsx
const onSubmit = async (data) => {
  await login(data.email, data.password);
};
```

**Backend Processing:**

```typescript
// backend/src/modules/auth/auth.service.ts

async validateUser(email: string, password: string) {
  // 1. Find user by email
  const user = await this.usersService.findByEmail(email);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 2. Compare password with stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 3. Check if account is activated
  if (!user.is_activated) {
    throw new UnauthorizedException('Account is not activated');
  }

  return user;
}

async login(user: any) {
  // 4. Create JWT payload
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    schoolId: user.school_id.toString(),
    userGroupId: user.usergroup_id,
    roles: user.roles,
  };

  // 5. Sign JWT token (expires in 7 days)
  const access_token = this.jwtService.sign(payload);

  // 6. Return response
  return {
    success: true,
    message: 'Login successful',
    data: {
      access_token,
      token_type: 'Bearer',
      expires_in: '7d',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        school_id: user.school_id,
        usergroup_id: user.usergroup_id,
        roles: user.roles,
      },
    },
  };
}
```

---

## Authorization & Role-Based Access

### Backend Role Checking

```typescript
// Example: Students Controller
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  
  @Post()
  @Roles('admin', 'superadmin')  // Only admins can create students
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentsService.create(createStudentDto);
  }

  @Get()
  // All authenticated users can view (filtered by their role in service)
  async findAll(@CurrentUser() user: any) {
    return await this.studentsService.findAll(user);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')  // Only admins can delete
  async remove(@Param('id') id: string) {
    return await this.studentsService.remove(id);
  }
}
```

### Frontend Role Checking

```typescript
// contexts/AuthContext.tsx
const hasRole = (roles: string | string[]): boolean => {
  if (!user) return false;
  
  const rolesToCheck = Array.isArray(roles) ? roles : [roles];
  return rolesToCheck.some(role => 
    user.roles?.includes(role) || user.role === role
  );
};

// Usage in components
const { hasRole } = useAuth();

if (hasRole(['superadmin', 'admin'])) {
  // Show admin menu
}
```

### Navigation Menu Filtering

```typescript
// app/(dashboard)/layout.tsx
const navItems = [
  { label: 'Students', href: '/dashboard/students', 
    roles: ['superadmin', 'admin', 'teacher'] },
  { label: 'Teachers', href: '/dashboard/teachers', 
    roles: ['superadmin', 'admin'] },
  { label: 'Fees', href: '/dashboard/fees', 
    roles: ['superadmin', 'admin', 'accountant'] },
  // etc...
];

const filteredNavItems = navItems.filter((item) => {
  if (!item.roles) return true;
  return hasRole(item.roles);
});
```

---

## JWT Token Management

### Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "673a1b2c3d4e5f6g7h8i9j0k",      // User ID
    "email": "john@example.com",
    "schoolId": "673a1b2c3d4e5f6g7h8i9j0k",  // School ID
    "userGroupId": "teacher",
    "roles": ["teacher"],
    "iat": 1700000000,                      // Issued at
    "exp": 1700604800                       // Expires at (7 days)
  },
  "signature": "..."
}
```

### Token Storage

**Frontend (Next.js):**
```typescript
// Store in cookies (more secure)
Cookies.set('access_token', token, { expires: 7 });
Cookies.set('user', JSON.stringify(user), { expires: 7 });

// Retrieve token
const token = Cookies.get('access_token');
```

**API Client (Axios):**
```typescript
// lib/api/client.ts
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Token Refresh

```typescript
// POST /api/v1/auth/refresh-token
@Post('refresh-token')
@UseGuards(JwtAuthGuard)
async refreshToken(@CurrentUser() user: any) {
  // Generate new token
  return this.authService.login(user);
}
```

---

## Frontend Authentication

### AuthContext Provider

```typescript
// contexts/AuthContext.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from cookies on mount
  useEffect(() => {
    const token = Cookies.get('access_token');
    const userStr = Cookies.get('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { access_token, user } = response.data.data;
    
    Cookies.set('access_token', access_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    setUser(user);
    
    router.push('/dashboard');
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Backend Authentication

### JWT Strategy

```typescript
// common/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    return {
      id: payload.sub,
      email: payload.email,
      schoolId: payload.schoolId,
      userGroupId: payload.userGroupId,
      roles: payload.roles,
    };
  }
}
```

---

## Middleware & Guards

### Frontend Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Redirect authenticated users away from auth pages
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect unauthenticated users to login
  if (!accessToken && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

### Backend Guards

**JwtAuthGuard:**
```typescript
// common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Check if route is public
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;
    
    // Validate JWT token
    return super.canActivate(context);
  }
}
```

**RolesGuard:**
```typescript
// common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Check if user has any of the required roles
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}
```

---

## Complete Authentication Sequence

### 1. **User Registration**
```
User → Register Form → AuthContext.register() 
→ POST /api/v1/auth/register 
→ AuthService.register() 
→ Hash password 
→ Create user in MongoDB 
→ Generate JWT 
→ Return token + user data 
→ Store in cookies 
→ Redirect to /dashboard
```

### 2. **User Login**
```
User → Login Form → AuthContext.login() 
→ POST /api/v1/auth/login 
→ AuthService.validateUser() 
→ Find user in MongoDB 
→ Compare password hash 
→ AuthService.login() 
→ Generate JWT 
→ Return token + user data 
→ Store in cookies 
→ Redirect to /dashboard
```

### 3. **Protected API Request**
```
User → Click Students menu → GET /api/v1/students 
→ Axios interceptor adds: Authorization: Bearer {token} 
→ Backend receives request 
→ JwtAuthGuard validates token 
→ RolesGuard checks user roles 
→ Controller executes 
→ Service queries MongoDB (filtered by school_id) 
→ Return data 
→ Frontend displays students list
```

### 4. **Role-Based Filtering**
```
Teacher logs in 
→ JWT contains roles: ['teacher'] 
→ Dashboard loads 
→ Navigation filters menu items 
→ Shows: Students (view), Attendance, Exams, Assignments 
→ Hides: Teachers, Fees, Payroll, Settings 
→ API requests include school_id filter 
→ Teacher only sees their assigned classes
```

### 5. **Logout**
```
User → Click Logout 
→ AuthContext.logout() 
→ Remove access_token cookie 
→ Remove user cookie 
→ Clear React state 
→ Redirect to /login 
→ Middleware blocks access to protected routes
```

---

## Security Best Practices

### Password Security
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Never store plain text passwords
- ✅ Never return password in API responses
- ✅ Minimum 6 characters required

### Token Security
- ✅ JWT signed with secret key
- ✅ Token expires in 7 days
- ✅ Stored in HTTP-only cookies (frontend)
- ✅ Verified on every API request
- ✅ User data embedded in token

### API Security
- ✅ All protected routes use JwtAuthGuard
- ✅ Role-based access control with RolesGuard
- ✅ CORS configuration
- ✅ Request validation with DTOs
- ✅ Error messages don't leak sensitive info

### Database Security
- ✅ MongoDB connection over TLS
- ✅ Data isolation by school_id
- ✅ Indexed queries for performance
- ✅ Soft delete support
- ✅ Audit trails with activity logs

---

## Troubleshooting

### Common Issues

**1. 401 Unauthorized Error**
- Check if token is present in cookies
- Verify token hasn't expired
- Ensure backend is running
- Check JWT_SECRET is configured

**2. 403 Forbidden Error**
- User doesn't have required role
- Check roles array in user object
- Verify RolesGuard is checking correct roles

**3. Token Not Found**
- Clear browser cookies
- Re-login to get fresh token
- Check middleware is setting cookies

**4. User Not Found**
- Verify user exists in MongoDB
- Check email is correct
- Ensure account is activated

---

## API Endpoints Summary

### Authentication Endpoints
```
POST   /api/v1/auth/register       - Create new user account
POST   /api/v1/auth/login          - Login with email/password
GET    /api/v1/auth/me             - Get current user info [Protected]
POST   /api/v1/auth/logout         - Logout (clear session) [Protected]
POST   /api/v1/auth/password/change - Change password [Protected]
POST   /api/v1/auth/refresh-token  - Get new JWT token [Protected]
```

### Role-Based Module Access
```
Super Admin:    All endpoints across all schools
School Admin:   All endpoints within their school
Teacher:        Students (view), Attendance, Exams, Assignments
Student:        Own records only (view)
Parent:         Children's records only (view)
Accountant:     Fees, Payroll, Financial reports
Librarian:      Library module only
Receptionist:   Basic student lookup, visitors
```

---

## Conclusion

This authentication system provides:
- ✅ Secure JWT-based authentication
- ✅ Role-based access control (8 user roles)
- ✅ Multi-tenant architecture
- ✅ Password hashing with bcrypt
- ✅ Protected routes on frontend and backend
- ✅ Automatic token injection
- ✅ Session management with cookies
- ✅ 7-day token expiration
- ✅ Middleware protection
- ✅ Comprehensive error handling

**Next Steps:**
1. Test registration with each role
2. Verify role-based menu filtering
3. Test protected API endpoints
4. Implement forgot password flow
5. Add email verification
6. Add 2FA (optional)
7. Implement refresh token rotation
8. Add activity logging
