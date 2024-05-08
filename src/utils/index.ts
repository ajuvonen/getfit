import {unref} from 'vue';
import {helpers} from '@vuelidate/validators';
import type {ErrorObject} from '@vuelidate/core';
import {v4 as uuid} from 'uuid';
import {clone} from 'remeda';
import type {ChartTypeRegistry} from 'chart.js';
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
  availableActivities: clone(ACTIVITIES),
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

export const decimalRegex = helpers.regex(/^\d+(.(00?|25|50?|75))?$/);

export const getValidationErrors = (errors: ErrorObject[]) =>
  errors.map((error) => unref(error.$message));

export const isDurationTime = (value: string) => ['h', 'm'].includes(value);

export const getChartOptions = <T extends keyof ChartTypeRegistry>(title: string, darkMode: boolean, grids: boolean = false) => ({
  responsive: true,
  maintainAspectRatio: !grids,
  color: darkMode ? COLORS.offWhite : COLORS.darkGrey,
  scales: grids ? {
    y: {
      ticks: {
        precision: 0,
        color: darkMode ? 'rgba(255,255,255,0.4)' : undefined
      },
      grid: darkMode ? {
        color: 'rgba(255,255,255,0.4)',
      } : undefined,
    },
    x: {
      ticks: {
        precision: 0,
        color: darkMode ? 'rgba(255,255,255,0.4)' : undefined
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
} as any);
