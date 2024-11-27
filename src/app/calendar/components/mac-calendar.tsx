'use client';

import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import * as React from 'react';

import { AddEventDialog } from '@/app/calendar/components/add-event-dialog';

import { CalendarGrid } from './calendar-grid';
import { CalendarHeader } from './calendar-header';
import { CalendarSidebar } from './calendar-sidebar';
import { EventDialog } from './event-dialog';
import { Calendar, CalendarView, Event } from './types';

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    type: 'work',
    description: 'Weekly team sync',
    tags: ['meeting', 'team'],
  },
  {
    id: '2',
    title: 'Project Review',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '14:00',
    type: 'work',
    description: 'Review Q1 project progress',
    tags: ['meeting', 'project'],
  },
  {
    id: '3',
    title: 'Family Dinner',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '18:00',
    type: 'family',
    description: 'Dinner with family',
    tags: ['family', 'dinner'],
  },
];

const sampleCalendars: Calendar[] = [
  {
    id: '1',
    name: 'Work',
    color: '#2563eb',
    isVisible: true,
    type: 'work',
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
    type: 'personal',
  },
];

export function MacOSCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [events, setEvents] = React.useState<Event[]>(sampleEvents);
  const [calendars, setCalendars] = React.useState<Calendar[]>(sampleCalendars);
  const [view, setView] = React.useState<CalendarView>('month');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [customTags, setCustomTags] = React.useState<string[]>([]);

  // Initialize with some default tags if needed
  const defaultTags = React.useMemo(
    () => ['work', 'personal', 'important', 'meeting'],
    [],
  );

  // Get unique tags from all events, custom tags, and default tags
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>([...defaultTags]);
    events.forEach((event) => {
      event.tags?.forEach((tag) => tagSet.add(tag));
    });
    customTags.forEach((tag) => tagSet.add(tag));
    return Array.from(tagSet);
  }, [events, customTags, defaultTags]);

  const handleCalendarVisibilityChange = (
    calendarId: string,
    isVisible: boolean,
  ) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar) =>
        calendar.id === calendarId ? { ...calendar, isVisible } : calendar,
      ),
    );
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleTagCreate = (newTag: string) => {
    if (!customTags.includes(newTag)) {
      setCustomTags((prev) => [...prev, newTag]);
    }
  };

  // Filter events based on visible calendars and selected tags
  const filteredEvents = events.filter((event) => {
    // Filter by search query
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by calendar visibility
    const calendar = calendars.find((c) => c.type === event.type);
    const isCalendarVisible = calendar?.isVisible ?? true;

    // Filter by tags
    const matchesTags =
      selectedTags.length === 0 ||
      (event.tags && event.tags.some((tag) => selectedTags.includes(tag)));

    return matchesSearch && isCalendarVisible && matchesTags;
  });

  const [newEvent, setNewEvent] = React.useState<Omit<Event, 'id'>>({
    date: format(currentDate, 'yyyy-MM-dd'),
    title: '',
    time: format(new Date(), 'HH:mm'),
    type: 'personal',
    description: '',
    recurrence: 'none',
    tags: [],
    attendees: [],
    reminders: [],
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
      tags: [],
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
          calendars={calendars}
          onCalendarVisibilityChange={handleCalendarVisibilityChange}
          selectedTags={selectedTags}
          availableTags={allTags}
          onTagSelect={handleTagSelect}
          onTagCreate={handleTagCreate}
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
            tags: [],
          });
        }}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        onSubmit={handleAddEvent}
        calendars={calendars}
        events={events}
        availableTags={allTags}
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
        availableTags={allTags}
      />
    </div>
  );
}

export default MacOSCalendar;
