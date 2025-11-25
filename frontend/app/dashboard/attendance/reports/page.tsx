'use client';

import { useState, useEffect } from 'react';
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
import { FileDown, Printer, Loader2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import attendanceService, { AttendanceReport } from '@/lib/api/services/attendance.service';
import sectionsService from '@/lib/api/services/sections.service';
import academicService from '@/lib/api/services/academic.service';
import { toast } from 'sonner';

interface ReportFilters {
  reportType: 'daily' | 'monthly' | 'yearly' | 'custom';
  selectedMonth: number;
  selectedYear: number;
  standard: string;
  section: string;
  startDate: string;
  endDate: string;
}

export default function AttendanceReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [reportData, setReportData] = useState<AttendanceReport[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState({
    overallAttendance: 0,
    bestClass: '',
    bestPercentage: 0,
    worstClass: '',
    worstPercentage: 0,
  });

  const [filters, setFilters] = useState<ReportFilters>({
    reportType: 'monthly',
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    standard: 'all',
    section: 'all',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (user?.school_id) {
      loadSections();
    }
  }, [user?.school_id]);

  useEffect(() => {
    if (user?.school_id && filters.standard && filters.section) {
      generateReport();
    }
  }, [filters, user?.school_id]);

  const loadSections = async () => {
    if (!user?.school_id) return;

    try {
      setSectionsLoading(true);
      const response = await sectionsService.getAll({
        schoolId: user.school_id,
        page: 1,
        limit: 1000,
      });
      setSections(response.data || []);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast.error('Failed to load sections');
    } finally {
      setSectionsLoading(false);
    }
  };

  const generateReport = async () => {
    if (!user?.school_id) return;

    try {
      setLoading(true);

      let startDate = '';
      let endDate = '';

      // Calculate date range based on report type
      switch (filters.reportType) {
        case 'daily':
          startDate = endDate = new Date().toISOString().split('T')[0];
          break;
        case 'monthly':
          const year = filters.selectedYear;
          const month = filters.selectedMonth;
          startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
          endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month
          break;
        case 'yearly':
          startDate = `${filters.selectedYear}-01-01`;
          endDate = `${filters.selectedYear}-12-31`;
          break;
        case 'custom':
          startDate = filters.startDate;
          endDate = filters.endDate;
          break;
      }

      if (!startDate || !endDate) {
        toast.error('Please select valid date range');
        return;
      }

      const reports: AttendanceReport[] = [];
      let allSections = sections;

      // Filter sections based on selected criteria
      if (filters.standard !== 'all') {
        allSections = sections.filter(s => s.standard === parseInt(filters.standard));
      }

      if (filters.section !== 'all') {
        allSections = allSections.filter(s => s._id === filters.section);
      }

      // Generate report for each section
      for (const section of allSections) {
        try {
          const sectionReport = await attendanceService.getClassReport(
            user.school_id,
            section.standard,
            section._id,
            startDate,
            endDate
          );

          // Add section info to each report record
          sectionReport.forEach(report => {
            reports.push({
              ...report,
              class: `Class ${section.standard}-${section.name}`,
              standard: section.standard,
              section: section.name,
            } as AttendanceReport & { class: string; standard: number; section: string });
          });
        } catch (error) {
          console.warn(`Error getting report for section ${section.name}:`, error);
        }
      }

      setReportData(reports);
      calculateOverallStats(reports);

    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = (reports: any[]) => {
    if (reports.length === 0) {
      setOverallStats({
        overallAttendance: 0,
        bestClass: '',
        bestPercentage: 0,
        worstClass: '',
        worstPercentage: 0,
      });
      return;
    }

    // Group by class to calculate class averages
    const classGroups: { [key: string]: { totalDays: number; totalPresent: number } } = {};

    reports.forEach(report => {
      const classKey = report.class || `Class ${report.standard}-${report.section}`;
      if (!classGroups[classKey]) {
        classGroups[classKey] = { totalDays: 0, totalPresent: 0 };
      }
      classGroups[classKey].totalDays += report.total_days || 0;
      classGroups[classKey].totalPresent += report.present_days || 0;
    });

    const classPercentages = Object.entries(classGroups).map(([className, data]) => ({
      className,
      percentage: data.totalDays > 0 ? (data.totalPresent / data.totalDays) * 100 : 0,
    }));

    // Calculate overall average
    const overallAttendance = classPercentages.length > 0
      ? classPercentages.reduce((sum, cls) => sum + cls.percentage, 0) / classPercentages.length
      : 0;

    // Find best and worst performing classes
    const bestClass = classPercentages.reduce((best, current) =>
      current.percentage > best.percentage ? current : best,
      classPercentages[0] || { className: '', percentage: 0 }
    );

    const worstClass = classPercentages.reduce((worst, current) =>
      current.percentage < worst.percentage ? current : worst,
      classPercentages[0] || { className: '', percentage: 0 }
    );

    setOverallStats({
      overallAttendance: Math.round(overallAttendance * 10) / 10,
      bestClass: bestClass.className,
      bestPercentage: Math.round(bestClass.percentage * 10) / 10,
      worstClass: worstClass.className,
      worstPercentage: Math.round(worstClass.percentage * 10) / 10,
    });
  };

  const handleExportExcel = async () => {
    try {
      const blob = await attendanceService.exportReport({
        schoolId: user?.school_id || '',
        start_date: getReportStartDate(),
        end_date: getReportEndDate(),
        ...(filters.standard !== 'all' && { class: parseInt(filters.standard) }),
        ...(filters.section !== 'all' && { section: filters.section }),
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  const handlePrint = () => {
    window.print();
  };

  const getReportStartDate = () => {
    switch (filters.reportType) {
      case 'daily':
        return new Date().toISOString().split('T')[0];
      case 'monthly':
        return `${filters.selectedYear}-${filters.selectedMonth.toString().padStart(2, '0')}-01`;
      case 'yearly':
        return `${filters.selectedYear}-01-01`;
      case 'custom':
        return filters.startDate;
      default:
        return '';
    }
  };

  const getReportEndDate = () => {
    switch (filters.reportType) {
      case 'daily':
        return new Date().toISOString().split('T')[0];
      case 'monthly':
        return new Date(filters.selectedYear, filters.selectedMonth, 0).toISOString().split('T')[0];
      case 'yearly':
        return `${filters.selectedYear}-12-31`;
      case 'custom':
        return filters.endDate;
      default:
        return '';
    }
  };

  const getFilteredSections = () => {
    if (filters.standard === 'all') return [];
    return sections.filter(section => section.standard === parseInt(filters.standard));
  };

  const getReportTitle = () => {
    switch (filters.reportType) {
      case 'daily':
        return `Daily Attendance Report - ${new Date().toLocaleDateString()}`;
      case 'monthly':
        return `Monthly Attendance Report - ${new Date(filters.selectedYear, filters.selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
      case 'yearly':
        return `Yearly Attendance Report - ${filters.selectedYear}`;
      case 'custom':
        return `Custom Attendance Report - ${filters.startDate} to ${filters.endDate}`;
      default:
        return 'Attendance Report';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View detailed attendance analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportExcel} disabled={loading}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={loading}>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={filters.reportType}
                onValueChange={(value: any) => setFilters({ ...filters, reportType: value })}
              >
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

            {filters.reportType !== 'yearly' && filters.reportType !== 'daily' && (
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select
                  value={filters.selectedMonth.toString()}
                  onValueChange={(val) => setFilters({ ...filters, selectedMonth: Number(val) })}
                  disabled={filters.reportType === 'yearly' || filters.reportType === 'custom'}
                >
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
            )}

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={filters.selectedYear.toString()}
                onValueChange={(val) => setFilters({ ...filters, selectedYear: Number(val) })}
                disabled={filters.reportType === 'custom'}
              >
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

            <div className="space-y-2">
              <Label htmlFor="standard">Class</Label>
              <Select
                value={filters.standard}
                onValueChange={(val) => setFilters({ ...filters, standard: val, section: 'all' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Class {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={filters.section}
                onValueChange={(val) => setFilters({ ...filters, section: val })}
                disabled={filters.standard === 'all' || sectionsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {getFilteredSections().map((section) => (
                    <SelectItem key={section._id} value={section._id}>
                      Section {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={generateReport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {filters.reportType === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Content */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Generating report...</span>
            </div>
          </CardContent>
        </Card>
      ) : reportData.length > 0 ? (
        <>
          {/* Report Data */}
          <Card>
            <CardHeader>
              <CardTitle>{getReportTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Student</th>
                      <th className="text-center py-3 px-4">Total Days</th>
                      <th className="text-center py-3 px-4">Present Days</th>
                      <th className="text-center py-3 px-4">Absent Days</th>
                      <th className="text-center py-3 px-4">Late Days</th>
                      <th className="text-center py-3 px-4">Attendance %</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{row.student_name}</div>
                            <div className="text-sm text-gray-500">{(row as any).class}</div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">{row.total_days}</td>
                        <td className="text-center py-3 px-4 text-green-600">{row.present_days}</td>
                        <td className="text-center py-3 px-4 text-red-600">{row.absent_days}</td>
                        <td className="text-center py-3 px-4 text-yellow-600">{row.late_days}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`font-semibold ${row.percentage >= 90 ? 'text-green-600' : row.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {row.percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          {row.percentage >= 90 ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Excellent
                            </span>
                          ) : row.percentage >= 75 ? (
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
                <div className="text-3xl font-bold text-blue-600">{overallStats.overallAttendance}%</div>
                <p className="text-sm text-gray-500 mt-1">Average across selected classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Best Performing Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{overallStats.bestClass || 'N/A'}</div>
                <p className="text-sm text-gray-500 mt-1">{overallStats.bestPercentage}% attendance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overallStats.worstClass || 'N/A'}</div>
                <p className="text-sm text-gray-500 mt-1">{overallStats.worstPercentage}% attendance rate</p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Calendar className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">No attendance data available</p>
              <p className="text-sm text-gray-400 text-center mt-1">
                Select filters and click "Generate Report" to view attendance data
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
