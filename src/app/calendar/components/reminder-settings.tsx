'use client';

import { Plus, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReminderSettingsProps {
  reminders: {
    type: 'email' | 'notification' | 'sms';
    time: number;
    message?: string;
  }[];
  onChange: (
    reminders: {
      type: 'email' | 'notification' | 'sms';
      time: number;
      message?: string;
    }[],
  ) => void;
}

const timeOptions = [
  { value: 0, label: 'At time of event' },
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
  { value: 10080, label: '1 week before' },
];

export function ReminderSettings({
  reminders,
  onChange,
}: ReminderSettingsProps) {
  const addReminder = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    onChange([...reminders, { type: 'notification', time: 15, message: '' }]);
  };

  const removeReminder = (index: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    onChange(reminders.filter((_, i) => i !== index));
  };

  const updateReminder = (
    index: number,
    field: 'type' | 'time' | 'message',
    value: string | number,
  ) => {
    const updatedReminders = reminders.map((reminder, i) => {
      if (i === index) {
        return {
          ...reminder,
          [field]: field === 'time' ? Number(value) : value,
        };
      }
      return reminder;
    });
    onChange(updatedReminders);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium'>Reminders</h4>
        <Button
          type='button' // Important: Specify button type
          variant='outline'
          size='sm'
          onClick={addReminder}
          className='h-8'
        >
          <Plus className='h-4 w-4 mr-1' />
          Add Reminder
        </Button>
      </div>
      <div className='space-y-2'>
        {reminders.map((reminder, index) => (
          <div
            key={index}
            className='flex items-start gap-2 p-3 border rounded-lg'
          >
            <Select
              value={reminder.type}
              onValueChange={(value: 'email' | 'notification' | 'sms') =>
                updateReminder(index, 'type', value)
              }
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='notification'>Notification</SelectItem>
                <SelectItem value='email'>Email</SelectItem>
                <SelectItem value='sms'>SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={reminder.time.toString()}
              onValueChange={(value) =>
                updateReminder(index, 'time', parseInt(value))
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder='Custom message (optional)'
              value={reminder.message || ''}
              onChange={(e) => updateReminder(index, 'message', e.target.value)}
              className='flex-1'
            />
            <Button
              type='button' // Important: Specify button type
              variant='ghost'
              size='icon'
              onClick={(e) => removeReminder(index, e)}
              className='h-10 w-10'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
