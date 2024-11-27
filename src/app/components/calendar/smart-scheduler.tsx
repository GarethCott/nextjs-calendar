'use client';

import { addMinutes, format, parse, setHours, setMinutes } from 'date-fns';
import { AlertCircle, Clock, Users } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import { Calendar, Event } from './types';

interface SmartSchedulerProps {
  calendars: Calendar[];
  events: Event[];
  onTimeSelect: (startTime: Date) => void;
  requiredAttendees: string[];
  optionalAttendees: string[];
}

interface TimeSlot {
  startTime: Date;
  score: number;
  conflicts: number;
  attendeeAvailability: number;
  withinWorkingHours: boolean;
}

export function SmartScheduler({
  calendars,
  events,
  onTimeSelect,
  requiredAttendees,
  optionalAttendees,
}: SmartSchedulerProps) {
  const [duration, setDuration] = React.useState(60); // minutes
  const [preferredTimeRange, setPreferredTimeRange] = React.useState<
    [number, number]
  >([9, 17]); // 9 AM to 5 PM
  const [suggestedSlots, setSuggestedSlots] = React.useState<TimeSlot[]>([]);

  const findOptimalTimeSlots = React.useCallback(() => {
    const slots: TimeSlot[] = [];
    const currentDate = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      return date;
    });

    next7Days.forEach((date) => {
      // Generate time slots for each day
      for (
        let hour = preferredTimeRange[0];
        hour < preferredTimeRange[1];
        hour++
      ) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = setMinutes(setHours(date, hour), minute);
          const endTime = addMinutes(startTime, duration);

          // Calculate conflicts
          const conflicts = events.filter((event) => {
            const eventStart = parse(
              `${event.date} ${event.time}`,
              'yyyy-MM-dd HH:mm',
              new Date(),
            );
            const eventEnd = event.endTime
              ? parse(
                  `${event.date} ${event.endTime}`,
                  'yyyy-MM-dd HH:mm',
                  new Date(),
                )
              : addMinutes(eventStart, 60);

            return (
              (startTime >= eventStart && startTime < eventEnd) ||
              (endTime > eventStart && endTime <= eventEnd)
            );
          }).length;

          // Calculate attendee availability
          const availableAttendees = [
            ...requiredAttendees,
            ...optionalAttendees,
          ].filter((attendee) => {
            // Check if attendee has conflicts
            const attendeeEvents = events.filter((event) =>
              event.attendees?.includes(attendee),
            );

            return !attendeeEvents.some((event) => {
              const eventStart = parse(
                `${event.date} ${event.time}`,
                'yyyy-MM-dd HH:mm',
                new Date(),
              );
              const eventEnd = event.endTime
                ? parse(
                    `${event.date} ${event.endTime}`,
                    'yyyy-MM-dd HH:mm',
                    new Date(),
                  )
                : addMinutes(eventStart, 60);

              return (
                (startTime >= eventStart && startTime < eventEnd) ||
                (endTime > eventStart && endTime <= eventEnd)
              );
            });
          }).length;

          // Check if within working hours
          const withinWorkingHours = calendars.some((calendar) => {
            const workingHours = calendar.settings?.workingHours;
            if (!workingHours) return true;

            const dayOfWeek = startTime.getDay();
            return (
              workingHours.days.includes(dayOfWeek) &&
              startTime.getHours() >=
                parseInt(workingHours.start.split(':')[0]) &&
              endTime.getHours() <= parseInt(workingHours.end.split(':')[0])
            );
          });

          // Calculate overall score
          const score = calculateScore({
            conflicts,
            attendeeAvailability:
              availableAttendees /
                (requiredAttendees.length + optionalAttendees.length) || 1,
            withinWorkingHours,
            timeOfDay: hour,
          });

          slots.push({
            startTime,
            score,
            conflicts,
            attendeeAvailability: availableAttendees,
            withinWorkingHours,
          });
        }
      }
    });

    // Sort slots by score and take top 5
    const bestSlots = slots.sort((a, b) => b.score - a.score).slice(0, 5);

    setSuggestedSlots(bestSlots);
  }, [
    calendars,
    events,
    duration,
    preferredTimeRange,
    requiredAttendees,
    optionalAttendees,
  ]);

  const calculateScore = ({
    conflicts,
    attendeeAvailability,
    withinWorkingHours,
    timeOfDay,
  }: {
    conflicts: number;
    attendeeAvailability: number;
    withinWorkingHours: boolean;
    timeOfDay: number;
  }) => {
    let score = 100;

    // Heavily penalize conflicts
    score -= conflicts * 30;

    // Reward high attendee availability
    score += attendeeAvailability * 20;

    // Penalize slots outside working hours
    if (!withinWorkingHours) {
      score -= 40;
    }

    // Slight preference for mid-day times
    const distanceFromNoon = Math.abs(12 - timeOfDay);
    score -= distanceFromNoon * 2;

    return Math.max(0, score);
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <label className='text-sm font-medium mb-1 block'>
              Duration (minutes)
            </label>
            <Select
              value={duration.toString()}
              onValueChange={(value) => setDuration(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[15, 30, 45, 60, 90, 120].map((mins) => (
                  <SelectItem key={mins} value={mins.toString()}>
                    {mins} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex-1'>
            <label className='text-sm font-medium mb-1 block'>
              Preferred Time Range
            </label>
            <div className='px-2'>
              <Slider
                value={[preferredTimeRange[0], preferredTimeRange[1]]}
                min={0}
                max={24}
                step={1}
                onValueChange={(value) =>
                  setPreferredTimeRange([value[0], value[1]])
                }
              />
              <div className='flex justify-between text-sm text-muted-foreground mt-1'>
                <span>
                  {format(setHours(new Date(), preferredTimeRange[0]), 'h a')}
                </span>
                <span>
                  {format(setHours(new Date(), preferredTimeRange[1]), 'h a')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          type='button'
          onClick={(e) => {
            e.preventDefault();
            findOptimalTimeSlots();
          }}
          className='w-full'
        >
          Find Optimal Times
        </Button>
      </div>

      <div className='space-y-3'>
        {suggestedSlots.map((slot, index) => (
          <Card
            key={index}
            className='p-4 hover:bg-accent transition-colors cursor-pointer'
            onClick={() => onTimeSelect(slot.startTime)}
          >
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  <span className='font-medium'>
                    {format(slot.startTime, 'EEEE, MMMM d')}
                  </span>
                  <span className='text-muted-foreground'>
                    {format(slot.startTime, 'h:mm a')}
                  </span>
                </div>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <Users className='h-4 w-4' />
                    {slot.attendeeAvailability} available
                  </span>
                  {slot.conflicts > 0 && (
                    <span className='flex items-center gap-1 text-yellow-600'>
                      <AlertCircle className='h-4 w-4' />
                      {slot.conflicts} conflicts
                    </span>
                  )}
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-medium'>
                  Score: {Math.round(slot.score)}%
                </div>
                {!slot.withinWorkingHours && (
                  <div className='text-xs text-yellow-600'>
                    Outside working hours
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
