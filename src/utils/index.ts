import {Intensity, type BaseActivity} from '@/types';
import type {ErrorObject} from '@vuelidate/core';

export const roundNearestQuarter = function (number: number, precision: number) {
  return +(Math.round(number * 4) / 4).toFixed(precision);
};

export const getIcon = (activities: BaseActivity[], activityName: string) =>
  activities.find(({value}) => value === activityName)!.icon;

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

export const getValidationErrors = (vuelidateField: {$errors: ErrorObject[]}) =>
  vuelidateField.$errors.map((error) => error.$message as string);
