'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Users, Plus, FileText } from 'lucide-react';
import Link from 'next/link';

export default function FeesPage() {
  // Mock data
  const stats = {
    totalExpected: 5000000,
    totalCollected: 4250000,
    pending: 750000,
    defaulters: 45,
    collectionRate: 85,
  };

  const recentPayments = [
    {
      id: '1',
      studentName: 'Aarav Kumar',
      class: '10-A',
      amount: 15000,
      mode: 'Online',
      date: '2025-11-15',
      receipt: 'FEE001',
    },
    {
      id: '2',
      studentName: 'Priya Singh',
      class: '9-B',
      amount: 12000,
      mode: 'Cash',
      date: '2025-11-14',
      receipt: 'FEE002',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fee Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage fee collection and tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/fees/defaulters">Defaulters List</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/fees/collect">
              <Plus className="mr-2 h-4 w-4" />
              Collect Fee
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalExpected / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(stats.totalCollected / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">85% collection rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{(stats.pending / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">15% remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.defaulters}</div>
            <p className="text-xs text-gray-500 mt-1">Students with dues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.collectionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/fees/collect">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Collect Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Record new fee payment</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/fees/structure">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Fee Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage fee structures</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/fees/defaulters">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                Defaulters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">View pending payments</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/fees/reports">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generate fee reports</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/fees/history">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Receipt No</th>
                  <th className="text-left py-3 px-4">Student Name</th>
                  <th className="text-center py-3 px-4">Class</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Mode</th>
                  <th className="text-center py-3 px-4">Date</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-medium">{payment.receipt}</td>
                    <td className="py-3 px-4">{payment.studentName}</td>
                    <td className="text-center py-3 px-4">{payment.class}</td>
                    <td className="text-right py-3 px-4 font-semibold text-green-600">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          payment.mode === 'Online'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {payment.mode}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="text-center py-3 px-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/fees/receipt/${payment.id}`}>View Receipt</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
