export type Locale = 'en' | 'fi';

export type Rating = 1 | 2 | 3 | 4 | 5 | null;

export type UnitOfDuration = 'h' | 'm' | 'km' | 'mi';

export type Training = {
  id: string;
  weekId: string;
  dayIndex: number;
  activity: string;
  title: string;
  instructions: string;
  duration: number;
  unitOfDuration: UnitOfDuration;
  intensity: Intensity;
  location: string;
  completed: boolean;
  rating: Rating;
};

export type Week = {
  id: string;
  trainings: Training[];
};

export type ScheduleSettings = {
  name: string;
  startsOnSunday: boolean;
  startDate: Date | null;
  actualWeekNumbering: boolean;
  availableActivities: string[];
  defaultStartTime: {hours: number; minutes: number; seconds: number};
  defaultDuration: number;
  defaultUnitOfDuration: UnitOfDuration;
  darkMode: 'auto' | 'light' | 'dark';
  decoratedCards: boolean;
};

export enum Intensity {
  'LIGHT',
  'NORMAL',
  'DEMANDING',
  'HEAVY',
}

export type LocalizedActivity = {
  value: string;
  title: string;
};

export type CalendarEvent = {
  title: string;
  description: string;
  start: [number, number, number, number, number];
  duration: {minutes: number};
  location: string;
  categories: string[];
  status: 'CONFIRMED';
  busyStatus: 'BUSY';
  transp: 'OPAQUE';
  productId: 'ajuvonen/getfit';
  classification: 'PRIVATE';
  calName: string;
};
