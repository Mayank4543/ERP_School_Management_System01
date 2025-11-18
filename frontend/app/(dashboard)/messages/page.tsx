'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Inbox, Star, Trash2, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');

  const messages = [
    {
      id: '1',
      from: 'Principal Office',
      subject: 'Annual Day Celebration Notice',
      preview: 'Dear Staff and Students, We are pleased to announce...',
      date: '2025-11-17',
      read: false,
      starred: true,
      type: 'inbox',
    },
    {
      id: '2',
      from: 'Mr. Sharma (Math Teacher)',
      subject: 'Class 10-A Test Results',
      preview: 'The mathematics test results for Class 10-A are now available...',
      date: '2025-11-16',
      read: true,
      starred: false,
      type: 'inbox',
    },
    {
      id: '3',
      from: 'Parent - Rahul Kumar',
      subject: 'Leave Application',
      preview: 'My son will be absent from school due to medical reasons...',
      date: '2025-11-15',
      read: false,
      starred: false,
      type: 'inbox',
    },
  ];

  const stats = {
    total: 45,
    unread: 12,
    starred: 8,
    sent: 23,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Send and receive messages</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/messages/compose">
            <Plus className="mr-2 h-4 w-4" />
            Compose Message
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Inbox className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.starred}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              <TabsTrigger value="trash">Trash</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-2 mt-4">
              {messages.map((message) => (
                <Link
                  key={message.id}
                  href={`/dashboard/messages/${message.id}`}
                  className={`block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !message.read ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className={`font-semibold ${!message.read ? 'text-blue-600' : ''}`}>
                          {message.from}
                        </p>
                        {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        {!message.read && (
                          <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">New</span>
                        )}
                      </div>
                      <p className={`mt-1 ${!message.read ? 'font-medium' : ''}`}>{message.subject}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{message.preview}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className="text-sm text-gray-500">{new Date(message.date).toLocaleDateString()}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
