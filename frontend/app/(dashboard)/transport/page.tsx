'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, MapPin, Users, Edit, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TransportPage() {
  const routes = [
    {
      id: '1',
      name: 'Route 1 - North',
      vehicleNo: 'DL-01-AB-1234',
      driver: 'Ramesh Kumar',
      driverPhone: '+91 98765 43210',
      capacity: 50,
      students: 45,
      stops: ['Connaught Place', 'Karol Bagh', 'Rajendra Place', 'School'],
      startTime: '7:00 AM',
      fee: 2000,
    },
    {
      id: '2',
      name: 'Route 2 - South',
      vehicleNo: 'DL-01-CD-5678',
      driver: 'Suresh Singh',
      driverPhone: '+91 98765 43211',
      capacity: 50,
      students: 42,
      stops: ['Nehru Place', 'Kalkaji', 'Greater Kailash', 'School'],
      startTime: '7:15 AM',
      fee: 2200,
    },
    {
      id: '3',
      name: 'Route 3 - East',
      vehicleNo: 'DL-01-EF-9012',
      driver: 'Vijay Sharma',
      driverPhone: '+91 98765 43212',
      capacity: 50,
      students: 38,
      stops: ['Laxmi Nagar', 'Preet Vihar', 'Mayur Vihar', 'School'],
      startTime: '7:30 AM',
      fee: 1800,
    },
  ];

  const stats = {
    totalRoutes: routes.length,
    totalVehicles: routes.length,
    totalStudents: routes.reduce((acc, r) => acc + r.students, 0),
    totalCapacity: routes.reduce((acc, r) => acc + r.capacity, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transport Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage school transportation routes and vehicles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/transport/vehicles">Manage Vehicles</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/transport/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Route
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoutes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Bus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Using Transport</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500">of {stats.totalCapacity} capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((stats.totalStudents / stats.totalCapacity) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route) => {
          const occupancyRate = Math.round((route.students / route.capacity) * 100);
          
          return (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bus className="h-5 w-5 text-blue-600" />
                      {route.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Vehicle: {route.vehicleNo}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    occupancyRate > 90 ? 'bg-red-100 text-red-700' : 
                    occupancyRate > 70 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {occupancyRate}% Full
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="font-medium">{route.driver}</p>
                      <p className="text-sm text-gray-500">{route.driverPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="text-xl font-bold text-blue-600">{route.students}/{route.capacity}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Route Stops</p>
                    <div className="flex flex-wrap gap-2">
                      {route.stops.map((stop, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 rounded text-sm">
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p className="font-medium">{route.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Fee</p>
                      <p className="font-medium text-green-600">₹{route.fee}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/transport/${route.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/transport/${route.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
