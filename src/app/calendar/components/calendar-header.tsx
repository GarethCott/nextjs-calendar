'use client';

import { addDays, addMonths, addWeeks, format } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import * as React from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CalendarView } from './types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddEventClick: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  setCurrentDate,
  setView,
  searchQuery,
  setSearchQuery,
  onAddEventClick,
}: CalendarHeaderProps) {
  return (
    <div className='flex justify-between items-center p-4 border-b border-border'>
      <div className='flex items-center space-x-4'>
        <Button
          variant='outline'
          size='sm'
          className='text-gray-700 dark:text-gray-300'
          onClick={onAddEventClick}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Event
        </Button>
        <div className='h-6 w-px bg-gray-200 dark:bg-gray-700' />
        <Button
          variant='ghost'
          size='sm'
          className='text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
      </div>

      <div className='flex items-center space-x-4'>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-700 dark:text-gray-300'
          onClick={() => {
            switch (view) {
              case 'day':
                setCurrentDate(addDays(currentDate, -1));
                break;
              case 'week':
                setCurrentDate(addWeeks(currentDate, -1));
                break;
              case 'month':
                setCurrentDate(addMonths(currentDate, -1));
                break;
              case 'year':
                setCurrentDate(addMonths(currentDate, -12));
                break;
            }
          }}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <h2 className='text-xl font-semibold'>
          {format(currentDate, view === 'year' ? 'yyyy' : 'MMMM yyyy')}
        </h2>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-700 dark:text-gray-300'
          onClick={() => {
            switch (view) {
              case 'day':
                setCurrentDate(addDays(currentDate, 1));
                break;
              case 'week':
                setCurrentDate(addWeeks(currentDate, 1));
                break;
              case 'month':
                setCurrentDate(addMonths(currentDate, 1));
                break;
              case 'year':
                setCurrentDate(addMonths(currentDate, 12));
                break;
            }
          }}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex items-center space-x-4'>
        <Tabs
          value={view}
          onValueChange={(value: string) => {
            if (
              value === 'day' ||
              value === 'week' ||
              value === 'month' ||
              value === 'year'
            ) {
              setView(value as CalendarView);
            }
          }}
        >
          <TabsList>
            <TabsTrigger
              value='day'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
            >
              Day
            </TabsTrigger>
            <TabsTrigger
              value='week'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
            >
              Week
            </TabsTrigger>
            <TabsTrigger
              value='month'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
            >
              Month
            </TabsTrigger>
            <TabsTrigger
              value='year'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'
            >
              Year
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='relative'>
          <Search className='h-4 w-4 absolute left-2 top-2.5 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search events'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>

        <ModeToggle />
      </div>
    </div>
  );
}
