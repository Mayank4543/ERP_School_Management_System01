# School ERP System - Frontend

Modern, responsive Next.js frontend for the School ERP Management System.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Context + Zustand
- **API Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Real-time**: Socket.io Client
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   └── login/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── teachers/
│   │   └── ...
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   └── ui/                  # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── lib/
│   ├── api/
│   │   ├── client.ts        # Axios client
│   │   └── services/        # API services
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript interfaces
├── middleware.ts            # Route protection
└── .env.local               # Environment variables
```

## 🔧 Installation

### Prerequisites
- Node.js 18+ (preferably 20+)
- npm or yarn
- Backend API running on `http://localhost:3000`

### Setup Steps

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
Create `.env.local` file (already created):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=School ERP System
```

4. **Run development server**:
```bash
npm run dev
```

5. **Open browser**:
Navigate to `http://localhost:3001`

## 🎨 Available UI Components

The following shadcn/ui components are already installed:

- ✅ Button, Input, Label, Card, Table
- ✅ Select, Textarea, Checkbox
- ✅ Dropdown Menu, Dialog, Sheet
- ✅ Tabs, Badge, Avatar, Calendar, Form
- ✅ Sonner (Toast), Tooltip, Accordion
- ✅ Alert, Separator, Skeleton, Popover, Command

### Adding More Components

```bash
npx shadcn@latest add [component-name]
```

## 🔐 Authentication

### Login Credentials (Demo)

```
Super Admin: superadmin@school.com / password123
School Admin: admin@school.com / password123
Teacher: teacher@school.com / password123
Student: student@school.com / password123
```

### How Authentication Works

1. User logs in via `/login` page
2. JWT tokens stored in HTTP-only cookies
3. Axios interceptor adds token to all requests
4. Middleware protects routes
5. Auto-refresh token on expiry
6. Redirect to login if unauthorized

## 📡 API Integration

### API Client Setup

The API client (`lib/api/client.ts`) includes:
- Base Axios instance
- Request interceptor (adds JWT token)
- Response interceptor (handles errors)
- Automatic token refresh
- Error handling

### Creating API Services

Example service structure:

```typescript
// lib/api/services/students.service.ts
import apiClient from '../client';
import { Student, PaginatedResponse } from '@/types';

class StudentsService {
  async getAll(params: any): Promise<PaginatedResponse<Student>> {
    const response = await apiClient.get('/students', { params });
    return response.data;
  }

  async getById(id: string): Promise<Student> {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  }

  async create(data: Partial<Student>): Promise<Student> {
    const response = await apiClient.post('/students', data);
    return response.data;
  }

  async update(id: string, data: Partial<Student>): Promise<Student> {
    const response = await apiClient.patch(`/students/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  }
}

export default new StudentsService();
```

## 🎯 Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset

### Protected Routes
- `/dashboard` - Main dashboard
- `/dashboard/students` - Student management
- `/dashboard/teachers` - Teacher management
- `/dashboard/attendance` - Attendance management
- `/dashboard/exams` - Exam management
- `/dashboard/fees` - Fee management
- `/dashboard/library` - Library management
- `/dashboard/transport` - Transport management
- `/dashboard/hostel` - Hostel management
- `/dashboard/inventory` - Inventory management
- `/dashboard/payroll` - Payroll management
- `/dashboard/reports` - Reports & analytics
- `/dashboard/settings` - System settings

## 🔔 Real-time Features

Socket.io client is installed and ready for WebSocket connections.

## 📝 Form Validation

Using React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🛠️ Development Tips

### Using Auth Context

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome {user?.first_name}</div>;
}
```

### Toast Notifications

```typescript
import { toast } from 'sonner';

toast.success('Operation successful!');
toast.error('Something went wrong');
toast.info('Information message');
toast.warning('Warning message');
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
npx kill-port 3001
# Or use different port
PORT=3002 npm run dev
```

### API Connection Error

- Check backend is running on `http://localhost:3000`
- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check CORS settings in backend

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

**Note**: Refer to `../FRONTEND_DEVELOPMENT_PLAN.md` for detailed development roadmap.
