'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, School, GraduationCap, DollarSign, BarChart3, Calendar } from 'lucide-react';

export default function GlobalAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const analyticsData = {
    overview: {
      totalRevenue: 2850000,
      totalUsers: 15420,
      totalSchools: 47,
      totalStudents: 12350,
      growthRate: 12.5
    },
    schoolPerformance: [
      { name: 'Elite Academy', students: 850, revenue: 425000, growth: 15.2 },
      { name: 'Prime School', students: 720, revenue: 380000, growth: 8.7 },
      { name: 'Excellence High', students: 650, revenue: 340000, growth: 22.1 },
      { name: 'Future Institute', students: 580, revenue: 290000, growth: -2.1 },
      { name: 'Global Academy', students: 520, revenue: 260000, growth: 18.5 }
    ],
    monthlyTrends: [
      { month: 'Jan', users: 12500, revenue: 2200000 },
      { month: 'Feb', users: 13200, revenue: 2350000 },
      { month: 'Mar', users: 14100, revenue: 2480000 },
      { month: 'Apr', users: 14800, revenue: 2620000 },
      { month: 'May', users: 15420, revenue: 2850000 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Global Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Cross-school insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.overview.growthRate}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% growth rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalSchools}</div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 new this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalStudents.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.1% enrollment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* School Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Performing Schools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.schoolPerformance.map((school, index) => (
              <div key={school.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{school.name}</h4>
                    <p className="text-sm text-gray-500">{school.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(school.revenue / 1000).toFixed(0)}K</p>
                  <div className={`flex items-center text-xs mt-1 ${
                    school.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {school.growth > 0 ? 
                      <TrendingUp className="h-3 w-3 mr-1" /> : 
                      <TrendingDown className="h-3 w-3 mr-1" />
                    }
                    {Math.abs(school.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Growth Trends (Last 5 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{month.month} 2024</div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-600">Users: </span>
                    <span className="font-medium">{month.users.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue: </span>
                    <span className="font-medium">${(month.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}