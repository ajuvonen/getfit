import {ref} from 'vue';
import {describe, it, expect} from 'vitest';
import {v4 as uuid} from 'uuid';
import {
  getIcon,
  getIntensityColor,
  getValidationErrors,
  getEmptyTraining,
  getEmptySettings,
  isDurationTime,
  getChartOptions,
} from '@/utils';
import {Intensity, type ScheduleSettings, type Training} from '@/types';
import {ACTIVITIES, COLORS} from '@/constants';

describe('Utils', () => {
  it('getIcon gets icons from activities list', () => {
    expect(getIcon('walking')).toBe('$walking');
    expect(getIcon('boxing')).toBe('$boxing');
  });

  it('getIntensityColor gets correct intensity colors', () => {
    expect(getIntensityColor(Intensity.LIGHT)).toBe('#9ED99D');
    expect(getIntensityColor(Intensity.NORMAL)).toBe('#FFD98C');
    expect(getIntensityColor(Intensity.DEMANDING)).toBe('#FFB366');
    expect(getIntensityColor(Intensity.HEAVY)).toBe('#FF7F7A');
  });

  it('getIntensityColor alpha works', () => {
    expect(getIntensityColor(Intensity.LIGHT, 0.5)).toBe('#9ED99D80');
    expect(getIntensityColor(Intensity.NORMAL, 0.75)).toBe('#FFD98Cbf');
    expect(getIntensityColor(Intensity.DEMANDING, 0.25)).toBe('#FFB36640');
    expect(getIntensityColor(Intensity.HEAVY, 0.999)).toBe('#FF7F7Aff');
  });

  it('getValidationErrors gets a list of errors', () => {
    const errors = {field: [{message: 'Error 1'}, {message: 'Error 2'}]};
    expect(getValidationErrors(errors, 'field')).toEqual(['Error 1', 'Error 2']);
  });

  it('getValidationErrors works with refs', () => {
    const errors = ref({field: [{message: 'Error 1'}, {message: 'Error 2'}]});
    expect(getValidationErrors(errors, 'field')).toEqual(['Error 1', 'Error 2']);
  });

  it('getValidationErrors returns empty list if there are no errors', () => {
    const errors = {field: [{message: 'Error 1'}, {message: 'Error 2'}]};
    expect(getValidationErrors(errors, 'field2')).toEqual([]);
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
      defaultUnitOfDuration: 'm',
      darkMode: 'light',
      decoratedCards: false,
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
      availableActivities: ACTIVITIES,
      defaultStartTime: {
        hours: 12,
        minutes: 0,
        seconds: 0,
      },
      defaultDuration: 1,
      defaultUnitOfDuration: 'h',
      darkMode: 'auto',
      decoratedCards: true,
    });
  });

  it('getEmptyTraining should use passed parameters properly', () => {
    const initialTraining: Partial<Training> = {
      id: uuid(),
      weekId: 'test-weekId',
      activity: 'Running',
      dayIndex: 1,
      title: 'Test Title',
      instructions: 'Test Instructions',
      duration: 2,
      intensity: Intensity.DEMANDING,
      location: 'Test Location',
      completed: true,
      rating: 5,
      unitOfDuration: 'km',
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
      instructions: '',
      duration: 1,
      unitOfDuration: 'h',
      intensity: Intensity.NORMAL,
      location: '',
      completed: false,
      rating: null,
    });
  });

  it('isDurationTime should return true if duration is a time', () => {
    expect(isDurationTime('h')).toBe(true);
    expect(isDurationTime('m')).toBe(true);
    expect(isDurationTime('km')).toBe(false);
    expect(isDurationTime('mi')).toBe(false);
  });

  it('generates chart title options for light mode', () => {
    const options = getChartOptions<'line'>('Chart title', false, true);
    expect(options.plugins?.title?.text).toBe('Chart title');
    expect(options.plugins?.title?.color).toBe(COLORS.darkGrey);
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.scales?.y?.ticks?.color).toBe(undefined);
    expect(options.scales?.y?.grid?.color).toBe(undefined);
    expect(options.scales?.x?.ticks?.color).toBe(undefined);
    expect(options.scales?.x?.grid?.color).toBe(undefined);
  });

  it('generates chart title options for dark mode', () => {
    const options = getChartOptions<'line'>('Chart title', true, true);
    expect(options.plugins?.title?.text).toBe('Chart title');
    expect(options.plugins?.title?.color).toBe(COLORS.offWhite);
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.scales?.y?.ticks?.color).toBe('rgba(255,255,255,0.4)');
    expect(options.scales?.y?.grid?.color).toBe('rgba(255,255,255,0.4)');
    expect(options.scales?.x?.ticks?.color).toBe('rgba(255,255,255,0.4)');
    expect(options.scales?.x?.grid?.color).toBe('rgba(255,255,255,0.4)');
  });

  it('leaves out grid options', () => {
    const options = getChartOptions<'pie'>('Chart title', true, false);
    expect(options.plugins?.title?.text).toBe('Chart title');
    expect(options.plugins?.title?.color).toBe(COLORS.offWhite);
    expect(options.maintainAspectRatio).toBe(true);
    expect(options.scales).toBe(undefined);
  });
});
