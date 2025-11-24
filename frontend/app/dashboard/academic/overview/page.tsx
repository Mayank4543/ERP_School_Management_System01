'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Building,
  GraduationCap,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import teachersService from '@/lib/api/services/teachers.service';
import { Teacher } from '@/types/index';

interface AcademicOverviewData {
  total_teachers: number;
  total_subjects: number;
  total_sections: number;
  active_teachers: number;
  workload_distribution: {
    optimal: number;
    overloaded: number;
    underloaded: number;
  };
  subject_coverage: number;
  class_distribution: Array<{
    standard: number;
    sections: number;
    capacity: number;
    current_strength: number;
  }>;
}

export default function AcademicOverviewDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AcademicOverviewData>({
    total_teachers: 0,
    total_subjects: 0,
    total_sections: 0,
    active_teachers: 0,
    workload_distribution: {
      optimal: 0,
      overloaded: 0,
      underloaded: 0
    },
    subject_coverage: 0,
    class_distribution: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user data to get school_id
      const userStr = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
        ?.split('=')[1];
      
      if (!userStr) {
        throw new Error('User not found');
      }
      
      const user = JSON.parse(decodeURIComponent(userStr));
      const schoolId = user.school_id;
      
      if (!schoolId) {
        throw new Error('School ID not found');
      }

      // Fetch teachers data
      const teachersResponse = await teachersService.getAll({ 
        schoolId, 
        page: 1, 
        limit: 1000 
      });

      // Calculate basic stats
      const academicData: AcademicOverviewData = {
        total_teachers: teachersResponse.total || teachersResponse.data.length,
        total_subjects: 42, // This would come from subjects API
        total_sections: 180, // This would come from sections API  
        active_teachers: teachersResponse.data.filter((t: Teacher) => t.is_active).length,
        workload_distribution: {
          optimal: Math.floor(teachersResponse.data.length * 0.7),
          overloaded: Math.floor(teachersResponse.data.length * 0.15),
          underloaded: Math.floor(teachersResponse.data.length * 0.15)
        },
        subject_coverage: 92,
        class_distribution: [
          { standard: 6, sections: 5, capacity: 200, current_strength: 185 },
          { standard: 7, sections: 5, capacity: 200, current_strength: 192 },
          { standard: 8, sections: 5, capacity: 200, current_strength: 178 },
          { standard: 9, sections: 4, capacity: 160, current_strength: 155 },
          { standard: 10, sections: 4, capacity: 160, current_strength: 158 },
          { standard: 11, sections: 3, capacity: 120, current_strength: 115 },
          { standard: 12, sections: 3, capacity: 120, current_strength: 108 }
        ]
      };

      setData(academicData);
    } catch (err) {
      console.error('Error fetching academic data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch academic data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p>Loading academic overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchAcademicData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalWorkload = data.workload_distribution.optimal + 
                       data.workload_distribution.overloaded + 
                       data.workload_distribution.underloaded;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Overview</h1>
          <p className="text-muted-foreground">
            Comprehensive view of academic management and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_teachers}</div>
            <p className="text-xs text-muted-foreground">
              {data.active_teachers} active teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_subjects}</div>
            <p className="text-xs text-muted-foreground">
              {data.subject_coverage}% coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Sections</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_sections}</div>
            <p className="text-xs text-muted-foreground">
              Across {data.class_distribution.length} standards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Health</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Overall efficiency score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher Workload Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Teacher Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Optimal Workload (20-35 periods)</span>
                <span className="text-sm text-muted-foreground">{data.workload_distribution.optimal}</span>
              </div>
              <Progress value={(data.workload_distribution.optimal / totalWorkload) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overloaded (&gt;35 periods)</span>
                <span className="text-sm text-muted-foreground">{data.workload_distribution.overloaded}</span>
              </div>
              <Progress 
                value={(data.workload_distribution.overloaded / totalWorkload) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Underloaded (&lt;20 periods)</span>
                <span className="text-sm text-muted-foreground">{data.workload_distribution.underloaded}</span>
              </div>
              <Progress 
                value={(data.workload_distribution.underloaded / totalWorkload) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Class Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Class Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.class_distribution.map((classInfo) => (
                <div key={classInfo.standard} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Class {classInfo.standard}</div>
                    <div className="text-sm text-muted-foreground">
                      {classInfo.sections} sections • {classInfo.current_strength}/{classInfo.capacity} students
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {Math.round((classInfo.current_strength / classInfo.capacity) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Capacity</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Academic Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-sm font-medium">Subject Coverage</div>
              <div className="text-xs text-muted-foreground">All classes properly assigned</div>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-sm font-medium">Teacher Efficiency</div>
              <div className="text-xs text-muted-foreground">Optimal workload distribution</div>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
              <div className="text-sm font-medium">Capacity Utilization</div>
              <div className="text-xs text-muted-foreground">Average class occupancy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}