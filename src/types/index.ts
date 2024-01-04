export type Training = {
  id: string;
  weekId: string;
  dayIndex: number;
  activity: string;
  title: string;
  description: string;
  duration: number;
  intensity: Intensity;
  completionSummary: string;
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
  defaultDuration: number;
  unitOfTime: 'm' | 'h';
  lockSchedule: boolean;
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
