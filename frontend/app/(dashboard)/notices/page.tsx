'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, Plus, Pin, Users } from 'lucide-react';
import Link from 'next/link';

export default function NoticesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const notices = [
    {
      id: '1',
      title: 'Annual Day Celebration - 2025',
      content: 'Dear Students and Parents, We are pleased to announce that the Annual Day will be celebrated on December 20th, 2025. All students are requested to participate actively.',
      date: '2025-11-17',
      category: 'Event',
      priority: 'high',
      postedBy: 'Principal Office',
      pinned: true,
      attachments: ['Schedule.pdf'],
    },
    {
      id: '2',
      title: 'Winter Vacation Notice',
      content: 'School will remain closed from December 25th to January 5th for winter vacation. School will reopen on January 6th, 2025.',
      date: '2025-11-15',
      category: 'Holiday',
      priority: 'medium',
      postedBy: 'Administration',
      pinned: true,
      attachments: [],
    },
    {
      id: '3',
      title: 'Parent-Teacher Meeting',
      content: 'A parent-teacher meeting is scheduled for November 25th, 2025. All parents are requested to attend between 10 AM to 1 PM.',
      date: '2025-11-14',
      category: 'Meeting',
      priority: 'high',
      postedBy: 'Academic Coordinator',
      pinned: false,
      attachments: [],
    },
    {
      id: '4',
      title: 'Fee Payment Reminder',
      content: 'This is a reminder that the last date for fee payment is November 30th, 2025. Please clear your dues on time.',
      date: '2025-11-12',
      category: 'Finance',
      priority: 'medium',
      postedBy: 'Accounts Department',
      pinned: false,
      attachments: [],
    },
  ];

  const stats = {
    total: notices.length,
    today: 1,
    pinned: notices.filter(n => n.pinned).length,
    thisWeek: 3,
  };

  const filteredNotices = activeTab === 'all' 
    ? notices 
    : activeTab === 'pinned'
    ? notices.filter(n => n.pinned)
    : notices.filter(n => n.category.toLowerCase() === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notices & Announcements</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage school notices</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/notices/create">
            <Plus className="mr-2 h-4 w-4" />
            Post Notice
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pinned</CardTitle>
            <Pin className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pinned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Notices</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
          <TabsTrigger value="holiday">Holidays</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredNotices.map((notice) => (
            <Card key={notice.id} className={`hover:shadow-lg transition-shadow ${notice.pinned ? 'border-yellow-300 bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {notice.pinned && <Pin className="h-5 w-5 text-yellow-600" />}
                      <CardTitle className="text-xl">{notice.title}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notice.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {notice.priority === 'high' ? 'Important' : 'Normal'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                        {notice.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(notice.date).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{notice.content}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Posted by: <span className="font-medium">{notice.postedBy}</span></span>
                    {notice.attachments.length > 0 && (
                      <span className="text-blue-600">
                        📎 {notice.attachments.length} attachment(s)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/notices/${notice.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
