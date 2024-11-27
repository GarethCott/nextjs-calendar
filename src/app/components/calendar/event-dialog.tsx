'use client';

import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AttendeeManager } from './attendee-manager';
import { ReminderSettings } from './reminder-settings';
import { SmartScheduler } from './smart-scheduler';
import { Calendar, Event } from './types';

interface EventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (id: string) => void;
  calendars: Calendar[];
  events: Event[];
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
  calendars,
  events,
}: EventDialogProps) {
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [activeTab, setActiveTab] = React.useState('basic');
  const [requiredAttendees, setRequiredAttendees] = React.useState<string[]>(
    [],
  );
  const [optionalAttendees, setOptionalAttendees] = React.useState<string[]>(
    [],
  );

  React.useEffect(() => {
    if (event) {
      setEditingEvent(event);
      // Split attendees into required and optional
      const attendees = event.attendees || [];
      // For now, treat all existing attendees as required
      setRequiredAttendees(attendees);
      setOptionalAttendees([]);
    }
  }, [event]);

  const handleTimeSelect = (startTime: Date) => {
    if (editingEvent) {
      setEditingEvent({
        ...editingEvent,
        date: format(startTime, 'yyyy-MM-dd'),
        time: format(startTime, 'HH:mm'),
      });
      setActiveTab('basic');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Combine attendees before saving
      const updatedEvent = {
        ...editingEvent,
        attendees: [...requiredAttendees, ...optionalAttendees],
      };
      onSave(updatedEvent);
    }
  };

  if (!editingEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl bg-background border-border'>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='basic'>Basic Info</TabsTrigger>
            <TabsTrigger value='schedule'>Smart Schedule</TabsTrigger>
            <TabsTrigger value='attendees'>Attendees</TabsTrigger>
          </TabsList>
          <form
            onSubmit={(e) => {
              // Only submit if we're on the basic info tab
              if (activeTab !== 'basic') {
                e.preventDefault();
                return;
              }
              handleSubmit(e);
            }}
            className='space-y-4'
          >
            <TabsContent value='basic' className='space-y-4 mt-4'>
              <div>
                <Label htmlFor='edit-title'>Title</Label>
                <Input
                  id='edit-title'
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                />
              </div>
              <div className='flex space-x-4'>
                <div className='flex-1'>
                  <Label htmlFor='edit-date'>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !editingEvent.date && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {editingEvent.date ? (
                          format(parseISO(editingEvent.date), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <CalendarUI
                        mode='single'
                        selected={
                          editingEvent.date
                            ? parseISO(editingEvent.date)
                            : undefined
                        }
                        onSelect={(date) =>
                          setEditingEvent({
                            ...editingEvent,
                            date: date ? format(date, 'yyyy-MM-dd') : '',
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className='flex-1'>
                  <Label htmlFor='edit-time'>Time</Label>
                  <Input
                    id='edit-time'
                    type='time'
                    value={editingEvent.time}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor='edit-description'>Description</Label>
                <Input
                  id='edit-description'
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='edit-type'>Event Type</Label>
                <Select
                  value={editingEvent.type}
                  onValueChange={(
                    value: 'work' | 'personal' | 'family' | 'holiday',
                  ) => setEditingEvent({ ...editingEvent, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select event type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='work'>Work</SelectItem>
                    <SelectItem value='personal'>Personal</SelectItem>
                    <SelectItem value='family'>Family</SelectItem>
                    <SelectItem value='holiday'>Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='edit-recurrence'>Recurrence</Label>
                <Select
                  value={editingEvent.recurrence}
                  onValueChange={(
                    value: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none',
                  ) => setEditingEvent({ ...editingEvent, recurrence: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select recurrence' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>None</SelectItem>
                    <SelectItem value='daily'>Daily</SelectItem>
                    <SelectItem value='weekly'>Weekly</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                    <SelectItem value='yearly'>Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ReminderSettings
                reminders={editingEvent.reminders || []}
                onChange={(reminders) =>
                  setEditingEvent({ ...editingEvent, reminders })
                }
              />
            </TabsContent>
            <TabsContent value='schedule' className='mt-4'>
              <SmartScheduler
                calendars={calendars}
                events={events}
                onTimeSelect={handleTimeSelect}
                requiredAttendees={requiredAttendees}
                optionalAttendees={optionalAttendees}
              />
            </TabsContent>
            <TabsContent value='attendees' className='mt-4'>
              <AttendeeManager
                requiredAttendees={requiredAttendees}
                optionalAttendees={optionalAttendees}
                onRequiredAttendeesChange={setRequiredAttendees}
                onOptionalAttendeesChange={setOptionalAttendees}
              />
            </TabsContent>
            <DialogFooter className='mt-6'>
              <div className='flex justify-between w-full'>
                <Button
                  type='button'
                  variant='destructive'
                  onClick={() => onDelete?.(editingEvent.id)}
                >
                  Delete Event
                </Button>
                <Button type='submit'>Save Changes</Button>
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
