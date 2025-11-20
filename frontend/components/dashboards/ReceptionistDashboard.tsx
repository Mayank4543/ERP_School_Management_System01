'use client';

// TODO: Backend APIs needed for full integration:
// - GET /reception/stats (today_visitors, new_inquiries, appointments, phone_calls)
// - GET /reception/visitors (today's visitor log with in/out times)
// - GET /reception/inquiries (admission inquiries with follow-up status)
// - GET /reception/appointments (scheduled meetings for today)
// - GET /reception/call-log (phone call history)

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserPlus,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReceptionistDashboard() {
  const { user } = useAuth();

  // TODO: Replace with real API data
  // const [receptionStats, setReceptionStats] = useState(null);
  // useEffect(() => {
  //   fetchReceptionStats();
  // }, []);

  const receptionStats = [
    {
      title: 'Today\'s Visitors',
      value: '24',
      change: '+8 vs yesterday',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'New Inquiries',
      value: '12',
      change: '5 pending',
      icon: MessageSquare,
      color: 'green',
    },
    {
      title: 'Appointments',
      value: '8',
      change: '3 today',
      icon: Calendar,
      color: 'purple',
    },
    {
      title: 'Phone Calls',
      value: '45',
      change: 'Today',
      icon: Phone,
      color: 'orange',
    },
  ];

  const todaysVisitors = [
    { 
      name: 'Mr. Ramesh Kumar', 
      purpose: 'Parent Meeting',
      personToMeet: 'Principal',
      inTime: '09:30 AM',
      outTime: '10:15 AM',
      status: 'completed',
    },
    { 
      name: 'Ms. Priya Sharma', 
      purpose: 'Admission Inquiry',
      personToMeet: 'Admission Officer',
      inTime: '10:00 AM',
      outTime: null,
      status: 'inside',
    },
  ];

  const recentInquiries = [
    { 
      parentName: 'Mr. Raj Singh',
      studentName: 'Aarav Singh',
      class: '5th Grade',
      phone: '+91 98765-54321',
      date: '2025-11-17',
      status: 'pending',
      priority: 'high',
    },
    { 
      parentName: 'Mrs. Anita Gupta',
      studentName: 'Diya Gupta',
      class: '3rd Grade',
      phone: '+91 98765-54322',
      date: '2025-11-16',
      status: 'contacted',
      priority: 'medium',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    inside: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 🏢
        </h1>
        <p className="text-cyan-100">
          Here's your reception desk overview and today's activities
        </p>
      </div>

      {/* Reception Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {receptionStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Visitors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Today's Visitors
            </CardTitle>
            <CardDescription>Visitor entry log</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysVisitors.map((visitor, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{visitor.name}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${statusColors[visitor.status as keyof typeof statusColors]}`}
                    >
                      {visitor.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {visitor.purpose} • To meet: {visitor.personToMeet}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    In: {visitor.inTime} {visitor.outTime && `• Out: ${visitor.outTime}`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={20} />
              Recent Inquiries
            </CardTitle>
            <CardDescription>Admission inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInquiries.map((inquiry, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{inquiry.parentName}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        inquiry.priority === 'high' ? 'border-red-500 text-red-500' :
                        'border-yellow-500 text-yellow-500'
                      }`}
                    >
                      {inquiry.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Student: {inquiry.studentName} • Class: {inquiry.class}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${statusColors[inquiry.status as keyof typeof statusColors]}`}
                    >
                      {inquiry.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={12} />
                      {inquiry.phone.slice(-10)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
