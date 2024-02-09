import {describe, it, expect} from 'vitest';
import type {ErrorObject} from '@vuelidate/core';
import {roundNearestQuarter, getIcon, getIntensityColor, getValidationErrors} from '@/utils';
import {Intensity} from '@/types';

describe('Utils', () => {
  it('roundNearestQuarter rounds decimals to nearest quarter with no decimals', () => {
    expect(roundNearestQuarter(1.1, 0)).toBe(1);
    expect(roundNearestQuarter(1.2, 0)).toBe(1);
    expect(roundNearestQuarter(1.3333, 0)).toBe(1);
    expect(roundNearestQuarter(1.6666, 0)).toBe(2);
    expect(roundNearestQuarter(1.77, 0)).toBe(2);
    expect(roundNearestQuarter(1.87, 0)).toBe(2.00);
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
});
