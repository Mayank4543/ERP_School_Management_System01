'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Phone, Mail, Send, Search } from 'lucide-react';

export default function DefaultersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const defaulters = [
    {
      id: '1',
      name: 'Rahul Kumar',
      rollNo: '1001',
      class: '10-A',
      pendingAmount: 15000,
      dueDate: '2025-10-30',
      phone: '+91 98765 43210',
      email: 'rahul@example.com',
      daysOverdue: 18,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      rollNo: '1002',
      class: '10-A',
      pendingAmount: 20000,
      dueDate: '2025-09-30',
      phone: '+91 98765 43211',
      email: 'priya@example.com',
      daysOverdue: 48,
    },
    {
      id: '3',
      name: 'Amit Patel',
      rollNo: '1003',
      class: '9-B',
      pendingAmount: 8000,
      dueDate: '2025-11-10',
      phone: '+91 98765 43212',
      email: 'amit@example.com',
      daysOverdue: 7,
    },
  ];

  const stats = {
    total: defaulters.length,
    totalAmount: defaulters.reduce((acc, d) => acc + d.pendingAmount, 0),
    criticalCount: defaulters.filter(d => d.daysOverdue > 30).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fee Defaulters</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage pending fee payments</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Bulk Reminder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Defaulters</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{stats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical (30+ days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.criticalCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Defaulters List */}
      <div className="space-y-4">
        {defaulters.map((defaulter) => (
          <Card key={defaulter.id} className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{defaulter.name}</h3>
                    {defaulter.daysOverdue > 30 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                        Critical
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Roll Number</p>
                      <p className="font-medium">{defaulter.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="font-medium">{defaulter.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending Amount</p>
                      <p className="font-bold text-red-600 text-lg">₹{defaulter.pendingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium">{new Date(defaulter.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Days Overdue</p>
                      <p className={`font-bold ${defaulter.daysOverdue > 30 ? 'text-red-600' : 'text-orange-600'}`}>
                        {defaulter.daysOverdue} days
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{defaulter.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{defaulter.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    SMS
                  </Button>
                  <Button size="sm">Collect Fee</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
