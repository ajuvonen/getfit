import {unref} from 'vue';
import {helpers} from '@vuelidate/validators';
import type {ErrorObject} from '@vuelidate/core';
import {Intensity} from '@/types';
import {ACTIVITIES} from '@/constants';

export const roundNearestQuarter = function (number: number, precision: number) {
  return +(Math.round(number * 4) / 4).toFixed(precision);
};

export const getIcon = (activityName: string) =>
  ACTIVITIES.find(({value}) => value === activityName)!.icon;

export const getIntensityColor = (intensity: Intensity) => {
  switch (intensity) {
    case Intensity.NORMAL:
      return '#FFC300';
    case Intensity.MEDIUM:
      return '#FF8C00';
    case Intensity.HEAVY:
      return '#FF6347';
    default:
      return '#6DBF79';
  }
};

export const decimalRegex = helpers.regex(/^\d+(.(00?|25|50?|75))?$/);

export const getValidationErrors = (errors: ErrorObject[]) =>
  errors.map((error) => unref(error.$message));
