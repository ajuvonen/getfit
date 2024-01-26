import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {v4 as uuidv4} from 'uuid';
import {clone, lensProp, over} from 'ramda';
import {DateTime} from 'luxon';
import type {ScheduleSettings, Training, Week} from '@/types';
import {ACTIVITIES} from '@/constants';
import {roundNearestQuarter} from '@/utils';
import {computed, watch} from 'vue';

const getEmptySchedule = (): ScheduleSettings => ({
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
});

export const useScheduleStore = defineStore('schedule', () => {
  // State refs
  const settings = useStorage('getfit-settings', getEmptySchedule(), localStorage, {
    mergeDefaults: true,
  });

  const weeks = useStorage('getfit-schedule', [] as Week[], localStorage, {mergeDefaults: true});

  // Computed getters
  const getTargetWeekAndTraining = computed(() => (weekId: string, trainingId?: string) => {
    const targetWeek = weeks.value.find(({id}) => id === weekId) as Week;
    const targetTraining = trainingId
      ? targetWeek.trainings.find(({id}) => id === trainingId)
      : undefined;
    return [targetWeek, targetTraining] as [Week, Training | undefined];
  });

  // Actions
  const addWeek = () => {
    weeks.value.push({
      id: uuidv4(),
      trainings: [],
    });
  };

  const deleteWeek = (weekId: string) => {
    weeks.value = weeks.value.filter(({id}) => id !== weekId);
  };

  const copyWeek = (weekId: string) => {
    const [targetWeek] = getTargetWeekAndTraining.value(weekId);
    const newWeekId = uuidv4();
    const cloneWeek: Week = {
      id: newWeekId,
      trainings: targetWeek.trainings.map((training) => ({
        ...training,
        id: uuidv4(),
        weekId: newWeekId,
      })),
    };
    weeks.value.push(cloneWeek);
  };

  const addOrEditTraining = (training: Training) => {
    const [targetWeek] = getTargetWeekAndTraining.value(training.weekId);
    const targetIndex = targetWeek.trainings.findIndex(({id}) => id === training.id);
    if (targetIndex >= 0) {
      targetWeek.trainings[targetIndex] = training;
    } else {
      targetWeek.trainings.push(training);
    }
  };

  const deleteTraining = (training: Training) => {
    const [targetWeek] = getTargetWeekAndTraining.value(training.weekId);
    targetWeek.trainings = targetWeek.trainings.filter(({id}) => id !== training.id);
  };

  const moveTraining = (training: Training, newWeekId: string, dayIndex: number) => {
    const [originalWeek, targetTraining] = getTargetWeekAndTraining.value(
      training.weekId,
      training.id,
    ) as [Week, Training];
    const [targetWeek] = getTargetWeekAndTraining.value(newWeekId);
    originalWeek.trainings = originalWeek.trainings.filter(({id}) => id !== targetTraining.id);
    targetTraining.weekId = newWeekId;
    targetTraining.dayIndex = dayIndex;
    targetWeek.trainings.push(targetTraining);
  };

  const reorderTrainings = (weekId: string, trainings: Training[]) => {
    const [targetWeek] = getTargetWeekAndTraining.value(weekId);
    targetWeek.trainings = trainings;
  };

  const copyTraining = (training: Training, weekId: string, dayIndex: number) => {
    const [targetWeek] = getTargetWeekAndTraining.value(weekId);
    const clonedTraining: Training = {
      ...clone(training),
      id: uuidv4(),
      weekId,
      dayIndex,
    };
    targetWeek.trainings.push(clonedTraining);
  };

  // Watchers
  watch(
    () => settings.value.unitOfTime,
    (newValue, oldValue) => {
      if (newValue && newValue !== oldValue) {
        const multiplier = newValue === 'h' ? 1 / 60 : 60;
        const precision = newValue === 'h' ? 2 : 0;
        settings.value.defaultDuration = roundNearestQuarter(
          settings.value.defaultDuration * multiplier,
          precision,
        );
        weeks.value = weeks.value.map((week) => ({
          ...week,
          trainings: week.trainings.map(
            over(lensProp('duration'), (duration) =>
              roundNearestQuarter(duration * multiplier, precision),
            ),
          ),
        }));
      }
    },
  );

  watch(
    () => settings.value.startsOnSunday,
    (newValue) => {
      const parsedValue = newValue || false;
      if (settings.value.startDate) {
        const date = DateTime.fromJSDate(settings.value.startDate);
        if (parsedValue) {
          settings.value.startDate = date.minus({days: 1}).toJSDate();
        } else {
          settings.value.startDate = date.plus({days: 1}).toJSDate();
        }
      }
    },
  );

  // Reset
  const $reset = () => {
    settings.value = getEmptySchedule();
    weeks.value = [];
  };

  return {
    settings,
    weeks,
    getTargetWeekAndTraining,
    addWeek,
    deleteWeek,
    copyWeek,
    addOrEditTraining,
    deleteTraining,
    moveTraining,
    reorderTrainings,
    copyTraining,
    $reset,
  };
});
