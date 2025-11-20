'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Dynamically import dashboards to prevent SSR issues
const SuperAdminDashboard = dynamic(() => import('@/components/dashboards/SuperAdminDashboard'), { ssr: false });
const AdminDashboard = dynamic(() => import('@/components/dashboards/AdminDashboard'), { ssr: false });
const StudentDashboard = dynamic(() => import('@/components/dashboards/StudentDashboard'), { ssr: false });
const TeacherDashboard = dynamic(() => import('@/components/dashboards/TeacherDashboard'), { ssr: false });
const ParentDashboard = dynamic(() => import('@/components/dashboards/ParentDashboard'), { ssr: false });
const AccountantDashboard = dynamic(() => import('@/components/dashboards/AccountantDashboard'), { ssr: false });
const LibrarianDashboard = dynamic(() => import('@/components/dashboards/LibrarianDashboard'), { ssr: false });
const ReceptionistDashboard = dynamic(() => import('@/components/dashboards/ReceptionistDashboard'), { ssr: false });

export default function DashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null; // Will redirect to login
    }

    // Render dashboard based on user role
    switch (user?.role) {
        case UserRole.SUPER_ADMIN:
        case 'super_admin':
        case 'superadmin':
            return <SuperAdminDashboard />;

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
        case 'school_admin':
        case 'admin':
        default:
            return <AdminDashboard />;
    }
}