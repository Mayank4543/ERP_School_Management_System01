'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react';

export default function EventsManagementPage() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Annual Sports Day',
      date: '2025-12-05',
      time: '09:00 AM',
      venue: 'School Ground',
      type: 'Sports',
      attendees: 500,
      description: 'Annual inter-house sports competition',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      date: '2025-11-20',
      time: '02:00 PM',
      venue: 'School Auditorium',
      type: 'Academic',
      attendees: 200,
      description: 'Quarterly PTM for all classes',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'Science Exhibition',
      date: '2025-11-10',
      time: '10:00 AM',
      venue: 'Science Lab',
      type: 'Academic',
      attendees: 150,
      description: 'Student science project showcase',
      status: 'completed',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage school events</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500 mt-1">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-gray-500 mt-1">Next 3 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-gray-500 mt-1">For upcoming events</p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id} className={event.status === 'completed' ? 'opacity-60' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {event.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      {event.type}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{event.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Venue</p>
                        <p className="font-medium">{event.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Attendees</p>
                        <p className="font-medium">{event.attendees}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm">View Details</Button>
                  {event.status === 'upcoming' && (
                    <>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Event Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input id="eventTitle" placeholder="e.g., Annual Day Celebration" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <select
                id="eventType"
                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
              >
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input id="eventDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventTime">Time</Label>
              <Input id="eventTime" type="time" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventVenue">Venue</Label>
              <Input id="eventVenue" placeholder="e.g., School Auditorium" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedAttendees">Expected Attendees</Label>
              <Input id="expectedAttendees" type="number" placeholder="e.g., 500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDescription">Description</Label>
            <Textarea
              id="eventDescription"
              placeholder="Provide event details..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button>Create Event</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
