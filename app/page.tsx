'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Add custom styles for the calendar
const calendarStyles = `
  .rbc-calendar {
    font-size: 16px;
    position: relative;
    z-index: 1;
  }
  .rbc-header {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    padding: 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .rbc-date-cell {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    padding: 8px;
  }
  .rbc-today {
    background-color: #f3f4f6;
    font-weight: 700;
  }
  .rbc-current {
    color: #2563eb;
    font-weight: 700;
  }
  .rbc-off-range {
    color: #9ca3af;
  }
  .rbc-event {
    font-size: 16px;
    font-weight: 600;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    background-color: #2563eb;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 2px 0;
  }
  .rbc-event-content {
    font-weight: 600;
    line-height: 1.4;
  }
  .rbc-event-label {
    font-weight: 600;
    margin-right: 4px;
  }
  .rbc-event-overlap {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .rbc-selected {
    background-color: #1d4ed8;
  }
  .rbc-time-header {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
  .rbc-time-header-content {
    font-size: 16px;
    font-weight: 600;
  }
  .rbc-time-content {
    font-size: 16px;
    font-weight: 600;
  }
  .rbc-time-slot {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
  .rbc-timeslot-group {
    border-bottom: 1px solid #e5e7eb;
  }
  .rbc-time-view {
    border: 1px solid #e5e7eb;
  }
  .rbc-time-header-cell {
    font-weight: 600;
  }
  .rbc-time-content > * + * > * {
    border-left: 1px solid #e5e7eb;
  }
  .rbc-toolbar {
    margin-bottom: 24px;
  }
  .rbc-toolbar button {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
  }
  .rbc-toolbar button:hover {
    background-color: #f3f4f6;
  }
  .rbc-toolbar button.rbc-active {
    background-color: #2563eb;
    color: white;
    border-color: #2563eb;
  }
  .rbc-toolbar-label {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
  }
  
  /* Agenda View Styles */
  .rbc-agenda-view {
    font-size: 16px;
    color:black;
  }
  .rbc-agenda-view table.rbc-agenda-table {
    border-collapse: separate;
    border-spacing: 0 8px;
  }
  .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
    padding: 12px;
    vertical-align: middle;
  }
  .rbc-agenda-time-cell {
    font-weight: 600;
    color: #1f2937;
    font-size: 16px;
  }
  .rbc-agenda-date-cell {
    font-weight: 600;
    color: #1f2937;
    font-size: 16px;
  }
  .rbc-agenda-event-cell {
    font-size: 16px;
    color:black;
  }
  .rbc-agenda-event-cell .rbc-event {
    background-color: #2563eb;
    color: black;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .rbc-agenda-event-cell .rbc-event-content {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
    color:black;
  }
  .rbc-agenda-event-cell .rbc-event-label {
    font-weight: 700;
    margin-right: 8px;
    font-size: 18px;
  }
  .rbc-agenda-event-cell .rbc-event-time {
    font-weight: 600;
    margin-right: 12px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }
  .rbc-agenda-event-cell .rbc-event-title {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 4px;
  }
  .rbc-agenda-event-cell .rbc-event-description {
    font-size: 16px;
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  .rbc-agenda-event-cell .rbc-event-location {
    font-size: 16px;
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  .rbc-agenda-event-cell .rbc-event-attendees {
    font-size: 16px;
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  .rbc-agenda-event-cell .rbc-event-content > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

// Types
type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  attendees: Attendee[];
  maxAttendees?: number;
};

type Attendee = {
  id: string;
  name: string;
  avatar: string;
  status: 'going' | 'maybe' | 'not_going';
};

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Building Workshop',
    start: new Date(2025, 4, 3, 10, 0),
    end: new Date(2025, 4, 3, 16, 0),
    description: 'Team building activities and workshops to improve collaboration',
    location: 'Conference Room A',
    attendees: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'going' },
      { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'maybe' },
    ],
    maxAttendees: 20,
  },
  {
    id: '2',
    title: 'Project Kickoff Meeting',
    start: new Date(2025, 4, 4, 14, 0),
    end: new Date(2025, 4, 4, 16, 0),
    description: 'Initial meeting for the new project launch',
    location: 'Virtual Meeting',
    attendees: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'going' },
      { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'going' },
    ],
  },
  {
    id: '3',
    title: 'Client Presentation',
    start: new Date(2025, 4, 5, 9, 30),
    end: new Date(2025, 4, 5, 11, 30),
    description: 'Quarterly progress presentation for major client',
    location: 'Main Conference Hall',
    attendees: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'going' },
      { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'going' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'maybe' },
    ],
  },
  {
    id: '4',
    title: 'Team Lunch',
    start: new Date(2025, 4, 6, 12, 0),
    end: new Date(2025, 4, 6, 13, 30),
    description: 'Monthly team lunch at the new restaurant',
    location: 'Downtown Bistro',
    attendees: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'going' },
      { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'going' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'going' },
    ],
  },
  {
    id: '5',
    title: 'Training Session',
    start: new Date(2025, 4, 7, 10, 0),
    end: new Date(2025, 4, 7, 15, 0),
    description: 'New software tools training session',
    location: 'Training Room B',
    attendees: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'maybe' },
      { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'going' },
    ],
  }
];

const mockUsers = [
  { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
];

// Calendar setup
const localizer = momentLocalizer(moment);

export default function Home() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
    location: '',
    attendees: [],
  });

  // Event handlers
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        start: newEvent.start as Date,
        end: newEvent.end as Date,
        description: newEvent.description || '',
        location: newEvent.location || '',
        attendees: [],
      };
      setEvents([...events, event]);
      setShowNewEventModal(false);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
        location: '',
        attendees: [],
      });
    }
  };

  const handleRSVP = (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const updatedAttendees = [...event.attendees];
        const existingAttendee = updatedAttendees.find(a => a.id === '1'); // Assuming current user is ID 1
        if (existingAttendee) {
          existingAttendee.status = status;
        } else {
          updatedAttendees.push({
            id: '1',
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            status,
          });
        }
        return { ...event, attendees: updatedAttendees };
      }
      return event;
    }));
  };

  // Calculate attendance statistics
  const attendanceStats = events.map(event => ({
    name: event.title,
    going: event.attendees.filter(a => a.status === 'going').length,
    maybe: event.attendees.filter(a => a.status === 'maybe').length,
    notGoing: event.attendees.filter(a => a.status === 'not_going').length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{calendarStyles}</style>
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Group Event Planner</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowNewEventModal(true)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg z-1 shadow p-6">
              <h2 className="text-2xl font-bold z-1 text-gray-800 mb-4">Event Calendar</h2>
              <div className="h-[600px] z-1">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  style={{ height: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendance Overview</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fill='#cccccc' className='z-10'/>
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="going" fill="#10B981" name="Going" />
                    <Bar dataKey="maybe" fill="#F59E0B" name="Maybe" />
                    <Bar dataKey="notGoing" fill="#EF4444" name="Not Going" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 relative"
            >
              <h2 className="text-3xl font-bold z-1 text-gray-900 mb-6">{selectedEvent.title}</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="text-lg font-semibold text-gray-800 min-w-[100px]">Time:</span>
                  <p className="text-lg text-gray-800">
                    {moment(selectedEvent.start).format('MMMM D, YYYY h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-lg font-semibold text-gray-800 min-w-[100px]">Location:</span>
                  <p className="text-lg text-gray-800">{selectedEvent.location}</p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-lg font-semibold text-gray-800 min-w-[100px]">Description:</span>
                  <p className="text-lg text-gray-800">{selectedEvent.description}</p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-lg font-semibold text-gray-800 min-w-[100px]">Attendees:</span>
                  <div className="flex flex-wrap gap-3">
                    {selectedEvent.attendees.map(attendee => (
                      <div key={attendee.id} className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                        <img src={attendee.avatar} alt={attendee.name} className="w-8 h-8 rounded-full" />
                        <span className="text-lg font-medium text-gray-800">{attendee.name}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          attendee.status === 'going' ? 'bg-green-100 text-green-800' :
                          attendee.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {attendee.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={() => handleRSVP(selectedEvent.id, 'going')}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-semibold"
                  >
                    Going
                  </button>
                  <button
                    onClick={() => handleRSVP(selectedEvent.id, 'maybe')}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-lg font-semibold"
                  >
                    Maybe
                  </button>
                  <button
                    onClick={() => handleRSVP(selectedEvent.id, 'not_going')}
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-lg font-semibold"
                  >
                    Not Going
                  </button>
                 
                </div>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Event Modal */}
      <AnimatePresence>
        {showNewEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Event</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 text-lg px-4 py-2"
                    placeholder="Enter event title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Start Time</label>
                    <input
                      type="datetime-local"
                      value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 text-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">End Time</label>
                    <input
                      type="datetime-local"
                      value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 text-lg px-4 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 text-lg px-4 py-2"
                    placeholder="Enter event location"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 text-lg px-4 py-2"
                    rows={4}
                    placeholder="Enter event description"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  Create Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500">
            © 2024 Group Event Planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
