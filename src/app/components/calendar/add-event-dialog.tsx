'use client';

import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
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

import { Event } from './types';

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newEvent: Omit<Event, 'id'>;
  setNewEvent: React.Dispatch<React.SetStateAction<Omit<Event, 'id'>>>;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddEventDialog({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  onSubmit,
}: AddEventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-background border-border'>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className='space-y-4'>
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
          <Button type='submit' className='w-full'>
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
