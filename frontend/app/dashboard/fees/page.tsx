'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Users, Plus, FileText, Loader2, Download } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import feesService from '@/lib/api/services/fees.service';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function FeesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpected: 0,
    totalCollected: 0,
    pending: 0,
    defaultersCount: 0,
    collectionRate: 0,
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [defaulters, setDefaulters] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [user?.school_id]);

  const fetchData = async () => {
    if (!user?.school_id) return;

    try {
      setLoading(true);
      
      // Fetch collection summary
      const summaryData = await feesService.getCollectionSummary(
        user.school_id,
        new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );
      setStats({
        totalExpected: summaryData.total_amount || 0,
        totalCollected: summaryData.collected || 0,
        pending: summaryData.pending || 0,
        defaultersCount: summaryData.defaulters_count || 0,
        collectionRate: summaryData.collection_rate || 0,
      });

      // Fetch recent payments
      const paymentsData = await feesService.getAll({
        schoolId: user.school_id,
        page: 1,
        limit: 10,
      });
      setRecentPayments(paymentsData.data.slice(0, 5));

      // Fetch defaulters
      const defaultersData = await feesService.getDefaulters(user.school_id);
      setDefaulters(defaultersData.slice(0, 10));
    } catch (error) {
      console.error('Error fetching fees data:', error);
      toast.error('Failed to fetch fees data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await feesService.exportReport({
        schoolId: user?.school_id!,
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fees-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fee Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage fee collection and tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
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
            <p className="text-xs text-gray-500 mt-1">{stats.collectionRate}% collection rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{(stats.pending / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">{100 - stats.collectionRate}% remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.defaultersCount}</div>
            <p className="text-xs text-gray-500 mt-1">Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.collectionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Overall</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Payments</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/fees/payments">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentPayments.length > 0 ? (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{payment.student?.name || 'N/A'}</h4>
                      <p className="text-sm text-gray-500">
                        {payment.fee_type} - {payment.payment_mode}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{format(new Date(payment.payment_date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No recent payments</div>
          )}
        </CardContent>
      </Card>

      {/* Defaulters List */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Fee Defaulters</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/fees/defaulters">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {defaulters.length > 0 ? (
            <div className="space-y-3">
              {defaulters.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <Users className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {student.first_name} {student.last_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Class {student.standard}-{student.section} | Adm: {student.admission_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">₹{student.pending_amount?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No defaulters found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
