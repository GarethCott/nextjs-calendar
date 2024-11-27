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
  tags?: string[];
  category?: string;
  reminders?: {
    type: 'email' | 'notification' | 'sms';
    time: number;
    message?: string;
  }[];
  priority?: 'low' | 'medium' | 'high';
  url?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  weather?: {
    temperature?: number;
    condition?: string;
    icon?: string;
  };
  color?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  isPrivate?: boolean;
  lastModified?: string;
  createdBy?: string;
  sharedWith?: {
    email: string;
    permission: 'view' | 'edit' | 'admin';
  }[];
}

export type CalendarView =
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'schedule'
  | 'workWeek'
  | 'agenda';

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
  owner?: string;
  sharedWith?: {
    email: string;
    permission: 'view' | 'edit' | 'admin';
  }[];
  settings?: {
    defaultView?: CalendarView;
    defaultReminders?: {
      type: 'email' | 'notification' | 'sms';
      time: number;
    }[];
    workingHours?: {
      start: string;
      end: string;
      days: number[];
    };
    timezone?: string;
  };
}
