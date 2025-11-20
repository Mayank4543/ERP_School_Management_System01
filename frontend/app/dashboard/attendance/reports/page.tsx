'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileDown, Printer } from 'lucide-react';

export default function AttendanceReportsPage() {
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data
  const monthlyReport = [
    { class: 'Class 10-A', total: 45, avgAttendance: 93.5, daysPresent: 28, daysAbsent: 2 },
    { class: 'Class 10-B', total: 40, avgAttendance: 91.2, daysPresent: 27, daysAbsent: 3 },
    { class: 'Class 9-A', total: 50, avgAttendance: 88.8, daysPresent: 26, daysAbsent: 4 },
    { class: 'Class 9-B', total: 48, avgAttendance: 85.4, daysPresent: 25, daysAbsent: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View detailed attendance analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="yearly">Yearly Report</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth.toString()} onValueChange={(val) => setSelectedMonth(Number(val))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(Number(val))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Report */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Report - {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Class</th>
                  <th className="text-center py-3 px-4">Total Students</th>
                  <th className="text-center py-3 px-4">Avg Attendance %</th>
                  <th className="text-center py-3 px-4">Days Present</th>
                  <th className="text-center py-3 px-4">Days Absent</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {monthlyReport.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-medium">{row.class}</td>
                    <td className="text-center py-3 px-4">{row.total}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-semibold ${row.avgAttendance >= 90 ? 'text-green-600' : row.avgAttendance >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {row.avgAttendance}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-green-600">{row.daysPresent}</td>
                    <td className="text-center py-3 px-4 text-red-600">{row.daysAbsent}</td>
                    <td className="text-center py-3 px-4">
                      {row.avgAttendance >= 90 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Excellent
                        </span>
                      ) : row.avgAttendance >= 75 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Good
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Poor
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">89.7%</div>
            <p className="text-sm text-gray-500 mt-1">Average across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Best Performing Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Class 10-A</div>
            <p className="text-sm text-gray-500 mt-1">93.5% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">Class 9-B</div>
            <p className="text-sm text-gray-500 mt-1">85.4% attendance rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
