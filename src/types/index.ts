export type Training = {
  id: string;
  weekId: string;
  dayIndex: number;
  activity: string;
  title: string;
  description: string;
  duration: number;
  intensity: Intensity;
  location: string;
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
  unitOfTime: 'm' | 'h';
};

export enum Intensity {
  'LIGHT',
  'NORMAL',
  'MEDIUM',
  'HEAVY',
}

export type BaseActivity = {
  value: string;
  icon: string;
};

export type LocalizedActivity = BaseActivity & {
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
  calname: string;
};
