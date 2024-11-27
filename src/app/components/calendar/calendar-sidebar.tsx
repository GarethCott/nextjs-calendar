'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface CalendarSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export function CalendarSidebar({
  currentDate,
  setCurrentDate,
}: CalendarSidebarProps) {
  return (
    <div className='w-64 p-4 border-r border-border bg-card'>
      <div className='space-y-4'>
        <Button variant='ghost' className='w-full justify-start'>
          Calendars
        </Button>
        <Button variant='ghost' className='w-full justify-start'>
          Reminders
        </Button>
        <div className='mt-6'>
          <Calendar
            mode='single'
            selected={currentDate}
            onSelect={(date) => date && setCurrentDate(date)}
            className='rounded-lg border-none'
            classNames={{
              months: 'space-y-4 mx-auto',
              month: 'space-y-4',
              caption:
                'flex justify-center pt-1 relative items-center dark:text-gray-100',
              caption_label: 'text-sm font-medium',
              nav: 'space-x-1 flex items-center',
              nav_button:
                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex justify-between',
              head_cell:
                'text-gray-500 dark:text-gray-400 rounded-md w-8 font-normal text-[0.8rem]',
              row: 'flex justify-between mt-2',
              cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent',
              day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
              day_range_end: 'day-range-end',
              day_selected:
                'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white',
              day_today:
                'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
              day_outside: 'text-gray-400 dark:text-gray-500 opacity-50',
              day_disabled: 'text-gray-400 dark:text-gray-500 opacity-50',
              day_range_middle:
                'aria-selected:bg-accent aria-selected:text-accent-foreground',
              day_hidden: 'invisible',
            }}
          />
        </div>
      </div>
    </div>
  );
}
