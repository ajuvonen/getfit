import {describe, it, expect} from 'vitest';
import type {ErrorObject} from '@vuelidate/core';
import {
  roundNearestQuarter,
  getIcon,
  getIntensityColor,
  getValidationErrors,
  getEmptyTraining,
  getEmptySettings,
} from '@/utils';
import {Intensity, type ScheduleSettings, type Training} from '@/types';
import {ACTIVITIES} from '@/constants';

describe('Utils', () => {
  it('roundNearestQuarter rounds decimals to nearest quarter with no decimals', () => {
    expect(roundNearestQuarter(1.1, 0)).toBe(1);
    expect(roundNearestQuarter(1.2, 0)).toBe(1);
    expect(roundNearestQuarter(1.3333, 0)).toBe(1);
    expect(roundNearestQuarter(1.6666, 0)).toBe(2);
    expect(roundNearestQuarter(1.77, 0)).toBe(2);
    expect(roundNearestQuarter(1.87, 0)).toBe(2);
  });

  it('roundNearestQuarter rounds decimals to nearest quarter with two decimal precision', () => {
    expect(roundNearestQuarter(1.1, 2)).toBe(1.0);
    expect(roundNearestQuarter(1.2, 2)).toBe(1.25);
    expect(roundNearestQuarter(1.3333, 2)).toBe(1.25);
    expect(roundNearestQuarter(1.6666, 2)).toBe(1.75);
    expect(roundNearestQuarter(1.77, 2)).toBe(1.75);
    expect(roundNearestQuarter(1.88, 2)).toBe(2.00);
  });

  it('getIcon gets icons from activities list', () => {
    expect(getIcon('walking')).toBe('mdi-walk');
    expect(getIcon('boxing')).toBe('mdi-boxing-glove');
  });

  it('getIntensityColor gets correct intensity colors', () => {
    expect(getIntensityColor(Intensity.LIGHT)).toBe('#6DBF79');
    expect(getIntensityColor(Intensity.NORMAL)).toBe('#FFC300');
    expect(getIntensityColor(Intensity.DEMANDING)).toBe('#FF8C00');
    expect(getIntensityColor(Intensity.HEAVY)).toBe('#FF6347');
  });

  it('getValidationErrors gets a list of errors', () => {
    const errors = [{$message: 'Error 1'}, {$message: 'Error 2'}] as ErrorObject[];
    expect(getValidationErrors(errors)).toEqual(['Error 1', 'Error 2']);
  });

  it('getEmptySettings should use passed parameters properly', () => {
    const initialSettings: Partial<ScheduleSettings> = {
      name: 'Test',
      startsOnSunday: true,
      startDate: new Date(),
      actualWeekNumbering: true,
      availableActivities: ['running'],
      defaultStartTime: {
        hours: 6,
        minutes: 30,
        seconds: 0,
      },
      defaultDuration: 20,
      unitOfTime: 'm',
      darkMode: 'light',
    };
    const settings: ScheduleSettings = getEmptySettings(initialSettings);
    expect(settings).toEqual(initialSettings);
  });

  it('getEmptySettings should use default values properly when no parameter is passed', () => {
    const settings: ScheduleSettings = getEmptySettings();
    expect(settings).toEqual({
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
    });
  });
  

  it('getEmptyTraining should use passed parameters properly', () => {
    const initialTraining: Partial<Training> = {
      id: 'test-id',
      weekId: 'test-weekId',
      activity: 'Running',
      dayIndex: 1,
      title: 'Test Title',
      description: 'Test Description',
      duration: 2,
      intensity: Intensity.DEMANDING,
      location: 'Test Location',
      completed: true,
      rating: 5,
    };
    const training: Training = getEmptyTraining(initialTraining);
    expect(training).toEqual(initialTraining);
  });

  it('getEmptyTraining should use default values properly when no parameter is passed', () => {
    const training: Training = getEmptyTraining();
    expect(training).toEqual({
      id: expect.any(String),
      weekId: expect.any(String),
      activity: '',
      dayIndex: 0,
      title: '',
      description: '',
      duration: 1,
      intensity: Intensity.NORMAL,
      location: '',
      completed: false,
      rating: null,
    });
  });
});
