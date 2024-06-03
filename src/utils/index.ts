import {unref, type MaybeRef} from 'vue';
import {v4 as uuid} from 'uuid';
import type {ValidateError} from 'async-validator';
import type {ChartOptions, ChartTypeRegistry} from 'chart.js';
import {pathOr} from 'remeda';
import {Intensity, type ScheduleSettings, type Training} from '@/types';
import {ACTIVITIES, COLORS} from '@/constants';

export const getIcon = (activityName: string) => `$${activityName}`;

export const getIntensityColor = (intensity: Intensity, alpha: number = 1) => {
  const hexAlpha = alpha < 1 ? Math.round(alpha * 255).toString(16) : '';
  switch (intensity) {
    case Intensity.NORMAL:
      return COLORS.intensityNormal + hexAlpha;
    case Intensity.DEMANDING:
      return COLORS.intensityDemanding + hexAlpha;
    case Intensity.HEAVY:
      return COLORS.intensityHeavy + hexAlpha;
    default:
      return COLORS.intensityLight + hexAlpha;
  }
};

export const getEmptySettings = (
  initialSettings: Partial<ScheduleSettings> = {},
): ScheduleSettings => ({
  name: '',
  startsOnSunday: false,
  startDate: null,
  actualWeekNumbering: false,
  availableActivities: [...ACTIVITIES],
  defaultStartTime: {
    hours: 12,
    minutes: 0,
    seconds: 0,
  },
  defaultDuration: 1,
  defaultUnitOfDuration: 'h',
  darkMode: 'auto',
  decoratedCards: true,
  ...initialSettings,
});

export const getEmptyTraining = (initialTraining: Partial<Training> = {}): Training => ({
  id: uuid(),
  weekId: uuid(),
  activity: '',
  dayIndex: 0,
  title: '',
  instructions: '',
  duration: 1,
  unitOfDuration: 'h',
  intensity: Intensity.NORMAL,
  location: '',
  completed: false,
  rating: null,
  ...initialTraining,
});

export const getValidationErrors = (
  errors: MaybeRef<Record<string, ValidateError[]> | undefined>,
  field: string,
) =>
  pathOr(unref(errors), [field], [])
    .map(({message}) => message || '')
    .filter((message) => message);

export const isDurationTime = (value: string) => ['h', 'm'].includes(value);

export const getChartOptions = <T extends keyof ChartTypeRegistry>(
  title: string,
  darkMode: boolean,
  grids: boolean = false,
) => ({
  responsive: true,
  maintainAspectRatio: !grids,
  color: darkMode ? COLORS.offWhite : COLORS.darkGrey,
  scales: grids ? {
    y: {
      ticks: {
        precision: 0,
        color: darkMode ? 'rgba(255,255,255,0.4)' : undefined,
      },
      grid: darkMode ? {
        color: 'rgba(255,255,255,0.4)',
      } : undefined,
    },
    x: {
      ticks: {
        precision: 0,
        color: darkMode ? 'rgba(255,255,255,0.4)' : undefined,
      },
      grid: darkMode ? {
        color: 'rgba(255,255,255,0.4)',
      } : undefined,
    },
  } : undefined,
  plugins: {
    title: {
      display: true,
      color: darkMode ? COLORS.offWhite : COLORS.darkGrey,
      text: title,
      font: {
        family: 'Roboto, sans-serif',
        size: 18,
        weight: 'normal',
        style: 'normal',
      },
    },
  },
}) as ChartOptions<T>;

export const getTestWeeks = () => {
  const weekId = uuid();
  const weekId2 = uuid();
  return [
    {
      id: weekId,
      trainings: [
        getEmptyTraining({
          weekId,
          dayIndex: 0,
          activity: 'running',
          duration: 30,
          unitOfDuration: 'km',
          intensity: Intensity.DEMANDING,
        }),
        getEmptyTraining({
          weekId,
          dayIndex: 3,
          activity: 'swimming',
          duration: 30,
          unitOfDuration: 'm',
          completed: true,
        }),
        getEmptyTraining({
          weekId,
          dayIndex: 3,
          activity: 'gym',
          duration: 1.5,
          unitOfDuration: 'h',
          completed: true,
          rating: 2,
          intensity: Intensity.DEMANDING,
        }),
        getEmptyTraining({
          weekId,
          dayIndex: 5,
          activity: 'sprint',
          duration: 1,
          unitOfDuration: 'mi',
          intensity: Intensity.DEMANDING,
        }),
      ],
    },
    {
      id: weekId2,
      trainings: [
        getEmptyTraining({
          weekId: weekId2,
          dayIndex: 0,
          activity: 'swimming',
          duration: 75,
          unitOfDuration: 'm',
        }),
        getEmptyTraining({
          weekId: weekId2,
          dayIndex: 0,
          activity: 'running',
          duration: 15,
          unitOfDuration: 'km',
          completed: true,
          rating: 5,
        }),
        getEmptyTraining({
          weekId: weekId2,
          dayIndex: 3,
          activity: 'maintenance',
          duration: 1,
          unitOfDuration: 'h',
          completed: true,
          rating: 4,
          intensity: Intensity.LIGHT,
        }),
        getEmptyTraining({
          weekId: weekId2,
          dayIndex: 5,
          activity: 'badminton',
          duration: 2,
          unitOfDuration: 'h',
          completed: true,
          rating: 1,
        }),
        getEmptyTraining({
          weekId: weekId2,
          dayIndex: 6,
          activity: 'tennis',
          duration: 1,
          unitOfDuration: 'h',
        }),
      ],
    },
  ];
};
