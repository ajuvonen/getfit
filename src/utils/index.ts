import {unref} from 'vue';
import {helpers} from '@vuelidate/validators';
import type {ErrorObject} from '@vuelidate/core';
import {v4 as uuidv4} from 'uuid';
import {Intensity, type ScheduleSettings, type Training} from '@/types';
import {ACTIVITIES, COLORS} from '@/constants';

export const roundNearestQuarter = function (number: number, precision: number) {
  return +(Math.round(number * 4) / 4).toFixed(precision);
};

export const getIcon = (activityName: string) =>
  ACTIVITIES.find(({value}) => value === activityName)!.icon;

export const getIntensityColor = (intensity: Intensity) => {
  switch (intensity) {
    case Intensity.NORMAL:
      return COLORS.intensityNormal;
    case Intensity.MEDIUM:
      return COLORS.intensityMedium;
    case Intensity.HEAVY:
      return COLORS.intensityHeavy;
    default:
      return COLORS.intensityLight;
  }
};

export const getEmptySettings = (initialSettings: Partial<ScheduleSettings> = {}): ScheduleSettings => ({
  name: '',
  startsOnSunday: false,
  startDate: null,
  actualWeekNumbering: false,
  availableActivities: ACTIVITIES.map(({value}) => value),
  defaultStartTime: {
    hours: 12,
    minutes: 0,
    seconds: 0,
  },
  defaultDuration: 1,
  unitOfTime: 'h',
  darkMode: 'auto',
  ...initialSettings,
});

export const getEmptyTraining = (initialTraining: Partial<Training> = {}): Training => ({
  id: uuidv4(),
  weekId: uuidv4(),
  activity: '',
  dayIndex: 0,
  title: '',
  description: '',
  duration: 1,
  intensity: Intensity.NORMAL,
  location: '',
  completed: false,
  rating: null,
  ...initialTraining,
});

export const decimalRegex = helpers.regex(/^\d+(.(00?|25|50?|75))?$/);

export const getValidationErrors = (errors: ErrorObject[]) =>
  errors.map((error) => unref(error.$message));