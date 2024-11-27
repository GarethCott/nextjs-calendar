'use client';

import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  parseISO,
  setHours,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ScrollArea } from '@/components/ui/scroll-area';

import { AgendaView } from './agenda-view';
import { CalendarView, Event, eventColors } from './types';

interface CalendarGridProps {
  view: CalendarView;
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventDrop: (event: Event, date: Date) => void;
}

export function CalendarGrid({
  view,
  currentDate,
  events,
  onEventClick,
  onEventDrop,
}: CalendarGridProps) {
  const [draggedEventId, setDraggedEventId] = React.useState<string | null>(
    null,
  );

  const getDaysInWeek = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const getHoursInDay = () => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (draggedEventId) {
      const originalId = draggedEventId.split('-')[0];
      const originalEvent = events.find((event) => event.id === originalId);

      if (originalEvent) {
        const updatedEvent = {
          ...originalEvent,
          date: format(date, 'yyyy-MM-dd'),
          time: view === 'month' ? originalEvent.time : format(date, 'HH:mm'),
        };
        onEventDrop(updatedEvent, date);
      }
    }
    setDraggedEventId(null);
  };

  const getEventInstances = (event: Event, start: Date, end: Date): Event[] => {
    const instances: Event[] = [];
    let currentDate = parseISO(event.date);

    // If it's not a recurring event, just return the original if it's in range
    if (!event.recurrence || event.recurrence === 'none') {
      if (isWithinInterval(currentDate, { start, end })) {
        return [event];
      }
      return [];
    }

    // For recurring events, generate instances
    while (isBefore(currentDate, end)) {
      if (!isBefore(currentDate, start)) {
        instances.push({
          ...event,
          date: format(currentDate, 'yyyy-MM-dd'),
          id: `${event.id}-${format(currentDate, 'yyyy-MM-dd')}`,
        });
      }

      // Calculate next occurrence based on recurrence type
      switch (event.recurrence) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
        case 'yearly':
          currentDate = addMonths(currentDate, 12);
          break;
        default:
          return instances;
      }
    }

    return instances;
  };

  const getEventsForView = (start: Date, end: Date): Event[] => {
    return events.flatMap((event) => {
      // Handle multi-day events
      if (event.endDate) {
        const eventStart = parseISO(event.date);
        const eventEnd = parseISO(event.endDate);
        if (
          isWithinInterval(eventStart, { start, end }) ||
          isWithinInterval(eventEnd, { start, end })
        ) {
          return [event];
        }
        return [];
      }

      // Handle recurring and single events
      return getEventInstances(event, start, end);
    });
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const viewEvents = getEventsForView(calendarStart, calendarEnd);

    return (
      <div className='grid grid-cols-7 h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='text-center p-2 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = viewEvents.filter((event) =>
            isSameDay(parseISO(event.date), day),
          );
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[100px] p-1 border-b border-r border-gray-200 dark:border-gray-700',
                !isSameMonth(day, currentDate) && 'bg-gray-50 dark:bg-gray-800',
                isToday(day) && 'bg-blue-50 dark:bg-blue-900',
              )}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, startOfDay(day))}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 mb-1 text-sm',
                  isToday(day) && 'bg-blue-500 text-white rounded-full',
                  !isSameMonth(day, currentDate) &&
                    'text-gray-400 dark:text-gray-500',
                )}
              >
                {format(day, 'd')}
              </div>
              <div className='space-y-1'>
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      'text-xs p-1 rounded-sm text-white cursor-pointer',
                      eventColors[event.type],
                    )}
                    onClick={() => onEventClick(event)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id)}
                  >
                    <div className='font-medium'>{event.time}</div>
                    <div className='truncate'>{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysInWeek();
    const hours = getHoursInDay();
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const relevantEvents = getEventsForView(weekStart, weekEnd);

    return (
      <div className='grid grid-cols-8 h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
        {/* Time column */}
        <div className='border-r border-gray-200 dark:border-gray-700'>
          <div className='h-12 border-b border-gray-200 dark:border-gray-700'></div>
          {hours.map((hour: number) => (
            <div
              key={hour}
              className='h-12 border-b border-gray-200 dark:border-gray-700 text-right pr-2 text-xs text-gray-500 dark:text-gray-400'
            >
              {format(setHours(new Date(), hour), 'h a')}
            </div>
          ))}
        </div>
        {/* Days columns */}
        {days.map((day: Date) => (
          <div
            key={day.toISOString()}
            className='border-r border-gray-200 dark:border-gray-700'
          >
            <div className='h-12 border-b border-gray-200 dark:border-gray-700 text-center p-2 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'>
              {format(day, 'EEE d')}
            </div>
            {hours.map((hour: number) => {
              const hourEvents = relevantEvents.filter(
                (event) =>
                  isSameDay(parseISO(event.date), day) &&
                  parseInt(event.time.split(':')[0]) === hour,
              );
              return (
                <div
                  key={hour}
                  className='h-12 border-b border-gray-200 dark:border-gray-700 p-1'
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) => handleDrop(e, setHours(day, hour))}
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'text-xs p-1 rounded-sm text-white cursor-pointer',
                        eventColors[event.type],
                      )}
                      onClick={() => onEventClick(event)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event.id)}
                    >
                      <div className='font-medium'>{event.time}</div>
                      <div className='truncate'>{event.title}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForView(
      startOfDay(currentDate),
      endOfDay(currentDate),
    );

    return (
      <div className='grid grid-cols-1 h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
        {hours.map((hour) => {
          const hourDate = setHours(currentDate, hour);
          const hourEvents = dayEvents.filter(
            (event) => parseInt(event.time.split(':')[0]) === hour,
          );
          return (
            <div
              key={hour}
              className='border-b border-gray-200 dark:border-gray-700 p-2'
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, hourDate)}
            >
              <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                {format(setHours(new Date(), hour), 'h a')}
              </div>
              {hourEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'text-sm p-2 rounded-sm text-white cursor-pointer mb-1',
                    eventColors[event.type],
                  )}
                  onClick={() => onEventClick(event)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event.id)}
                >
                  <div className='font-medium'>
                    {event.time} - {event.title}
                  </div>
                  <div className='text-xs'>{event.description}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const months = Array.from(
      { length: 12 },
      (_, i) => new Date(currentDate.getFullYear(), i, 1),
    );

    return (
      <div className='grid grid-cols-4 gap-4 p-4'>
        {months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const monthEvents = events.filter((event) =>
            isSameMonth(parseISO(event.date), month),
          );

          return (
            <div
              key={month.toISOString()}
              className='border border-gray-200 dark:border-gray-700 p-2 rounded-lg'
            >
              <div className='text-center text-sm font-medium mb-2'>
                {format(month, 'MMMM')}
              </div>
              <div className='grid grid-cols-7 gap-1'>
                {days.map((day) => {
                  const dayEvents = monthEvents.filter((event) =>
                    isSameDay(parseISO(event.date), day),
                  );
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        'text-center text-xs p-1',
                        isToday(day) && 'bg-blue-500 text-white rounded-full',
                        !isSameMonth(day, month) &&
                          'text-gray-300 dark:text-gray-500',
                        dayEvents.length > 0 &&
                          'bg-blue-100 dark:bg-blue-800 rounded-full',
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-auto bg-background'>
      <ScrollArea className='h-full p-4'>
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
        {view === 'year' && renderYearView()}
        {view === 'agenda' && (
          <AgendaView
            events={events}
            currentDate={currentDate}
            onEventClick={onEventClick}
          />
        )}
      </ScrollArea>
    </div>
  );
}
