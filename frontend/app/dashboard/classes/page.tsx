'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Users, GraduationCap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import sectionsService from '@/lib/api/services/sections.service';
import academicService from '@/lib/api/services/academic.service';
import { Section } from '@/types/academic';
import { toast } from 'sonner';

interface ClassInfo {
  standard: number;
  sections: Section[];
  totalStudents: number;
  classTeacher?: string;
}

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.school_id) {
      loadClassesData();
    }
  }, [user?.school_id]);

  const loadClassesData = async () => {
    if (!user?.school_id) return;

    try {
      setLoading(true);

      // Get current academic year
      const currentAcademicYear = await academicService.getCurrent();

      // Fetch all sections
      const sectionsData = await sectionsService.getAll({
        schoolId: user.school_id,
        academicYearId: currentAcademicYear._id,
        page: 1,
        limit: 1000
      });

      // Group sections by standard
      const classesMap = new Map<number, ClassInfo>();

      if (sectionsData.data && Array.isArray(sectionsData.data)) {
        sectionsData.data.forEach((section: Section) => {
          if (!classesMap.has(section.standard)) {
            classesMap.set(section.standard, {
              standard: section.standard,
              sections: [],
              totalStudents: 0,
            });
          }

          const classInfo = classesMap.get(section.standard)!;
          classInfo.sections.push(section);
          classInfo.totalStudents += section.current_strength;

          // Use first class teacher found as representative
          if (!classInfo.classTeacher && section.class_teacher_id) {
            classInfo.classTeacher = 'Assigned'; // We could populate actual names with another API call
          }
        });
      }

      const classesArray = Array.from(classesMap.values())
        .sort((a, b) => a.standard - b.standard);

      setClasses(classesArray);
    } catch (error: any) {
      console.error('Failed to load classes data:', error);
      toast.error('Failed to load classes data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Classes & Sections</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage school classes and sections</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/classes/standards">
              <GraduationCap className="mr-2 h-4 w-4" />
              Manage Standards
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/academic/sections">
              <Plus className="mr-2 h-4 w-4" />
              Add New Section
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, c) => acc + c.sections.length, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, c) => acc + c.totalStudents, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.length > 0 ? Math.round(classes.reduce((acc, c) => acc + c.totalStudents, 0) / classes.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      {classes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Classes Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create sections to establish classes for your school.</p>
            <Button asChild>
              <Link href="/dashboard/academic/sections">
                <Plus className="h-4 w-4 mr-2" />
                Create First Section
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.standard} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Class {classItem.standard}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/academic/sections?standard=${classItem.standard}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/classes/standards`}>
                        <GraduationCap className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Sections</p>
                    <div className="flex gap-2 mt-1">
                      {classItem.sections.map((section) => (
                        <div
                          key={section._id}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-md"
                        >
                          Section {section.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Total Students</p>
                      <p className="text-xl font-bold text-blue-600">{classItem.totalStudents}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{classItem.classTeacher || 'No Teacher'}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/classes/standards?standard=${classItem.standard}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
