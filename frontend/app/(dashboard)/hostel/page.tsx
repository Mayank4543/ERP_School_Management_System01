'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Bed, DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';

export default function HostelPage() {
  const hostels = [
    {
      id: '1',
      name: 'Boys Hostel - Block A',
      type: 'Boys',
      totalRooms: 50,
      occupiedRooms: 45,
      totalBeds: 100,
      occupiedBeds: 85,
      fee: 5000,
      warden: 'Mr. Ramesh Kumar',
      phone: '+91 98765 43210',
    },
    {
      id: '2',
      name: 'Girls Hostel - Block B',
      type: 'Girls',
      totalRooms: 40,
      occupiedRooms: 38,
      totalBeds: 80,
      occupiedBeds: 72,
      fee: 5000,
      warden: 'Ms. Sunita Sharma',
      phone: '+91 98765 43211',
    },
  ];

  const stats = {
    totalHostels: hostels.length,
    totalRooms: hostels.reduce((acc, h) => acc + h.totalRooms, 0),
    occupiedRooms: hostels.reduce((acc, h) => acc + h.occupiedRooms, 0),
    totalStudents: hostels.reduce((acc, h) => acc + h.occupiedBeds, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hostel Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage hostel facilities and student allocation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/hostel/rooms">Manage Rooms</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/hostel/allocate">
              <Plus className="mr-2 h-4 w-4" />
              Allocate Room
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHostels}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalRooms}</div>
            <p className="text-xs text-gray-500">{stats.occupiedRooms} occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hostels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hostels.map((hostel) => {
          const roomOccupancy = Math.round((hostel.occupiedRooms / hostel.totalRooms) * 100);
          const bedOccupancy = Math.round((hostel.occupiedBeds / hostel.totalBeds) * 100);

          return (
            <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      {hostel.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{hostel.type} Hostel</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    roomOccupancy > 90 ? 'bg-red-100 text-red-700' : 
                    roomOccupancy > 70 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {roomOccupancy}% Occupied
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <p className="text-sm text-gray-500">Rooms</p>
                      <p className="text-xl font-bold text-blue-600">
                        {hostel.occupiedRooms}/{hostel.totalRooms}
                      </p>
                      <p className="text-xs text-gray-500">{hostel.totalRooms - hostel.occupiedRooms} available</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="text-xl font-bold text-green-600">
                        {hostel.occupiedBeds}/{hostel.totalBeds}
                      </p>
                      <p className="text-xs text-gray-500">{hostel.totalBeds - hostel.occupiedBeds} beds free</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Warden</p>
                      <p className="font-medium">{hostel.warden}</p>
                      <p className="text-sm text-gray-500">{hostel.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Fee</p>
                      <p className="text-xl font-bold text-green-600">₹{hostel.fee}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/hostel/${hostel.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/hostel/${hostel.id}/allocate`}>Allocate Room</Link>
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
