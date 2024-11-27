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

interface EventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (id: string) => void;
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);

  React.useEffect(() => {
    setEditingEvent(event);
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      onSave(editingEvent);
    }
  };

  if (!editingEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-background border-border'>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
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
              <Label htmlFor='edit-time'>Time</Label>
              <Input
                id='edit-time'
                type='time'
                value={editingEvent.time}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, time: e.target.value })
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
          <div className='flex justify-between'>
            <Button type='submit' className='flex-1 mr-2'>
              Save Changes
            </Button>
            {onDelete && (
              <Button
                type='button'
                variant='destructive'
                onClick={() => onDelete(editingEvent.id)}
              >
                Delete Event
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
