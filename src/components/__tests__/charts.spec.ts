import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {v4 as uuid} from 'uuid';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {getEmptyTraining} from '@/utils';
import {Intensity} from '@/types';
import {COLORS} from '@/constants';
import ActivityChart from '@/components/charts/ActivityChart.vue';
import IntensityChart from '@/components/charts/IntensityChart.vue';
import RatingChart from '@/components/charts/RatingChart.vue';
import WeeklyTrainingsChart from '@/components/charts/WeeklyTrainingsChart.vue';
import WeeklySummaryChart from '@/components/charts/WeeklySummaryChart.vue';

describe('Charts', () => {
  beforeEach(() => {
    const appStateStore = useAppStateStore();
    appStateStore.disableCharts = true;
    const weekId = uuid();
    const weekId2 = uuid();
    const scheduleStore = useScheduleStore();
    scheduleStore.weeks.push(
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
    );
  });

  it('calculates data for ActivityChart', () => {
    const wrapper = mount(ActivityChart);
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
    const wrapper = mount(RatingChart);
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['No rating', '1 ★', '2 ★', '4 ★', '5 ★']);
    expect(data).toEqual([5, 1, 1, 1, 1]);
  });

  it('calculates data for IntensityChart', () => {
    const wrapper = mount(IntensityChart);
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
    const wrapper = mount(WeeklyTrainingsChart);
    const {
      labels,
      datasets: [{data: totalTrainings}, {data: completedTrainings}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Week 1', 'Week 2']);
    expect(totalTrainings).toEqual([4, 5]);
    expect(completedTrainings).toEqual([2, 3]);
  });

  it('calculates data for WeeklySummaryChart', () => {
    const wrapper = mount(WeeklySummaryChart);
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
