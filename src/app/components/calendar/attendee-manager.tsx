'use client';

import { X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AttendeeManagerProps {
  requiredAttendees: string[];
  optionalAttendees: string[];
  onRequiredAttendeesChange: (attendees: string[]) => void;
  onOptionalAttendeesChange: (attendees: string[]) => void;
}

export function AttendeeManager({
  requiredAttendees,
  optionalAttendees,
  onRequiredAttendeesChange,
  onOptionalAttendeesChange,
}: AttendeeManagerProps) {
  const [newAttendee, setNewAttendee] = React.useState('');
  const [attendeeType, setAttendeeType] = React.useState<
    'required' | 'optional'
  >('required');

  const handleAddAttendee = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newAttendee.trim()) return;

    if (attendeeType === 'required') {
      onRequiredAttendeesChange([...requiredAttendees, newAttendee]);
    } else {
      onOptionalAttendeesChange([...optionalAttendees, newAttendee]);
    }

    setNewAttendee('');
  };

  const handleRemoveAttendee = (
    email: string,
    type: 'required' | 'optional',
  ) => {
    if (type === 'required') {
      onRequiredAttendeesChange(requiredAttendees.filter((a) => a !== email));
    } else {
      onOptionalAttendeesChange(optionalAttendees.filter((a) => a !== email));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAttendee();
    }
  };

  return (
    <form onSubmit={handleAddAttendee} className='space-y-4'>
      <div className='flex gap-2'>
        <Select
          value={attendeeType}
          onValueChange={(value: 'required' | 'optional') =>
            setAttendeeType(value)
          }
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='required'>Required</SelectItem>
            <SelectItem value='optional'>Optional</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder='Enter email address'
          value={newAttendee}
          onChange={(e) => setNewAttendee(e.target.value)}
          onKeyPress={handleKeyPress}
          className='flex-1'
        />
        <Button type='submit'>Add</Button>
      </div>

      <div className='space-y-3'>
        {requiredAttendees.length > 0 && (
          <div>
            <h4 className='text-sm font-medium mb-2'>Required Attendees</h4>
            <div className='flex flex-wrap gap-2'>
              {requiredAttendees.map((email) => (
                <Badge
                  key={email}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {email}
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-4 w-4 p-0 hover:bg-transparent'
                    onClick={() => handleRemoveAttendee(email, 'required')}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {optionalAttendees.length > 0 && (
          <div>
            <h4 className='text-sm font-medium mb-2'>Optional Attendees</h4>
            <div className='flex flex-wrap gap-2'>
              {optionalAttendees.map((email) => (
                <Badge
                  key={email}
                  variant='outline'
                  className='flex items-center gap-1'
                >
                  {email}
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-4 w-4 p-0 hover:bg-transparent'
                    onClick={() => handleRemoveAttendee(email, 'optional')}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
