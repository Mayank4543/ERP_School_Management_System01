'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SuperAdminNavigation from '@/components/shared/SuperAdminNavigation';
import MultiSchoolSelector from '@/components/shared/MultiSchoolSelector';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Home,
    Users,
    GraduationCap,
    Calendar,
    ClipboardList,
    FileText,
    DollarSign,
    BookOpen,
    Bus,
    Building,
    Package,
    Wallet,
    Settings,
    Menu,
    Bell,
    LogOut,
    User,
    MessageSquare,
    Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';

interface DashboardLayoutProps {
    children: ReactNode;
}

interface NavItem {
    label: string;
    href: string;
    icon: any;
    roles?: UserRole[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Academic', href: '/dashboard/academic', icon: Calendar, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN] },
    { label: 'Students', href: '/dashboard/students', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER] },
    { label: 'Teachers', href: '/dashboard/teachers', icon: GraduationCap, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN] },
    { label: 'Staff', href: '/dashboard/staff', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN] },
    { label: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
    { label: 'Exams', href: '/dashboard/exams', icon: ClipboardList },
    { label: 'Assignments', href: '/dashboard/assignments', icon: ClipboardList, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER] },
    { label: 'Homework', href: '/dashboard/homework', icon: BookOpen, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER] },
    { label: 'Timetable', href: '/dashboard/timetable', icon: Calendar },
    { label: 'Fees', href: '/dashboard/fees', icon: DollarSign, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT] },
    { label: 'Library', href: '/dashboard/library', icon: BookOpen },
    { label: 'Communication', href: '/dashboard/communication', icon: MessageSquare },
    { label: 'Transport', href: '/dashboard/transport', icon: Bus, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN] },
    { label: 'Hostel', href: '/dashboard/hostel', icon: Building, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN] },
    { label: 'Inventory', href: '/dashboard/inventory', icon: Package, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN] },
    { label: 'Payroll', href: '/dashboard/payroll', icon: Wallet, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT] },
    { label: 'Reports', href: '/dashboard/reports', icon: FileText },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN] },
]; export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, logout, hasRole } = useAuth();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Fix hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredNavItems = navItems.filter((item) => {
        if (!item.roles) return true;
        return hasRole(item.roles);
    });

    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
    };

    // Prevent hydration mismatch by rendering placeholder during SSR
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="lg:pl-64">
                    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </header>
                    <main className="p-6">{children}</main>
                </div>
            </div>
        );
    }

    const NavLinks = () => (
        <nav className="space-y-1">
            {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link key={item.href} href={item.href}>
                        <div
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* SuperAdmin Navigation or Regular Sidebar */}
            {user?.roles?.includes('super_admin') ? (
                <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
                    <SuperAdminNavigation />
                </aside>
            ) : (
                <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-lg font-bold text-white">SE</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">School ERP</span>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-3">
                        <NavLinks />
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <div className={user?.roles?.includes('super_admin') ? 'lg:pl-64' : 'lg:pl-64'}>
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild className="lg:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Menu size={20} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-0">
                                    <div className="flex items-center gap-2 px-6 py-4 border-b">
                                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                            <span className="text-lg font-bold text-white">SE</span>
                                        </div>
                                        <span className="text-xl font-bold">School ERP</span>
                                    </div>
                                    <div className="py-4 px-3">
                                        <NavLinks />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Search Bar */}
                            <div className="relative w-96 hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Button>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.profile_picture} />
                                            <AvatarFallback>{getInitials(user?.first_name, user?.last_name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                                            <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div>
                                            <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}