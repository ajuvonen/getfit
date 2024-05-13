import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useScheduleStore} from '@/stores/schedule';
import {getTestWeeks} from '@/utils';
import {COLORS} from '@/constants';
import ActivityChart from '@/components/charts/ActivityChart.vue';
import IntensityChart from '@/components/charts/IntensityChart.vue';
import RatingChart from '@/components/charts/RatingChart.vue';
import WeeklyTrainingsChart from '@/components/charts/WeeklyTrainingsChart.vue';
import WeeklySummaryChart from '@/components/charts/WeeklySummaryChart.vue';

describe('Charts', () => {
  beforeEach(() => {
    const scheduleStore = useScheduleStore();
    scheduleStore.weeks.push(...getTestWeeks());
  });

  it('calculates data for ActivityChart', () => {
    const wrapper = mount(ActivityChart, {shallow: true});
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual([
      'Running',
      'Swimming',
      'Badminton',
      'Body Maintenance',
      'Gym',
      'Sprint',
      'Other',
    ]);
    expect(data).toEqual([2, 2, 1, 1, 1, 1, 1]);
  });

  it('calculates data for RatingChart', () => {
    const wrapper = mount(RatingChart, {shallow: true});
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['No rating', '1 ★', '2 ★', '4 ★', '5 ★']);
    expect(data).toEqual([5, 1, 1, 1, 1]);
  });

  it('calculates data for IntensityChart', () => {
    const wrapper = mount(IntensityChart, {shallow: true});
    const {
      labels,
      datasets: [{data, backgroundColor}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Light', 'Normal', 'Demanding']);
    expect(backgroundColor).toEqual([
      COLORS.intensityLight,
      COLORS.intensityNormal,
      COLORS.intensityDemanding,
    ]);
    expect(data).toEqual([1, 5, 3]);
  });

  it('calculates data for WeeklyTrainingsChart', () => {
    const wrapper = mount(WeeklyTrainingsChart, {shallow: true});
    const {
      labels,
      datasets: [{data: totalTrainings}, {data: completedTrainings}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Week 1', 'Week 2']);
    expect(totalTrainings).toEqual([4, 5]);
    expect(completedTrainings).toEqual([2, 3]);
  });

  it('calculates data for WeeklySummaryChart', () => {
    const wrapper = mount(WeeklySummaryChart, {shallow: true});
    const {
      labels,
      datasets: [{data: hours}, {data: kilometers}, {data: miles}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Week 1', 'Week 2']);
    expect(hours).toEqual([2, 5.25]);
    expect(kilometers).toEqual([30, 15]);
    expect(miles).toEqual([1, 0]);
  });
});
