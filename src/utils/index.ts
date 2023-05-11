import {Intensity, type BaseActivity} from '@/types';
import type {ErrorObject} from '@vuelidate/core';

export const roundNearestQuarter = function (number: number, precision: number) {
  return +(Math.round(number * 4) / 4).toFixed(precision);
};

export const getIcon = (activities: BaseActivity[], activityName: string) =>
  activities.find(({value}) => value === activityName)!.icon;

export const getIntensityColor = (intensity: Intensity) => {
  switch (intensity) {
    case Intensity.LIGHT:
      return '#00cd00';
    case Intensity.MEDIUM:
      return '#ffa500';
    case Intensity.HEAVY:
      return '#cd0000';
    default:
      return '#03DAC6';
  }
};

export const getValidationErrors = (vuelidateField: {$errors: ErrorObject[]}) =>
  vuelidateField.$errors.map((error) => error.$message as string);
