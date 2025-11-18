# Login & Registration Security - Public Access Management

## 🚨 Critical Question: Agar login/register page sab dekh sakte hain, toh security kaise hai?

Yeh bahut important question hai! **Haan, login aur registration pages PUBLIC hain** - lekin yeh **by design** hai aur ismein bhi **multiple security layers** hain.

---

## 🎯 Current System Analysis

### ❌ **Problem: Registration Form Open Hai**

```typescript
// Current: app/(auth)/register/page.tsx
export default function RegisterPage() {
  return (
    <form>
      <Input name="email" />
      <Input name="password" />
      
      {/* ⚠️ PROBLEM: Koi bhi role select kar sakta hai */}
      <Select name="usergroup_id">
        <SelectItem value="superadmin">Super Admin</SelectItem>
        <SelectItem value="admin">School Admin</SelectItem>
        <SelectItem value="teacher">Teacher</SelectItem>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="parent">Parent</SelectItem>
      </Select>
      
      <Button type="submit">Register</Button>
    </form>
  );
}
```

**Risk:**
- ❌ Koi bhi "Super Admin" select kar sakta hai
- ❌ Koi bhi kisi bhi school mein register ho sakta hai
- ❌ Unauthorized access possible hai

---

## ✅ **Solution 1: Role-Based Registration (Recommended)**

### Public Registration sirf Students ke liye

```typescript
// app/(auth)/register/page.tsx - UPDATED VERSION

export default function RegisterPage() {
  const [registrationType, setRegistrationType] = useState<'student' | 'parent'>('student');

  return (
    <form onSubmit={handleSubmit}>
      {/* Only Student/Parent registration allowed */}
      <RadioGroup value={registrationType} onValueChange={setRegistrationType}>
        <RadioGroupItem value="student">Student Registration</RadioGroupItem>
        <RadioGroupItem value="parent">Parent Registration</RadioGroupItem>
      </RadioGroup>

      {/* School Selection */}
      <Select name="school_id" required>
        <SelectItem value="school1">XYZ School</SelectItem>
        <SelectItem value="school2">ABC School</SelectItem>
      </Select>

      <Input name="name" required />
      <Input name="email" required />
      <Input name="password" required />
      
      {registrationType === 'student' && (
        <>
          <Input name="admission_no" placeholder="Admission Number" required />
          <Input name="roll_no" placeholder="Roll Number" />
        </>
      )}

      <Button type="submit">Register</Button>
    </form>
  );
}
```

### Backend Validation

```typescript
// backend/src/modules/auth/auth.service.ts

async register(registerDto: RegisterDto) {
  // ✅ SECURITY CHECK 1: Only allow student/parent public registration
  const allowedPublicRoles = ['student', 'parent'];
  
  if (!allowedPublicRoles.includes(registerDto.usergroup_id)) {
    throw new ForbiddenException(
      'Public registration is only allowed for Students and Parents. ' +
      'Contact your school administrator for other roles.'
    );
  }

  // ✅ SECURITY CHECK 2: Validate school exists
  const school = await this.schoolsService.findById(registerDto.school_id);
  if (!school) {
    throw new BadRequestException('Invalid school selected');
  }

  // ✅ SECURITY CHECK 3: Verify admission number (for students)
  if (registerDto.usergroup_id === 'student') {
    if (!registerDto.admission_no) {
      throw new BadRequestException('Admission number is required for students');
    }
    
    // Check if admission number exists in school's pending admissions
    const validAdmission = await this.admissionsService.verifyAdmission(
      registerDto.school_id,
      registerDto.admission_no,
      registerDto.email
    );
    
    if (!validAdmission) {
      throw new ForbiddenException(
        'Invalid admission number. Please contact school office.'
      );
    }
  }

  // Continue with registration...
  const user = await this.usersService.create({
    ...registerDto,
    is_activated: false,  // ⭐ Not activated by default
    email_verified: false,
    requires_approval: true,  // ⭐ Requires admin approval
  });

  return user;
}
```

---

## ✅ **Solution 2: Invitation-Based Registration**

### Admin creates invitation links

```typescript
// backend/src/modules/invitations/invitations.service.ts

async createInvitation(adminUser: any, inviteDto: CreateInvitationDto) {
  // Only admins can create invitations
  if (!['admin', 'superadmin'].includes(adminUser.roles[0])) {
    throw new ForbiddenException('Only administrators can send invitations');
  }

  // Generate unique invitation token
  const invitationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invitation = await this.invitationModel.create({
    school_id: adminUser.schoolId,
    email: inviteDto.email,
    role: inviteDto.role,  // teacher, student, parent, etc.
    token: invitationToken,
    expires_at: expiresAt,
    created_by: adminUser.id,
    status: 'pending',
  });

  // Send invitation email
  await this.emailService.sendInvitationEmail(
    inviteDto.email,
    `${process.env.FRONTEND_URL}/register?token=${invitationToken}`,
    inviteDto.role
  );

  return invitation;
}
```

### Registration with invitation token

```typescript
// app/(auth)/register/page.tsx

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('token');

  const [invitationData, setInvitationData] = useState(null);

  useEffect(() => {
    if (invitationToken) {
      // Verify invitation token
      apiClient.get(`/invitations/verify/${invitationToken}`)
        .then(response => {
          setInvitationData(response.data.data);
        })
        .catch(() => {
          toast.error('Invalid or expired invitation link');
          router.push('/login');
        });
    }
  }, [invitationToken]);

  if (invitationToken && !invitationData) {
    return <div>Verifying invitation...</div>;
  }

  return (
    <form>
      {invitationData ? (
        <>
          {/* Pre-filled from invitation */}
          <Input name="email" value={invitationData.email} disabled />
          <Input name="role" value={invitationData.role} disabled />
          <Input name="school" value={invitationData.school_name} disabled />
          
          {/* User fills these */}
          <Input name="name" placeholder="Full Name" required />
          <Input name="password" placeholder="Create Password" required />
          <Input name="mobile_no" placeholder="Mobile Number" />
        </>
      ) : (
        <Alert>
          <AlertTitle>Registration Closed</AlertTitle>
          <AlertDescription>
            Registration requires an invitation from your school administrator.
            Please contact your school office.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
```

---

## ✅ **Solution 3: Multi-Step Approval Process**

### Step 1: Self Registration (Pending State)

```typescript
// Registration creates user in "pending" state
async register(registerDto: RegisterDto) {
  const user = await this.usersService.create({
    ...registerDto,
    is_activated: false,  // ⭐ Not active
    email_verified: false,
    approval_status: 'pending',  // ⭐ Waiting for approval
  });

  // Notify admin
  await this.notificationService.notifyAdmins(user.school_id, {
    title: 'New Registration Pending',
    message: `${user.name} (${user.email}) has registered as ${user.usergroup_id}`,
    type: 'registration_pending',
    user_id: user._id,
  });

  return {
    success: true,
    message: 'Registration submitted. Waiting for admin approval.',
    data: null,  // ⭐ No login allowed yet
  };
}
```

### Step 2: Admin Approval Required

```typescript
// backend/src/modules/users/users.controller.ts

@Post('approve/:userId')
@Roles('admin', 'superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
async approveUser(
  @CurrentUser() admin: any,
  @Param('userId') userId: string,
  @Body() approvalDto: ApprovalDto
) {
  // Verify user belongs to admin's school
  const user = await this.usersService.findById(userId);
  
  if (user.school_id.toString() !== admin.schoolId) {
    throw new ForbiddenException('Cannot approve users from other schools');
  }

  // Approve or reject
  await this.usersService.updateApproval(userId, {
    is_activated: approvalDto.approved,
    approval_status: approvalDto.approved ? 'approved' : 'rejected',
    approved_by: admin.id,
    approved_at: new Date(),
    rejection_reason: approvalDto.rejection_reason,
  });

  // Send notification to user
  await this.emailService.sendApprovalEmail(
    user.email,
    approvalDto.approved,
    approvalDto.rejection_reason
  );

  return {
    success: true,
    message: `User ${approvalDto.approved ? 'approved' : 'rejected'} successfully`,
  };
}
```

### Step 3: User can login only after approval

```typescript
// backend/src/modules/auth/auth.service.ts

async validateUser(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);
  
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // ✅ CHECK: Account must be activated
  if (!user.is_activated) {
    throw new UnauthorizedException(
      'Your account is not activated. Please contact your administrator.'
    );
  }

  // ✅ CHECK: Must be approved
  if (user.approval_status === 'pending') {
    throw new UnauthorizedException(
      'Your registration is pending approval from school administrator.'
    );
  }

  if (user.approval_status === 'rejected') {
    throw new UnauthorizedException(
      'Your registration was rejected. Please contact school office.'
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return user;
}
```

---

## ✅ **Solution 4: OTP-Based Verification**

### Mobile/Email OTP for verification

```typescript
// Step 1: User registers
async register(registerDto: RegisterDto) {
  // Create user (inactive)
  const user = await this.usersService.create({
    ...registerDto,
    is_activated: false,
    email_verified: false,
  });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await this.otpModel.create({
    user_id: user._id,
    otp: otp,
    expires_at: otpExpiry,
    type: 'registration',
  });

  // Send OTP via SMS/Email
  await this.smsService.sendOTP(user.mobile_no, otp);
  await this.emailService.sendOTP(user.email, otp);

  return {
    success: true,
    message: 'OTP sent to your mobile and email',
    data: {
      user_id: user._id,
      email: user.email,
      mobile: user.mobile_no,
    },
  };
}

// Step 2: Verify OTP
async verifyOTP(userId: string, otp: string) {
  const otpRecord = await this.otpModel.findOne({
    user_id: userId,
    otp: otp,
    type: 'registration',
    verified: false,
    expires_at: { $gte: new Date() },
  });

  if (!otpRecord) {
    throw new BadRequestException('Invalid or expired OTP');
  }

  // Activate user
  await this.usersService.update(userId, {
    is_activated: true,
    email_verified: true,
  });

  // Mark OTP as verified
  await this.otpModel.updateOne(
    { _id: otpRecord._id },
    { verified: true }
  );

  return {
    success: true,
    message: 'Account verified successfully. You can now login.',
  };
}
```

---

## 🎯 **Recommended Implementation Strategy**

### Phase 1: Immediate (Production Ready)
```typescript
// 1. Limit public registration to Student/Parent only
const allowedPublicRoles = ['student', 'parent'];

// 2. All registrations start as "pending"
is_activated: false
approval_status: 'pending'

// 3. Admin approval required
Admin Dashboard → Pending Users → Approve/Reject

// 4. Only approved users can login
if (user.approval_status !== 'approved') {
  throw new UnauthorizedException('Account pending approval');
}
```

### Phase 2: Enhanced Security
```typescript
// 1. Invitation-based registration for staff
Teachers/Admin → Must have invitation token

// 2. OTP verification
Mobile/Email OTP before activation

// 3. Document verification
Upload ID proof, admission letter, etc.
```

### Phase 3: Advanced Features
```typescript
// 1. SSO Integration (Google/Microsoft)
Single Sign-On for institutional accounts

// 2. Two-Factor Authentication (2FA)
OTP on every login

// 3. IP Whitelisting
School admin can whitelist IPs

// 4. Geofencing
Only allow registration from school location
```

---

## 🔒 **Complete Security Flow**

```
┌─────────────────────────────────────────────────────────────┐
│              PUBLIC REGISTRATION SECURITY FLOW               │
└─────────────────────────────────────────────────────────────┘

1. User visits /register
   │
   ├─ Has invitation token?
   │  ├─ Yes → Verify token → Pre-fill role & school
   │  └─ No → Only show Student/Parent options
   │
2. User fills form & submits
   │
3. Backend receives request
   │
   ├─ ✅ CHECK 1: Allowed role? (student/parent only)
   │  └─ No → 403 Forbidden
   │
   ├─ ✅ CHECK 2: Valid school?
   │  └─ No → 400 Bad Request
   │
   ├─ ✅ CHECK 3: Email not already registered?
   │  └─ Yes → 409 Conflict
   │
   ├─ ✅ CHECK 4: Admission number valid? (if student)
   │  └─ No → 403 Forbidden
   │
4. Create user with:
   - is_activated: false
   - approval_status: 'pending'
   - email_verified: false
   │
5. Send OTP for verification
   │
6. User verifies OTP
   - email_verified: true
   │
7. Notify school admin
   - "New registration pending approval"
   │
8. Admin reviews & approves
   - is_activated: true
   - approval_status: 'approved'
   │
9. User receives approval email
   │
10. User can now login
    │
    ├─ ✅ CHECK: is_activated = true?
    ├─ ✅ CHECK: approval_status = 'approved'?
    ├─ ✅ CHECK: email_verified = true?
    │
    └─ All checks pass → Generate JWT → Access granted

┌─────────────────────────────────────────────────────────────┐
│              STAFF REGISTRATION (Secure Path)                │
└─────────────────────────────────────────────────────────────┘

1. School Admin logs in
   │
2. Admin creates invitation
   - Select role (teacher/accountant/etc.)
   - Enter email
   - Generate unique token
   │
3. System sends invitation email
   - Link: /register?token=abc123...
   │
4. Staff clicks link
   │
5. Token verification
   ├─ Valid? → Pre-fill role & school
   └─ Invalid? → Redirect to login
   │
6. Staff completes registration
   │
7. Auto-approved (came via invitation)
   - is_activated: true
   - approval_status: 'approved'
   │
8. Staff can immediately login
```

---

## 📋 **Database Schema Updates**

```typescript
// User Schema - Add approval fields
@Schema({ timestamps: true })
export class User {
  // ... existing fields

  @Prop({ default: false })
  is_activated: boolean;

  @Prop({ default: false })
  email_verified: boolean;

  @Prop({ default: false })
  mobile_verified: boolean;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  approval_status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by: Types.ObjectId;

  @Prop()
  approved_at: Date;

  @Prop()
  rejection_reason: string;

  @Prop()
  invitation_token: string;

  @Prop()
  invitation_expires_at: Date;

  @Prop({ default: 'normal' }) // 'normal', 'invited', 'imported'
  registration_type: string;
}

// Invitation Schema
@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expires_at: Date;

  @Prop({ enum: ['pending', 'accepted', 'expired'], default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  accepted_by: Types.ObjectId;

  @Prop()
  accepted_at: Date;
}

// OTP Schema
@Schema({ timestamps: true })
export class OTP {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  otp: string;

  @Prop({ enum: ['registration', 'login', 'password_reset'], required: true })
  type: string;

  @Prop({ required: true })
  expires_at: Date;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  verified_at: Date;
}
```

---

## 🚨 **Security Checklist**

### Backend Protection
- ✅ Role whitelist for public registration (student/parent only)
- ✅ Admin approval required before activation
- ✅ Email/Mobile OTP verification
- ✅ Invitation token validation
- ✅ School existence validation
- ✅ Admission number verification (for students)
- ✅ Rate limiting on registration endpoint
- ✅ CAPTCHA to prevent bots
- ✅ IP tracking and blocking
- ✅ Audit logs for all registrations

### Frontend Protection
- ✅ Hide admin/teacher roles from public form
- ✅ Show invitation-based registration for staff
- ✅ Clear messaging about approval process
- ✅ OTP input screen
- ✅ Status page (pending/approved/rejected)
- ✅ School selection dropdown (verified schools only)

### Database Protection
- ✅ Default: is_activated = false
- ✅ Default: approval_status = 'pending'
- ✅ Indexes on email, token fields
- ✅ TTL index on expired invitations
- ✅ Soft delete support

---

## 📊 **Summary: How It Works**

| User Type | Registration Method | Approval Needed | Can Login Immediately |
|-----------|-------------------|-----------------|----------------------|
| **Student** | Public form | ✅ Yes | ❌ No (after approval) |
| **Parent** | Public form | ✅ Yes | ❌ No (after approval) |
| **Teacher** | Invitation only | ❌ No (auto-approved) | ✅ Yes |
| **School Admin** | Super Admin creates | ❌ No (auto-activated) | ✅ Yes |
| **Super Admin** | Manual database entry | ❌ No | ✅ Yes |

---

## 🎯 **Main Point**

**"Registration form public hai, lekin:**
1. **Sirf student/parent register kar sakte hain publicly**
2. **Admin approval chahiye before login**
3. **OTP verification mandatory**
4. **Staff ko invitation link chahiye**
5. **Super Admin manually database mein create hota hai**

**Iska matlab hai ki bina approval ke koi bhi unauthorized person system access nahi kar sakta!"** 🔒
