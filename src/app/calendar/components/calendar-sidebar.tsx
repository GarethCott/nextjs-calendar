'use client';

import { Calendar as CalendarIcon, ChevronDown, Plus, Tag } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

import { Calendar as CalendarType } from './types';

interface CalendarSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  calendars: CalendarType[];
  onCalendarVisibilityChange: (id: string, isVisible: boolean) => void;
  selectedTags: string[];
  availableTags: string[];
  onTagSelect: (tag: string) => void;
  onTagCreate: (tag: string) => void;
}

export function CalendarSidebar({
  currentDate,
  setCurrentDate,
  calendars,
  onCalendarVisibilityChange,
  selectedTags,
  availableTags,
  onTagSelect,
  onTagCreate,
}: CalendarSidebarProps) {
  const [isCalendarsOpen, setIsCalendarsOpen] = React.useState(true);
  const [isTagsOpen, setIsTagsOpen] = React.useState(true);
  const [newTag, setNewTag] = React.useState('');

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      onTagCreate(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className='w-64 p-4 border-r border-border bg-card'>
      <div className='space-y-4'>
        <Collapsible
          open={isCalendarsOpen}
          onOpenChange={setIsCalendarsOpen}
          className='space-y-2'
        >
          <CollapsibleTrigger asChild>
            <Button variant='ghost' className='w-full justify-between'>
              <div className='flex items-center'>
                <CalendarIcon className='h-4 w-4 mr-2' />
                <span>Calendars</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isCalendarsOpen ? 'transform rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-2'>
            {calendars.map((calendar) => (
              <div
                key={calendar.id}
                className='flex items-center space-x-2 px-4 py-1'
              >
                <Checkbox
                  id={`calendar-${calendar.id}`}
                  checked={calendar.isVisible}
                  onCheckedChange={(checked: boolean) =>
                    onCalendarVisibilityChange(calendar.id, checked)
                  }
                />
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: calendar.color }}
                />
                <label
                  htmlFor={`calendar-${calendar.id}`}
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {calendar.name}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={isTagsOpen}
          onOpenChange={setIsTagsOpen}
          className='space-y-2'
        >
          <CollapsibleTrigger asChild>
            <Button variant='ghost' className='w-full justify-between'>
              <div className='flex items-center'>
                <Tag className='h-4 w-4 mr-2' />
                <span>Tags</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isTagsOpen ? 'transform rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-2'>
            <form onSubmit={handleCreateTag} className='flex gap-2 mb-2'>
              <Input
                type='text'
                placeholder='New tag'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className='h-8'
              />
              <Button type='submit' size='sm' variant='outline'>
                <Plus className='h-4 w-4' />
              </Button>
            </form>
            <div className='space-y-2'>
              {availableTags.map((tag) => (
                <div key={tag} className='flex items-center gap-2'>
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => onTagSelect(tag)}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

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
