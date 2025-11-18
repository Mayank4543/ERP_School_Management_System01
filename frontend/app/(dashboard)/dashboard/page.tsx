'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

// Import all role-based dashboard components
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import ParentDashboard from '@/components/dashboards/ParentDashboard';
import AccountantDashboard from '@/components/dashboards/AccountantDashboard';
import LibrarianDashboard from '@/components/dashboards/LibrarianDashboard';
import ReceptionistDashboard from '@/components/dashboards/ReceptionistDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  // Render dashboard based on user role
  switch (user?.role) {
    case UserRole.STUDENT:
      return <StudentDashboard />;
    
    case UserRole.TEACHER:
      return <TeacherDashboard />;
    
    case UserRole.PARENT:
      return <ParentDashboard />;
    
    case UserRole.ACCOUNTANT:
      return <AccountantDashboard />;
    
    case UserRole.LIBRARIAN:
      return <LibrarianDashboard />;
    
    case UserRole.RECEPTIONIST:
      return <ReceptionistDashboard />;
    
    case UserRole.SCHOOL_ADMIN:
    case UserRole.SUPER_ADMIN:
    default:
      return <AdminDashboard />;
  }
}
