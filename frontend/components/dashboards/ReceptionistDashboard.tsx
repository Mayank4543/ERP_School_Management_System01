'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserPlus,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReceptionistDashboard() {
  const { user } = useAuth();

  // Reception Stats
  const receptionStats = [
    {
      title: 'Today\'s Visitors',
      value: '24',
      change: '+8 vs yesterday',
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'In & Out logged',
    },
    {
      title: 'New Inquiries',
      value: '12',
      change: '5 pending',
      trend: 'neutral',
      icon: MessageSquare,
      color: 'green',
      description: 'Admission inquiries',
    },
    {
      title: 'Appointments',
      value: '8',
      change: '3 today',
      trend: 'neutral',
      icon: Calendar,
      color: 'purple',
      description: 'Scheduled meetings',
    },
    {
      title: 'Phone Calls',
      value: '45',
      change: 'Today',
      trend: 'up',
      icon: Phone,
      color: 'orange',
      description: 'Incoming & outgoing',
    },
  ];

  // Today's Visitors
  const todaysVisitors = [
    { 
      name: 'Mr. Ramesh Kumar', 
      purpose: 'Parent Meeting',
      personToMeet: 'Principal',
      inTime: '09:30 AM',
      outTime: '10:15 AM',
      status: 'completed',
      phone: '+91 98765-43210'
    },
    { 
      name: 'Ms. Priya Sharma', 
      purpose: 'Admission Inquiry',
      personToMeet: 'Admission Officer',
      inTime: '10:00 AM',
      outTime: '11:00 AM',
      status: 'completed',
      phone: '+91 98765-43211'
    },
    { 
      name: 'Mr. Vijay Patel', 
      purpose: 'Book Vendor',
      personToMeet: 'Librarian',
      inTime: '11:30 AM',
      outTime: null,
      status: 'inside',
      phone: '+91 98765-43212'
    },
    { 
      name: 'Dr. Suresh Reddy', 
      purpose: 'Student Health Checkup',
      personToMeet: 'School Doctor',
      inTime: '02:00 PM',
      outTime: null,
      status: 'inside',
      phone: '+91 98765-43213'
    },
  ];

  // Recent Inquiries
  const recentInquiries = [
    { 
      parentName: 'Mr. Raj Singh',
      studentName: 'Aarav Singh',
      class: '5th Grade',
      phone: '+91 98765-54321',
      date: '2025-11-17',
      status: 'pending',
      priority: 'high',
      followUpDate: '2025-11-18'
    },
    { 
      parentName: 'Mrs. Anita Gupta',
      studentName: 'Diya Gupta',
      class: '3rd Grade',
      phone: '+91 98765-54322',
      date: '2025-11-16',
      status: 'contacted',
      priority: 'medium',
      followUpDate: '2025-11-20'
    },
    { 
      parentName: 'Mr. Anil Mehta',
      studentName: 'Rohan Mehta',
      class: '10th Grade',
      phone: '+91 98765-54323',
      date: '2025-11-15',
      status: 'completed',
      priority: 'low',
      followUpDate: null
    },
    { 
      parentName: 'Mrs. Kavita Joshi',
      studentName: 'Ananya Joshi',
      class: '1st Grade',
      phone: '+91 98765-54324',
      date: '2025-11-14',
      status: 'pending',
      priority: 'high',
      followUpDate: '2025-11-19'
    },
  ];

  // Today's Appointments
  const todaysAppointments = [
    { 
      time: '10:00 AM',
      visitorName: 'Mr. Kumar',
      purpose: 'TC Collection',
      appointedWith: 'Principal',
      status: 'completed',
      phone: '+91 98765-11111'
    },
    { 
      time: '11:30 AM',
      visitorName: 'Mrs. Sharma',
      purpose: 'Fee Discussion',
      appointedWith: 'Accountant',
      status: 'completed',
      phone: '+91 98765-22222'
    },
    { 
      time: '02:00 PM',
      visitorName: 'Dr. Patel',
      purpose: 'Student Counseling',
      appointedWith: 'Counselor',
      status: 'ongoing',
      phone: '+91 98765-33333'
    },
    { 
      time: '03:30 PM',
      visitorName: 'Mr. Singh',
      purpose: 'Parent-Teacher Meeting',
      appointedWith: 'Class Teacher',
      status: 'upcoming',
      phone: '+91 98765-44444'
    },
  ];

  // Phone Call Log
  const phoneCallLog = [
    { time: '09:15 AM', caller: 'Mr. Verma', type: 'incoming', purpose: 'Fee inquiry', duration: '5 min' },
    { time: '09:45 AM', caller: 'Book Supplier', type: 'incoming', purpose: 'Order confirmation', duration: '8 min' },
    { time: '10:30 AM', caller: 'Parent', type: 'outgoing', purpose: 'Admission follow-up', duration: '12 min' },
    { time: '11:00 AM', caller: 'Courier Service', type: 'incoming', purpose: 'Document delivery', duration: '3 min' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-700 border-green-200',
    inside: 'bg-blue-100 text-blue-700 border-blue-200',
    ongoing: 'bg-blue-100 text-blue-700 border-blue-200',
    upcoming: 'bg-gray-100 text-gray-700 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    contacted: 'bg-blue-100 text-blue-700 border-blue-200',
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
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                  ) : (
                    <TrendingUp size={14} className="text-gray-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-gray-500'}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Visitors */}
        <Card className="md:col-span-1">
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
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{visitor.name}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${statusColors[visitor.status as keyof typeof statusColors]}`}
                      >
                        {visitor.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {visitor.purpose} • To meet: {visitor.personToMeet}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        In: {visitor.inTime} {visitor.outTime && `• Out: ${visitor.outTime}`}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={12} />
                        {visitor.phone.slice(-10)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Today's Appointments
            </CardTitle>
            <CardDescription>Scheduled meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysAppointments.map((appointment, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm font-semibold">{appointment.time}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${statusColors[appointment.status as keyof typeof statusColors]}`}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{appointment.visitorName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {appointment.purpose} • With: {appointment.appointedWith}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone size={12} />
                    {appointment.phone}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout - Inquiries & Calls */}
      <div className="grid gap-4 md:grid-cols-2">
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
                        inquiry.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                        'border-green-500 text-green-500'
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
                    <span className="text-xs text-gray-500">
                      {inquiry.followUpDate && `Follow-up: ${new Date(inquiry.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Phone size={12} />
                    {inquiry.phone}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phone Call Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone size={20} />
              Phone Call Log
            </CardTitle>
            <CardDescription>Today's call history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phoneCallLog.map((call, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-sm font-medium">{call.time}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        call.type === 'incoming' ? 'border-green-500 text-green-600' : 'border-blue-500 text-blue-600'
                      }`}
                    >
                      {call.type}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">{call.caller}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{call.purpose}</span>
                    <span className="text-xs text-gray-500">{call.duration}</span>
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
