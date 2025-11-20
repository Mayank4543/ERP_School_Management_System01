'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Download, Calendar, Loader2, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import reportsService from '@/lib/api/services/reports.service';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('attendance');
  const [standard, setStandard] = useState('');
  const [section, setSection] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [format_type, setFormatType] = useState<'pdf' | 'excel'>('pdf');

  const handleGenerateReport = async () => {
    if (!user?.school_id) {
      toast.error('School ID not found');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select start and end date');
      return;
    }

    setLoading(true);
    try {
      let blob: Blob;
      
      switch (reportType) {
        case 'attendance':
          blob = await reportsService.getAttendanceReport({
            schoolId: user.school_id,
            startDate,
            endDate,
            standard: standard ? parseInt(standard) : undefined,
            section: section || undefined,
          });
          break;
          
        case 'fees':
          blob = await reportsService.getFeeReport({
            schoolId: user.school_id,
            startDate,
            endDate,
            standard: standard ? parseInt(standard) : undefined,
          });
          break;
          
        case 'exams':
          if (!standard) {
            toast.error('Please select a class for exam reports');
            setLoading(false);
            return;
          }
          if (!standard) {
            toast.error('Please select an exam for exam reports');
            setLoading(false);
            return;
          }
          // For exam report, we need examId - this should be selected from a dropdown
          // For now, using a placeholder
          toast.error('Please select a specific exam to generate report');
          setLoading(false);
          return;
          break;
          
        case 'defaulters':
          blob = await reportsService.getDefaultersList(user.school_id);
          break;
          
        default:
          toast.error('Invalid report type');
          setLoading(false);
          return;
      }

      // Download the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.${format_type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate comprehensive school reports</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReportType('attendance')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Daily/Monthly</div>
            <p className="text-xs text-gray-500">Class & student wise</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReportType('fees')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Reports</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Collection</div>
            <p className="text-xs text-gray-500">Payment tracking</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReportType('exams')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Reports</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Results</div>
            <p className="text-xs text-gray-500">Performance analysis</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReportType('defaulters')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Fee Pending</div>
            <p className="text-xs text-gray-500">Overdue payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type *</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="fees">Fee Collection Report</SelectItem>
                  <SelectItem value="exams">Exam Results Report</SelectItem>
                  <SelectItem value="defaulters">Fee Defaulters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={standard} onValueChange={setStandard}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((std) => (
                    <SelectItem key={std} value={std.toString()}>Class {std}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  {['A', 'B', 'C', 'D', 'E'].map((sec) => (
                    <SelectItem key={sec} value={sec}>Section {sec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {reportType !== 'defaulters' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date *</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date *</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={format_type} onValueChange={(val: any) => setFormatType(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleGenerateReport} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Types Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Daily attendance summary</li>
              <li>• Monthly attendance reports</li>
              <li>• Class-wise attendance percentage</li>
              <li>• Student attendance history</li>
              <li>• Absentee lists</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fee Collection Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Total collection summary</li>
              <li>• Payment mode wise breakdown</li>
              <li>• Class-wise collection</li>
              <li>• Pending fee reports</li>
              <li>• Payment receipts</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exam Result Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Class-wise results</li>
              <li>• Subject-wise performance</li>
              <li>• Student report cards</li>
              <li>• Pass/Fail statistics</li>
              <li>• Toppers list</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fee Defaulters</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Students with pending fees</li>
              <li>• Amount due details</li>
              <li>• Class-wise defaulters</li>
              <li>• Contact information</li>
              <li>• Payment due dates</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
