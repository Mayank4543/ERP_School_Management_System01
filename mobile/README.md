# School ERP Mobile App

React Native mobile application for School Management System built with Expo. This app provides role-based access for Students, Teachers, and Parents to interact with the School ERP system.

## 🚀 Features

### Student Features
- **Dashboard**: View attendance percentage, average score, class rank, pending fees
- **Attendance**: Track daily attendance records
- **Assignments**: View and submit assignments
- **Exams**: View exam schedule and results
- **Fees**: View fee payment status and history
- **Profile**: Update personal information

### Teacher Features
- **Dashboard**: View assigned classes, students count, pending grading
- **Classes**: Manage assigned classes and subjects
- **Attendance**: Mark attendance for students
- **Assignments**: Create and manage assignments
- **Profile**: Update profile information

### Parent Features
- **Dashboard**: Overview of all children
- **Children**: View and select children
- **Attendance**: Monitor children's attendance
- **Fees**: View and pay fees for children
- **Profile**: Update profile information

## 📋 Prerequisites

- Node.js 18+ (preferably 20+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Backend API running (NestJS backend)
- iOS Simulator (for Mac) or Android Emulator / Physical device

## 🛠️ Installation

1. **Navigate to mobile directory**:
```bash
cd mobile
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
Create a `.env` file (copy from `.env.example`):
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_PREFIX=api/v1
EXPO_PUBLIC_APP_NAME=School ERP Mobile
```

**Note**: For physical devices, replace `localhost` with your computer's IP address:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

4. **Start the development server**:
```bash
npm start
```

5. **Run on device**:
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 📱 Running on Physical Device

1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Make sure your phone and computer are on the same WiFi network
3. Update `.env` with your computer's IP address
4. Start the server: `npm start`
5. Scan the QR code with Expo Go app

## 🏗️ Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── _layout.tsx    # Auth layout
│   ├── (tabs)/            # Main app screens (tab navigation)
│   │   ├── index.tsx      # Dashboard (role-based)
│   │   ├── attendance.tsx # Attendance screen
│   │   ├── assignments.tsx# Assignments screen
│   │   ├── exams.tsx      # Exams screen
│   │   ├── fees.tsx       # Fees screen
│   │   ├── classes.tsx    # Classes (teacher)
│   │   ├── children.tsx   # Children (parent)
│   │   ├── profile.tsx    # Profile screen
│   │   └── _layout.tsx    # Tab layout (role-based)
│   └── _layout.tsx        # Root layout
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── services/              # API services
│   └── api/
│       ├── client.ts      # Axios client with interceptors
│       ├── auth.ts        # Authentication API
│       ├── dashboard.ts   # Dashboard API
│       ├── students.ts    # Student API
│       ├── teachers.ts    # Teacher API
│       └── parents.ts    # Parent API
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
├── theme/                 # Theme configuration
│   └── theme.ts           # App theme
└── package.json          # Dependencies
```

## 🔐 Authentication Flow

1. User enters email and password on login screen
2. App sends credentials to `/auth/login` endpoint
3. Backend returns JWT token and user data
4. Token is stored in AsyncStorage
5. Token is automatically added to all API requests via interceptors
6. On token expiration (401), user is logged out

## 🔌 API Integration

The app integrates with the NestJS backend API:

- **Base URL**: Configured in `.env` file
- **Authentication**: JWT Bearer tokens
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `X-School-Id: <school_id>` (for multi-tenant support)

### Key Endpoints Used:

- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout
- `GET /students/user/:userId` - Get student by user ID
- `GET /teachers/user/:userId` - Get teacher by user ID
- `GET /attendance/user/:userId` - Get attendance records
- `GET /assignments` - Get assignments
- `GET /exams` - Get exams
- `GET /fees` - Get fees

## 🎨 UI/UX Features

- **Material Design**: Using React Native Paper for consistent UI
- **Role-based Navigation**: Different tabs based on user role
- **Pull to Refresh**: Available on all list screens
- **Loading States**: Activity indicators during data fetching
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on phones and tablets

## 📦 Key Dependencies

- **expo**: Expo SDK
- **expo-router**: File-based routing
- **react-native-paper**: Material Design components
- **axios**: HTTP client
- **@react-native-async-storage/async-storage**: Local storage
- **react-hook-form**: Form handling
- **zustand**: State management (if needed)
- **date-fns**: Date formatting

## 🚧 Backend API Requirements

Some endpoints need to be implemented in the backend:

1. **Dashboard Endpoints**:
   - `GET /dashboard/student/:id` - Student dashboard data
   - `GET /dashboard/teacher/:id` - Teacher dashboard data
   - `GET /dashboard/parent/:id` - Parent dashboard data

2. **Student Endpoints**:
   - `GET /students/user/:userId` - Get student by user ID ✅ (exists)
   - `GET /students/:id/attendance` - Student attendance
   - `GET /students/:id/timetable` - Student timetable

3. **Parent Endpoints**:
   - `GET /parents/:id/children` - Get parent's children
   - `GET /fees/pay` - Pay fee endpoint

## 🐛 Troubleshooting

### Issue: Cannot connect to backend
- **Solution**: Make sure backend is running and check API URL in `.env`
- For physical devices, use IP address instead of `localhost`

### Issue: Token expired / Unauthorized
- **Solution**: Logout and login again. Token expires after 7 days.

### Issue: Module not found
- **Solution**: Run `npm install` again

### Issue: Metro bundler cache issues
- **Solution**: Clear cache with `npx expo start -c`

## 📝 Development Notes

- The app uses Expo Router for navigation
- Authentication state is managed via React Context
- API calls are centralized in service files
- All screens support pull-to-refresh
- Error handling is implemented at service level

## 🔄 Next Steps

1. Implement backend dashboard endpoints
2. Add push notifications
3. Add offline support
4. Implement file uploads for assignments
5. Add payment gateway integration
6. Add charts and analytics
7. Implement real-time updates via WebSocket

## 📄 License

This project is part of the School ERP Management System.



