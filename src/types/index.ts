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

export type Schedule = {
  name: string;
  startsOnSunday: boolean;
  availableActivities: string[];
  weeks: Week[];
  unitOfTime: 'm' | 'h';
  lockSchedule: boolean;
};

export enum Intensity {
  'TRIVIAL',
  'LIGHT',
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
