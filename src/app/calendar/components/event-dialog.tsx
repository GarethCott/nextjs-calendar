'use client';

import { format, parseISO } from 'date-fns';
import { X } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
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

import { ReminderSettings } from '@/app/calendar/components/reminder-settings';

import { AttendeeManager } from './attendee-manager';
import { SmartScheduler } from './smart-scheduler';
import { Calendar as CalendarType, Event } from './types';

export interface EventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: Event) => void;
  onDelete: (id: string) => void;
  calendars: CalendarType[];
  events: Event[];
  availableTags: string[];
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
  calendars,
  events,
  availableTags = [],
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
      const attendees = event.attendees || [];
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

  const handleTagToggle = React.useCallback(
    (tag: string) => {
      if (!editingEvent) return;
      setEditingEvent((prev) => {
        if (!prev) return prev;
        const currentTags = prev.tags || [];
        return {
          ...prev,
          tags: currentTags.includes(tag)
            ? currentTags.filter((t) => t !== tag)
            : [...currentTags, tag],
        };
      });
    },
    [editingEvent],
  );

  const handleSave = () => {
    if (editingEvent) {
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
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='basic'>Basic Info</TabsTrigger>
            <TabsTrigger value='schedule'>Smart Schedule</TabsTrigger>
            <TabsTrigger value='attendees'>Attendees</TabsTrigger>
          </TabsList>
          <div className='mt-4'>
            {activeTab === 'basic' && (
              <div className='space-y-4'>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editingEvent.title}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='flex space-x-4'>
                  <div className='flex-1'>
                    <Label>Date</Label>
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
                        <Calendar
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
                    <Label>Time</Label>
                    <Input
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
                  <Label>Description</Label>
                  <Input
                    value={editingEvent.description || ''}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Event Type</Label>
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
                  <Label>Recurrence</Label>
                  <Select
                    value={editingEvent.recurrence}
                    onValueChange={(
                      value: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none',
                    ) =>
                      setEditingEvent({ ...editingEvent, recurrence: value })
                    }
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
                <div>
                  <Label>Tags</Label>
                  <Command className='border rounded-md'>
                    <CommandInput placeholder='Search tags...' />
                    <CommandList>
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {availableTags.map((tag) => {
                          const isSelected = (editingEvent.tags || []).includes(
                            tag,
                          );
                          return (
                            <CommandItem
                              key={tag}
                              value={tag}
                              className='flex items-center gap-2 cursor-pointer'
                              onSelect={() => handleTagToggle(tag)}
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
                  {editingEvent.tags && editingEvent.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {editingEvent.tags.map((tag) => (
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
                              handleTagToggle(tag);
                            }}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
        <DialogFooter>
          <Button
            variant='destructive'
            onClick={() => onDelete(editingEvent.id)}
          >
            Delete
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
