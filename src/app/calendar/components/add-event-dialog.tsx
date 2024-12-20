'use client';

import { format, parseISO } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AttendeeManager } from './attendee-manager';
import { ReminderSettings } from './reminder-settings';
import { SmartScheduler } from './smart-scheduler';
import { Calendar as CalendarType, Event } from './types';

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newEvent: Omit<Event, 'id'>;
  setNewEvent: React.Dispatch<React.SetStateAction<Omit<Event, 'id'>>>;
  onSubmit: (e: React.FormEvent) => void;
  calendars: CalendarType[];
  events: Event[];
  availableTags: string[];
}

export function AddEventDialog({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  onSubmit,
  calendars = [],
  events = [],
  availableTags = [],
}: AddEventDialogProps) {
  const [activeTab, setActiveTab] = React.useState('basic');
  const [requiredAttendees, setRequiredAttendees] = React.useState<string[]>(
    [],
  );
  const [optionalAttendees, setOptionalAttendees] = React.useState<string[]>(
    [],
  );

  React.useEffect(() => {
    if (!newEvent.tags) {
      setNewEvent((prev) => ({ ...prev, tags: [] }));
    }
  }, [newEvent.tags, setNewEvent]);

  const handleTimeSelect = (startTime: Date) => {
    setNewEvent({
      ...newEvent,
      date: format(startTime, 'yyyy-MM-dd'),
      time: format(startTime, 'HH:mm'),
    });
    setActiveTab('basic');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'basic') {
      return;
    }
    const eventWithAttendees = {
      ...newEvent,
      attendees: [...(requiredAttendees || []), ...(optionalAttendees || [])],
      tags: newEvent.tags || [],
    };
    setNewEvent(eventWithAttendees);
    onSubmit(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl bg-background border-border'>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='basic'>Basic Info</TabsTrigger>
            <TabsTrigger value='schedule'>Smart Schedule</TabsTrigger>
            <TabsTrigger value='attendees'>Attendees</TabsTrigger>
          </TabsList>
          <div className='mt-4'>
            {activeTab === 'basic' && (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='flex space-x-4'>
                  <div className='flex-1'>
                    <Label htmlFor='date'>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !newEvent.date && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {newEvent.date ? (
                            format(parseISO(newEvent.date), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={
                            newEvent.date ? parseISO(newEvent.date) : undefined
                          }
                          onSelect={(date) =>
                            setNewEvent({
                              ...newEvent,
                              date: date ? format(date, 'yyyy-MM-dd') : '',
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className='flex-1'>
                    <Label htmlFor='time'>Time</Label>
                    <Input
                      id='time'
                      type='time'
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor='description'>Description</Label>
                  <Input
                    id='description'
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='type'>Event Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(
                      value: 'work' | 'personal' | 'family' | 'holiday',
                    ) => setNewEvent({ ...newEvent, type: value })}
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
                  <Label htmlFor='recurrence'>Recurrence</Label>
                  <Select
                    value={newEvent.recurrence}
                    onValueChange={(
                      value: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none',
                    ) => setNewEvent({ ...newEvent, recurrence: value })}
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
                  reminders={newEvent.reminders || []}
                  onChange={(reminders) =>
                    setNewEvent({ ...newEvent, reminders })
                  }
                />
                <div>
                  <Label>Tags</Label>
                  <Command className='border rounded-md'>
                    <CommandInput placeholder='Search tags...' />
                    <CommandList>
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {availableTags.map((tag) => {
                          const isSelected = (newEvent.tags || []).includes(
                            tag,
                          );
                          return (
                            <CommandItem
                              key={tag}
                              value={tag}
                              className='flex items-center gap-2 cursor-pointer'
                              onSelect={() => {
                                setNewEvent((prev) => {
                                  const currentTags = prev.tags || [];
                                  return {
                                    ...prev,
                                    tags: currentTags.includes(tag)
                                      ? currentTags.filter((t) => t !== tag)
                                      : [...currentTags, tag],
                                  };
                                });
                              }}
                            >
                              <Checkbox
                                checked={isSelected}
                                className='pointer-events-none'
                                onCheckedChange={() => undefined}
                              />
                              <span>{tag}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  {newEvent.tags && newEvent.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {newEvent.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          {tag}
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-4 w-4 p-0 hover:bg-transparent'
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewEvent((prev) => ({
                                ...prev,
                                tags: (prev.tags || []).filter(
                                  (t) => t !== tag,
                                ),
                              }));
                            }}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type='submit'>Add Event</Button>
                </DialogFooter>
              </form>
            )}
            {activeTab === 'schedule' && (
              <SmartScheduler
                calendars={calendars}
                events={events}
                onTimeSelect={handleTimeSelect}
                requiredAttendees={requiredAttendees}
                optionalAttendees={optionalAttendees}
              />
            )}
            {activeTab === 'attendees' && (
              <AttendeeManager
                requiredAttendees={requiredAttendees}
                optionalAttendees={optionalAttendees}
                onRequiredAttendeesChange={setRequiredAttendees}
                onOptionalAttendeesChange={setOptionalAttendees}
              />
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
