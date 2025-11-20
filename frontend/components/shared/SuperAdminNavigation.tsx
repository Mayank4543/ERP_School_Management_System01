'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  School, 
  Database, 
  BarChart3, 
  Settings,
  AlertTriangle,
  Activity,
  FileText,
  Calendar,
  BookOpen,
  GraduationCap,
  UserCheck,
  DollarSign,
  Bus,
  MessageSquare,
  Clock,
  TrendingUp,
  Globe,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const superAdminMenuItems = [
  {
    category: 'Dashboard',
    icon: BarChart3,
    items: [
      { 
        name: 'Overview', 
        href: '/dashboard', 
        icon: BarChart3,
        description: 'System overview and stats'
      },
      { 
        name: 'System Health', 
        href: '/dashboard/system-health', 
        icon: Activity,
        description: 'Monitor system performance'
      },
    ]
  },
  {
    category: 'Schools',
    icon: School,
    items: [
      { 
        name: 'All Schools', 
        href: '/dashboard/schools', 
        icon: School,
        description: 'Manage all schools'
      },
      { 
        name: 'School Approvals', 
        href: '/dashboard/school-approvals', 
        icon: UserCheck,
        description: 'Approve new schools'
      },
    ]
  },
  {
    category: 'Users',
    icon: Users,
    items: [
      { 
        name: 'All Users', 
        href: '/dashboard/users', 
        icon: Users,
        description: 'Global user management'
      },
      { 
        name: 'Admins', 
        href: '/dashboard/admins', 
        icon: Shield,
        description: 'Admin accounts'
      },
    ]
  },
  {
    category: 'System',
    icon: Settings,
    items: [
      { 
        name: 'System Logs', 
        href: '/dashboard/logs', 
        icon: FileText,
        description: 'View system logs'
      },
      { 
        name: 'Settings', 
        href: '/dashboard/settings', 
        icon: Settings,
        description: 'System configuration'
      },
    ]
  }
];

export default function SuperAdminNavigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['System Overview']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (!user || !user.roles?.includes('super_admin')) {
    return null;
  }

  return (
    <div className="w-64 bg-white h-full overflow-hidden border-r border-gray-200">
      {/* SuperAdmin Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">ia Academy</h3>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-0.5">
          {superAdminMenuItems.map((category) => (
            <div key={category.category} className="space-y-0.5">
              <Button
                variant="ghost"
                className="w-full justify-between text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md py-2 px-3"
                onClick={() => toggleCategory(category.category)}
              >
                <div className="flex items-center gap-3">
                  <category.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.category}</span>
                </div>
                {expandedCategories.includes(category.category) ? 
                  <ChevronDown className="h-3 w-3" /> : 
                  <ChevronRight className="h-3 w-3" />
                }
              </Button>

              {expandedCategories.includes(category.category) && (
                <div className="ml-6 space-y-0.5 mt-1">
                  {category.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-auto py-2 px-3 rounded-md ${
                          pathname === item.href 
                            ? 'bg-purple-50 text-purple-700 hover:bg-purple-50' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-100">
        <Link href="/dashboard/system-health">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <Activity className="h-4 w-4 mr-2" />
            System Status
          </Button>
        </Link>
      </div>
    </div>
  );
}