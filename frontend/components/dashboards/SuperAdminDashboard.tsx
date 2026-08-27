'use client';
import { useEffect, useState, useCallback } from 'react';
import { superAdminDashboardService, type SystemStats } from '@/lib/api/services/super-admin/dashboard.service';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  School, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  ChevronDown,
  User,
  TrendingUp
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 10200,
    totalStudents: 8450,
    totalTeachers: 1240,
    totalSchools: 125,
    activeUsers: 450,
    systemHealth: 'good',
    serverUptime: '15d 8h 42m',
    databaseSize: '2.4 GB',
    todayRegistrations: 18,
    pendingApprovals: 7
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await superAdminDashboardService.getDashboardStats();
      if (response.data) {
        const data = response.data;
        setStats({
          totalUsers: data.totalUsers || 10200,
          totalStudents: data.totalStudents || 8450,
          totalTeachers: data.totalTeachers || 1240,
          totalSchools: data.totalSchools || 125,
          activeUsers: data.activeUsers || 450,
          systemHealth: 'good',
          serverUptime: '15d 8h 42m',
          databaseSize: '2.4 GB',
          todayRegistrations: data.todayRegistrations || 18,
          pendingApprovals: data.pendingApprovals || 7,
        });
      }
      toast.success('Dashboard data updated');
    } catch (error: any) {
      console.error('Backend connection failed:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50/50 p-4 sm:p-6 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening in your ERP system today.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading} className="bg-white">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-1">
        {/* Card 1: Total Schools */}
        <Card className="border-gray-200/80 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit">
                <School className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-500 font-medium pt-1">Total Schools</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalSchools}</h3>
              <p className="text-xs text-purple-600 font-semibold flex items-center gap-1">
                +12 this month
              </p>
            </div>
            {/* Sparkline chart */}
            <svg className="w-14 h-10 text-purple-400 shrink-0" viewBox="0 0 60 30" fill="none">
              <path d="M5 25 C15 20, 25 28, 35 15 C45 22, 50 10, 55 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </CardContent>
        </Card>

        {/* Card 2: Active Schools */}
        <Card className="border-gray-200/80 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-500 font-medium pt-1">Active Schools</p>
              <h3 className="text-2xl font-bold text-gray-900">118</h3>
              <p className="text-xs text-emerald-600 font-semibold">
                94.4% <span className="text-gray-400 font-normal">of total schools</span>
              </p>
            </div>
            {/* Sparkline chart */}
            <svg className="w-14 h-10 text-emerald-500 shrink-0" viewBox="0 0 60 30" fill="none">
              <path d="M5 24 C15 25, 25 18, 35 22 C45 15, 50 12, 55 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </CardContent>
        </Card>

        {/* Card 3: Pending Schools */}
        <Card className="border-gray-200/80 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-500 font-medium pt-1">Pending Schools</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</h3>
              <p className="text-xs text-amber-600 font-medium">Awaiting approval</p>
            </div>
            {/* Sparkline chart */}
            <svg className="w-14 h-10 text-amber-500 shrink-0" viewBox="0 0 60 30" fill="none">
              <path d="M5 25 C15 24, 25 22, 35 20 C45 18, 50 14, 55 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </CardContent>
        </Card>

        {/* Card 4: Total Students */}
        <Card className="border-gray-200/80 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
                <GraduationCap className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-500 font-medium pt-1">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</h3>
              <p className="text-xs text-blue-600 font-semibold">+320 this month</p>
            </div>
            {/* Sparkline chart */}
            <svg className="w-14 h-10 text-blue-500 shrink-0" viewBox="0 0 60 30" fill="none">
              <path d="M5 22 C15 25, 25 18, 35 20 C45 12, 50 15, 55 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </CardContent>
        </Card>

        {/* Card 5: Total Teachers */}
        <Card className="border-gray-200/80 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl w-fit">
                <UserCheck className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-500 font-medium pt-1">Total Teachers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalTeachers.toLocaleString()}</h3>
              <p className="text-xs text-teal-600 font-semibold">+18 this month</p>
            </div>
            {/* Sparkline chart */}
            <svg className="w-14 h-10 text-teal-500 shrink-0" viewBox="0 0 60 30" fill="none">
              <path d="M5 26 C15 24, 25 25, 35 18 C45 22, 50 14, 55 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </CardContent>
        </Card>

        {/* Card 6: Total Users */}
        <Card className="border-gray-200/80 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-500 font-medium pt-1">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
              <p className="text-xs text-indigo-600 font-semibold">+450 this month</p>
            </div>
            {/* Sparkline chart */}
            <svg className="w-14 h-10 text-indigo-500 shrink-0" viewBox="0 0 60 30" fill="none">
              <path d="M5 25 C15 20, 25 28, 35 15 C45 22, 50 10, 55 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </CardContent>
        </Card>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes donut-spin-in {
          from { stroke-dashoffset: 88; }
          to   { stroke-dashoffset: var(--target-offset, 0); }
        }
        .donut-seg {
          animation: donut-spin-in 1.2s cubic-bezier(.4,0,.2,1) forwards;
        }
        .donut-seg-1 { --target-offset: 0;   animation-delay: 0.1s; }
        .donut-seg-2 { --target-offset: -64; animation-delay: 0.4s; }
        .donut-seg-3 { --target-offset: -68; animation-delay: 0.6s; }
        .donut-seg-4 { --target-offset: -70; animation-delay: 0.75s; }

        @keyframes legend-fade-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .legend-row { opacity: 0; animation: legend-fade-in 0.5s ease forwards; }
        .legend-row-1 { animation-delay: 0.5s; }
        .legend-row-2 { animation-delay: 0.7s; }
        .legend-row-3 { animation-delay: 0.9s; }
        .legend-row-4 { animation-delay: 1.05s; }

        @keyframes bar-grow {
          from { width: 0%; }
          to   { width: var(--bar-w); }
        }
        .bar-anim {
          width: 0%;
          animation: bar-grow 1s cubic-bezier(.4,0,.2,1) forwards;
        }
        .bar-anim-1 { --bar-w: 94.4%; animation-delay: 0.55s; }
        .bar-anim-2 { --bar-w: 5.6%;  animation-delay: 0.7s; }
        .bar-anim-3 { --bar-w: 2.4%;  animation-delay: 0.85s; }
        .bar-anim-4 { --bar-w: 1.6%;  animation-delay: 1.0s; }

        /* Growth chart */
        @keyframes line-draw {
          from { stroke-dashoffset: 600; }
          to   { stroke-dashoffset: 0; }
        }
        .line-draw {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: line-draw 1.4s cubic-bezier(.4,0,.2,1) forwards;
        }
        .line-blue   { animation-delay: 0.2s; }
        .line-green  { animation-delay: 0.5s; }
        .line-purple { animation-delay: 0.8s; }

        @keyframes dot-pop {
          0%   { r: 0; opacity: 0; }
          70%  { r: 4; opacity: 1; }
          100% { r: 3; opacity: 1; }
        }
        .dot-pop { animation: dot-pop 0.4s ease forwards; }

        @keyframes pulse-center {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .center-label { animation: pulse-center 2.5s ease-in-out infinite; animation-delay: 1.4s; }
      `}</style>

      {/* Middle Row (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. School Status Overview — Animated Donut */}
        <Card className="border-gray-200/80 shadow-sm bg-white flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-gray-900">School Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-5">
              {/* Animated Donut */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  {/* Active — 72.8% */}
                  <circle className="donut-seg donut-seg-1" cx="18" cy="18" r="14" fill="none"
                    stroke="#10b981" strokeWidth="4"
                    strokeDasharray="64 24" strokeDashoffset="88" />
                  {/* Pending — 4.3% */}
                  <circle className="donut-seg donut-seg-2" cx="18" cy="18" r="14" fill="none"
                    stroke="#f59e0b" strokeWidth="4"
                    strokeDasharray="4 84" strokeDashoffset="88" />
                  {/* Rejected — 2.0% */}
                  <circle className="donut-seg donut-seg-3" cx="18" cy="18" r="14" fill="none"
                    stroke="#f43f5e" strokeWidth="4"
                    strokeDasharray="2 86" strokeDashoffset="88" />
                  {/* Suspended — 1.2% */}
                  <circle className="donut-seg donut-seg-4" cx="18" cy="18" r="14" fill="none"
                    stroke="#94a3b8" strokeWidth="4"
                    strokeDasharray="2 86" strokeDashoffset="88" />
                </svg>
                {/* Center Label */}
                <div className="center-label absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-gray-900">125</span>
                  <span className="text-[9px] text-gray-400 font-medium leading-tight">Total</span>
                </div>
              </div>

              {/* Legend with progress bars */}
              <div className="flex-1 space-y-3">
                {/* Active */}
                <div className="legend-row legend-row-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="text-gray-700 font-medium">Active</span>
                    </div>
                    <span className="font-bold text-gray-800">118 <span className="text-gray-400 font-normal text-[10px]">(72.8%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bar-anim bar-anim-1 h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>

                {/* Pending */}
                <div className="legend-row legend-row-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="text-gray-700 font-medium">Pending</span>
                    </div>
                    <span className="font-bold text-gray-800">7 <span className="text-gray-400 font-normal text-[10px]">(4.3%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bar-anim bar-anim-2 h-full bg-amber-500 rounded-full"></div>
                  </div>
                </div>

                {/* Rejected */}
                <div className="legend-row legend-row-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                      <span className="text-gray-700 font-medium">Rejected</span>
                    </div>
                    <span className="font-bold text-gray-800">3 <span className="text-gray-400 font-normal text-[10px]">(2.0%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bar-anim bar-anim-3 h-full bg-rose-500 rounded-full"></div>
                  </div>
                </div>

                {/* Suspended */}
                <div className="legend-row legend-row-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
                      <span className="text-gray-700 font-medium">Suspended</span>
                    </div>
                    <span className="font-bold text-gray-800">2 <span className="text-gray-400 font-normal text-[10px]">(1.2%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bar-anim bar-anim-4 h-full bg-slate-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Pending Actions */}
        <Card className="border-gray-200/80 shadow-sm bg-white flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-gray-900">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Item 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <School className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Schools waiting for approval</p>
                  <p className="text-[11px] text-gray-500">New school registrations</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">7</span>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 bg-white border-gray-200 text-gray-700 font-medium">
                  View <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Admin requests</p>
                  <p className="text-[11px] text-gray-500">Admin role applications</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">3</span>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 bg-white border-gray-200 text-gray-700 font-medium">
                  View <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Teacher requests</p>
                  <p className="text-[11px] text-gray-500">Teacher account requests</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">5</span>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 bg-white border-gray-200 text-gray-700 font-medium">
                  View <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Other requests</p>
                  <p className="text-[11px] text-gray-500">Other miscellaneous requests</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">4</span>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 bg-white border-gray-200 text-gray-700 font-medium">
                  View <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* View All Pending Requests */}
            <a href="#pending" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 pt-1">
              View all pending requests <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>

        {/* 3. School & User Growth — Animated Lines */}
        <Card className="border-gray-200/80 shadow-sm bg-white flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold text-gray-900">School & User Growth</CardTitle>
            <button className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
              Last 6 Months <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SVG Line Chart */}
            <div className="relative h-44 w-full">
              <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="30" y1="20" x2="290" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="30" y1="50" x2="290" y2="50" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="30" y1="80" x2="290" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="30" y1="110" x2="290" y2="110" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Y Axis labels */}
                <text x="5" y="24" fill="#94a3b8" fontSize="9">250</text>
                <text x="5" y="54" fill="#94a3b8" fontSize="9">200</text>
                <text x="5" y="84" fill="#94a3b8" fontSize="9">150</text>
                <text x="5" y="114" fill="#94a3b8" fontSize="9">100</text>
                <text x="15" y="142" fill="#94a3b8" fontSize="9">0</text>

                {/* X Axis labels */}
                <text x="50" y="142" fill="#64748b" fontSize="9" textAnchor="middle">Jan</text>
                <text x="95" y="142" fill="#64748b" fontSize="9" textAnchor="middle">Feb</text>
                <text x="140" y="142" fill="#64748b" fontSize="9" textAnchor="middle">Mar</text>
                <text x="185" y="142" fill="#64748b" fontSize="9" textAnchor="middle">Apr</text>
                <text x="230" y="142" fill="#64748b" fontSize="9" textAnchor="middle">May</text>
                <text x="275" y="142" fill="#64748b" fontSize="9" textAnchor="middle">Jun</text>

                {/* Gradient fills under lines */}
                <defs>
                  <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="grad-purple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Fill areas */}
                <path d="M50,118 Q95,78 140,65 T230,48 T275,38 L275,135 L50,135 Z"
                  fill="url(#grad-blue)" style={{opacity:0, animation:'legend-fade-in 0.8s ease 0.3s forwards'}} />
                <path d="M50,128 Q95,100 140,88 T230,72 T275,55 L275,135 L50,135 Z"
                  fill="url(#grad-green)" style={{opacity:0, animation:'legend-fade-in 0.8s ease 0.6s forwards'}} />
                <path d="M50,138 Q95,124 140,116 T230,105 T275,95 L275,135 L50,135 Z"
                  fill="url(#grad-purple)" style={{opacity:0, animation:'legend-fade-in 0.8s ease 0.9s forwards'}} />

                {/* Line 1: New Students (Blue) — animated draw */}
                <path className="line-draw line-blue"
                  d="M50,118 Q95,78 140,65 T230,48 T275,38"
                  fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                <circle className="dot-pop" cx="50"  cy="118" r="0" fill="#2563eb" style={{animationDelay:'1.7s'}} />
                <circle className="dot-pop" cx="95"  cy="78"  r="0" fill="#2563eb" style={{animationDelay:'1.8s'}} />
                <circle className="dot-pop" cx="140" cy="65"  r="0" fill="#2563eb" style={{animationDelay:'1.9s'}} />
                <circle className="dot-pop" cx="185" cy="54"  r="0" fill="#2563eb" style={{animationDelay:'2.0s'}} />
                <circle className="dot-pop" cx="230" cy="48"  r="0" fill="#2563eb" style={{animationDelay:'2.1s'}} />
                <circle className="dot-pop" cx="275" cy="38"  r="0" fill="#2563eb" style={{animationDelay:'2.2s'}} />

                {/* Line 2: New Teachers (Green) — animated draw */}
                <path className="line-draw line-green"
                  d="M50,128 Q95,100 140,88 T230,72 T275,55"
                  fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <circle className="dot-pop" cx="50"  cy="128" r="0" fill="#10b981" style={{animationDelay:'2.0s'}} />
                <circle className="dot-pop" cx="95"  cy="100" r="0" fill="#10b981" style={{animationDelay:'2.1s'}} />
                <circle className="dot-pop" cx="140" cy="88"  r="0" fill="#10b981" style={{animationDelay:'2.2s'}} />
                <circle className="dot-pop" cx="185" cy="80"  r="0" fill="#10b981" style={{animationDelay:'2.3s'}} />
                <circle className="dot-pop" cx="230" cy="72"  r="0" fill="#10b981" style={{animationDelay:'2.4s'}} />
                <circle className="dot-pop" cx="275" cy="55"  r="0" fill="#10b981" style={{animationDelay:'2.5s'}} />

                {/* Line 3: New Schools (Purple) — animated draw */}
                <path className="line-draw line-purple"
                  d="M50,138 Q95,124 140,116 T230,105 T275,95"
                  fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
                <circle className="dot-pop" cx="50"  cy="138" r="0" fill="#8b5cf6" style={{animationDelay:'2.3s'}} />
                <circle className="dot-pop" cx="95"  cy="124" r="0" fill="#8b5cf6" style={{animationDelay:'2.4s'}} />
                <circle className="dot-pop" cx="140" cy="116" r="0" fill="#8b5cf6" style={{animationDelay:'2.5s'}} />
                <circle className="dot-pop" cx="185" cy="110" r="0" fill="#8b5cf6" style={{animationDelay:'2.6s'}} />
                <circle className="dot-pop" cx="230" cy="105" r="0" fill="#8b5cf6" style={{animationDelay:'2.7s'}} />
                <circle className="dot-pop" cx="275" cy="95"  r="0" fill="#8b5cf6" style={{animationDelay:'2.8s'}} />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-[11px] pt-1 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rotate-45 bg-purple-500"></span>
                <span className="text-gray-600 font-medium">New Schools</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rotate-45 bg-blue-600"></span>
                <span className="text-gray-600 font-medium">New Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rotate-45 bg-emerald-500"></span>
                <span className="text-gray-600 font-medium">New Teachers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity with Tabs */}
        <Card className="border-gray-200/80 shadow-sm bg-white">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-base font-bold text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Tabs defaultValue="all" className="w-full">
              {/* Tab Navigation buttons */}
              <TabsList className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg text-xs font-medium mb-4">
                <TabsTrigger value="all" className="px-3 py-1.5 rounded-md text-xs">All</TabsTrigger>
                <TabsTrigger value="school-admin" className="px-3 py-1.5 rounded-md text-xs">School Admin</TabsTrigger>
                <TabsTrigger value="registration" className="px-3 py-1.5 rounded-md text-xs">Registration</TabsTrigger>
                <TabsTrigger value="teacher-registration" className="px-3 py-1.5 rounded-md text-xs">Teacher Reg.</TabsTrigger>
                <TabsTrigger value="approval" className="px-3 py-1.5 rounded-md text-xs">Approval</TabsTrigger>
              </TabsList>

              {/* All Activities */}
              <TabsContent value="all" className="space-y-3 mt-0">
                {/* Activity 1 */}
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Delhi Public School was approved</p>
                      <p className="text-[11px] text-gray-500">School registration approved by Super Admin</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">10 minutes ago</span>
                </div>

                {/* Activity 2 */}
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <School className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">New school registration received</p>
                      <p className="text-[11px] text-gray-500">ABC International School has applied for registration</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">25 minutes ago</span>
                </div>

                {/* Activity 3 */}
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Admin account created</p>
                      <p className="text-[11px] text-gray-500">New admin created for Green Field School</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">1 hour ago</span>
                </div>

                {/* Activity 4 */}
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">School status changed</p>
                      <p className="text-[11px] text-gray-500">Sunrise School status changed to Active</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">2 hours ago</span>
                </div>

                {/* Activity 5 */}
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">New teacher registered</p>
                      <p className="text-[11px] text-gray-500">Rahul Sharma registered as teacher</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">3 hours ago</span>
                </div>
              </TabsContent>

              {/* School Admin Tab */}
              <TabsContent value="school-admin" className="space-y-3 mt-0">
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Admin account created</p>
                      <p className="text-[11px] text-gray-500">New admin created for Green Field School</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">1 hour ago</span>
                </div>
              </TabsContent>

              {/* Registration Tab */}
              <TabsContent value="registration" className="space-y-3 mt-0">
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <School className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">New school registration received</p>
                      <p className="text-[11px] text-gray-500">ABC International School has applied for registration</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">25 minutes ago</span>
                </div>
              </TabsContent>

              {/* Teacher Registration Tab */}
              <TabsContent value="teacher-registration" className="space-y-3 mt-0">
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">New teacher registered</p>
                      <p className="text-[11px] text-gray-500">Rahul Sharma registered as teacher</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">3 hours ago</span>
                </div>
              </TabsContent>

              {/* Approval Tab */}
              <TabsContent value="approval" className="space-y-3 mt-0">
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Delhi Public School was approved</p>
                      <p className="text-[11px] text-gray-500">School registration approved by Super Admin</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">10 minutes ago</span>
                </div>
              </TabsContent>
            </Tabs>

            <a href="#activity" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 pt-1 inline-block">
              View all activity <ArrowRight className="h-3.5 w-3.5 inline" />
            </a>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-gray-200/80 shadow-sm bg-white flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                <ShieldCheck className="h-5 w-5 text-gray-700" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Banner */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">All Systems Operational</p>
                  <p className="text-[11px] text-emerald-700">Everything is running smoothly</p>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-800">API Server</span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                    Healthy <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-800">Database</span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                    Healthy <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-800">Storage</span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                    Healthy <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Card Footer: Server Uptime & Database Size */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 font-medium">Server Uptime</span>
              <span className="ml-3 font-bold text-indigo-700">{stats.serverUptime}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Database Size</span>
              <span className="ml-3 font-bold text-indigo-700">{stats.databaseSize}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}