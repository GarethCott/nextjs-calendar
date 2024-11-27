export interface Event {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  time: string;
  endTime?: string;
  description?: string;
  type: 'work' | 'personal' | 'family' | 'holiday';
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  location?: string;
  attendees?: string[];
  reminder?: number;
  color?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export type CalendarView =
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'schedule' // Agenda view
  | 'workWeek'; // Monday-Friday only

export const eventColors = {
  work: 'bg-blue-500 dark:bg-blue-600',
  personal: 'bg-green-500 dark:bg-green-600',
  family: 'bg-purple-500 dark:bg-purple-600',
  holiday: 'bg-red-500 dark:bg-red-600',
};

export interface Calendar {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  type: 'personal' | 'work' | 'shared' | 'holiday';
}
