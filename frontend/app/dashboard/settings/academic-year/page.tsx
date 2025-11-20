'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';

export default function AcademicYearPage() {
  const [years, setYears] = useState([
    {
      id: '1',
      name: '2024-2025',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'active',
      terms: 2,
    },
    {
      id: '2',
      name: '2023-2024',
      startDate: '2023-04-01',
      endDate: '2024-03-31',
      status: 'completed',
      terms: 2,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Year Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure academic years and terms</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Academic Year
        </Button>
      </div>

      {/* Current Academic Years */}
      <div className="space-y-3">
        {years.map((year) => (
          <Card key={year.id} className={year.status === 'active' ? 'border-2 border-blue-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{year.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      year.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {year.status.charAt(0).toUpperCase() + year.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{year.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{year.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Terms</p>
                      <p className="font-medium">{year.terms} Terms</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {year.status !== 'active' && (
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Year Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Academic Year</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearName">Year Name</Label>
              <Input id="yearName" placeholder="e.g., 2025-2026" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Number of Terms</Label>
              <Input id="terms" type="number" defaultValue="2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" placeholder="Add notes about this academic year..." rows={3} />
          </div>

          <div className="flex gap-2">
            <Button>Create Academic Year</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
