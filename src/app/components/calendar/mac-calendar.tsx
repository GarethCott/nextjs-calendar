'use client';

import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import { useState } from 'react';

import { AddEventDialog } from '@/app/components/calendar/add-event-dialog';

import { CalendarGrid } from './calendar-grid';
import { CalendarHeader } from './calendar-header';
import { CalendarSidebar } from './calendar-sidebar';
import { EventDialog } from './event-dialog';
import { Calendar, CalendarView, Event } from './types';

const sampleEvents: Event[] = [
  {
    id: '1',
    date: '2024-11-28',
    title: 'Digital Stand-up',
    time: '09:00',
    description: 'Daily team sync',
    type: 'work',
    recurrence: 'daily',
  },
  {
    id: '2',
    date: '2024-11-28',
    endDate: '2024-11-30',
    title: 'Tech Conference',
    time: '09:00',
    description: 'Annual tech conference',
    type: 'work',
  },
  {
    id: '3',
    date: '2024-11-29',
    title: 'UI Design Review',
    time: '11:15',
    description: 'Review latest UI mockups',
    type: 'work',
  },
  {
    id: '4',
    date: '2024-11-30',
    title: 'Family Dinner',
    time: '18:00',
    description: 'Monthly family gathering',
    type: 'family',
    recurrence: 'monthly',
  },
  {
    id: '5',
    date: '2024-11-30',
    title: 'Project Planning',
    time: '14:30',
    description: 'Q4 project roadmap',
    type: 'work',
  },
];

const sampleCalendars: Calendar[] = [
  {
    id: '1',
    name: 'Work',
    color: '#2563eb',
    isVisible: true,
    type: 'work',
    settings: {
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: [1, 2, 3, 4, 5], // Monday to Friday
      },
      timezone: 'UTC',
    },
  },
  {
    id: '2',
    name: 'Personal',
    color: '#16a34a',
    isVisible: true,
    type: 'personal',
  },
  {
    id: '3',
    name: 'Family',
    color: '#9333ea',
    isVisible: true,
    type: 'shared',
  },
];

export function MacOSCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [calendars] = useState<Calendar[]>(sampleCalendars);
  const [view, setView] = useState<CalendarView>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    date: format(currentDate, 'yyyy-MM-dd'),
    title: '',
    time: '',
    description: '',
    type: 'personal',
    recurrence: 'none',
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    const eventToAdd = { ...newEvent, id } as Event;
    setEvents((prev) => [...prev, eventToAdd]);
    setNewEvent({
      date: format(currentDate, 'yyyy-MM-dd'),
      title: '',
      time: '',
      description: '',
      type: 'personal',
      recurrence: 'none',
    });
    setIsAddEventOpen(false);
  };

  const handleEditEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
    setIsEditEventOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    setIsEditEventOpen(false);
    setEditingEvent(null);
  };

  const handleEventDrop = (event: Event, date: Date) => {
    if (event.recurrence && event.recurrence !== 'none') {
      const originalEvent = events.find((e) => e.id === event.id.split('-')[0]);
      if (!originalEvent) return;

      const oldDate = parseISO(originalEvent.date);
      const daysDifference = differenceInDays(date, oldDate);
      const newTime = format(date, 'HH:mm');

      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === originalEvent.id) {
            const eventDate = parseISO(e.date);
            const newDate = addDays(eventDate, daysDifference);
            return {
              ...e,
              date: format(newDate, 'yyyy-MM-dd'),
              time: newTime,
            };
          }
          return e;
        }),
      );
    } else {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              date: format(date, 'yyyy-MM-dd'),
              time: format(date, 'HH:mm'),
            };
          }
          return e;
        }),
      );
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='flex flex-col h-full bg-background text-foreground'>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        setCurrentDate={setCurrentDate}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddEventClick={() => setIsAddEventOpen(true)}
      />

      <div className='flex flex-1 overflow-hidden'>
        <CalendarSidebar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />

        <CalendarGrid
          view={view}
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={(event) => {
            setEditingEvent(event);
            setIsEditEventOpen(true);
          }}
          onEventDrop={handleEventDrop}
        />
      </div>

      <AddEventDialog
        isOpen={isAddEventOpen}
        onClose={() => {
          setIsAddEventOpen(false);
          setNewEvent({
            date: format(currentDate, 'yyyy-MM-dd'),
            title: '',
            time: '',
            description: '',
            type: 'personal',
            recurrence: 'none',
          });
        }}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        onSubmit={handleAddEvent}
        calendars={calendars}
        events={events}
      />

      <EventDialog
        event={editingEvent}
        isOpen={isEditEventOpen}
        onClose={() => {
          setIsEditEventOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleEditEvent}
        onDelete={handleDeleteEvent}
        calendars={calendars}
        events={events}
      />
    </div>
  );
}

export default MacOSCalendar;
