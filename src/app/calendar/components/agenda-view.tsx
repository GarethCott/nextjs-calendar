'use client';

import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Tags, Users } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Event, eventColors } from './types';

interface AgendaViewProps {
  events: Event[];
  currentDate: Date;
  onEventClick: (event: Event) => void;
}

export function AgendaView({ events, onEventClick }: AgendaViewProps) {
  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseISO(`${a.date}T${a.time}`);
    const dateB = parseISO(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Group events by date
  const groupedEvents = sortedEvents.reduce(
    (groups, event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    },
    {} as Record<string, Event[]>,
  );

  return (
    <ScrollArea className='h-full'>
      <div className='p-4 space-y-6'>
        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date} className='space-y-2'>
            <div className='sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                {isSameDay(parseISO(date), new Date()) && (
                  <span className='text-sm font-normal text-muted-foreground'>
                    (Today)
                  </span>
                )}
              </h3>
            </div>
            <div className='space-y-2'>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'p-4 rounded-lg border transition-colors hover:bg-accent cursor-pointer',
                    event.isPrivate && 'opacity-75',
                  )}
                  onClick={() => onEventClick(event)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={cn(
                            'w-3 h-3 rounded-full',
                            eventColors[event.type],
                          )}
                        />
                        <h4 className='font-medium'>{event.title}</h4>
                        {event.priority && (
                          <span
                            className={cn('text-xs px-2 py-0.5 rounded-full', {
                              'bg-red-100 text-red-700':
                                event.priority === 'high',
                              'bg-yellow-100 text-yellow-700':
                                event.priority === 'medium',
                              'bg-green-100 text-green-700':
                                event.priority === 'low',
                            })}
                          >
                            {event.priority}
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-4 w-4' />
                          {event.time}
                          {event.endTime && ` - ${event.endTime}`}
                        </span>
                        {event.location && (
                          <span className='flex items-center gap-1'>
                            <MapPin className='h-4 w-4' />
                            {event.location}
                          </span>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <span className='flex items-center gap-1'>
                            <Users className='h-4 w-4' />
                            {event.attendees.length} attendee(s)
                          </span>
                        )}
                      </div>
                      {event.tags && event.tags.length > 0 && (
                        <div className='flex items-center gap-1 mt-2'>
                          <Tags className='h-4 w-4 text-muted-foreground' />
                          <div className='flex gap-1'>
                            {event.tags.map((tag) => (
                              <span
                                key={tag}
                                className='text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground'
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {event.weather && (
                      <div className='text-right text-sm text-muted-foreground'>
                        <div>{event.weather.temperature}°</div>
                        <div>{event.weather.condition}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
