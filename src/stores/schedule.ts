import {computed, watch} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {v4 as uuid} from 'uuid';
import {DateTime} from 'luxon';
import {arrayMoveImmutable} from 'array-move';
import type {Rating, ScheduleSettings, Training, Week} from '@/types';
import {getEmptySettings} from '@/utils';

export const useScheduleStore = defineStore('schedule', () => {
  // State refs
  const settings = useStorage<ScheduleSettings>(
    'getfit-settings',
    getEmptySettings(),
    localStorage,
    {
      mergeDefaults: true,
      serializer: {
        read: (v) =>
          v
            ? JSON.parse(v, (key, value) => {
                if (key === 'startDate' && value) {
                  return DateTime.fromISO(value).toJSDate();
                }
                return value;
              })
            : null,
        write: (v) => JSON.stringify(v),
      },
    },
  );

  const weeks = useStorage<Week[]>('getfit-schedule', [], localStorage, {mergeDefaults: true});

  // Computed getters
  const getTargetWeekAndTraining = computed(
    () =>
      (weekId: string, trainingId?: string): [Week | undefined, Training | undefined] => {
        const targetWeek = weeks.value.find(({id}) => id === weekId) as Week;
        const targetTraining = targetWeek && trainingId
          ? targetWeek.trainings.find(({id}) => id === trainingId)
          : undefined;
        return [targetWeek, targetTraining];
      },
  );

  const getAllTrainings = computed(() => weeks.value.flatMap(({trainings}) => trainings));

  const getTrainingsCount = computed(() => getAllTrainings.value.length);

  const getCompletedTrainingsCount = computed(
    () => getAllTrainings.value.filter(({completed}) => completed).length,
  );

  // Actions
  const addWeek = (newWeekId = uuid()) => {
    if (getTargetWeekAndTraining.value(newWeekId)[0]) {
      return;
    }
    weeks.value.push({
      id: newWeekId,
      trainings: [],
    });
  };

  const deleteWeek = (weekId: string) => {
    weeks.value = weeks.value.filter(({id}) => id !== weekId);
  };

  const copyWeek = (weekId: string) => {
    const [targetWeek] = getTargetWeekAndTraining.value(weekId);
    if (targetWeek) {
      const newWeekId = uuid();
      weeks.value.push({
        id: newWeekId,
        trainings: targetWeek.trainings.map((training) => ({
          ...training,
          id: uuid(),
          weekId: newWeekId,
          completed: false,
          rating: null,
        })),
      });
    }
  };

  const addOrEditTraining = (training: Training) => {
    const [targetWeek] = getTargetWeekAndTraining.value(training.weekId);
    if (targetWeek) {
      const targetIndex = targetWeek.trainings.findIndex(({id}) => id === training.id);
      if (targetIndex >= 0) {
        targetWeek.trainings[targetIndex] = training;
      } else {
        targetWeek.trainings.push(training);
      }
    }
  };

  const deleteTraining = (training: Training) => {
    const [targetWeek] = getTargetWeekAndTraining.value(training.weekId);
    if (targetWeek) {
      targetWeek.trainings = targetWeek.trainings.filter(({id}) => id !== training.id);
    }
  };

  const moveTraining = (training: Training, newWeekId: string, dayIndex: number) => {
    const [originalWeek, targetTraining] = getTargetWeekAndTraining.value(
      training.weekId,
      training.id,
    );
    const [targetWeek] = getTargetWeekAndTraining.value(newWeekId);
    if (originalWeek && targetWeek && targetTraining) {
      originalWeek.trainings = originalWeek.trainings.filter(({id}) => id !== targetTraining.id);
      targetTraining.weekId = newWeekId;
      targetTraining.dayIndex = dayIndex;
      targetWeek.trainings.push(targetTraining);
    }
  };

  const reorderTrainings = (weekId: string, oldIndex: number, newIndex: number) => {
    const [targetWeek] = getTargetWeekAndTraining.value(weekId);
    if (targetWeek) {
      targetWeek.trainings = arrayMoveImmutable(targetWeek.trainings, oldIndex, newIndex);
    }
  };

  const copyTraining = (training: Training, weekId: string, dayIndex: number) => {
    const [targetWeek] = getTargetWeekAndTraining.value(weekId);
    if (targetWeek) {
      targetWeek.trainings.push({
        ...training,
        id: uuid(),
        weekId,
        dayIndex,
        completed: false,
        rating: null,
      });
    }
  };

  const toggleCompletion = (training: Training) => {
    const [, targetTraining] = getTargetWeekAndTraining.value(training.weekId, training.id);
    if (targetTraining) {
      targetTraining.completed = !targetTraining.completed;
      targetTraining.rating = null;
    }
  };

  const updateRating = (training: Training, rating: Rating) => {
    const [, targetTraining] = getTargetWeekAndTraining.value(training.weekId, training.id);
    if (targetTraining) {
      if (rating === targetTraining.rating) {
        targetTraining.rating = null;
      } else {
        targetTraining.rating = rating;
      }
    }
  };

  // Watchers
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
      weeks.value.forEach((week) => {
        week.trainings = week.trainings.map((training) => {
          let newDayIndex = parsedValue ? training.dayIndex + 1 : training.dayIndex - 1;
          if (newDayIndex < 0) {
            newDayIndex = 6;
          } else if (newDayIndex > 6) {
            newDayIndex = 0;
          }
          return {
            ...training,
            dayIndex: newDayIndex,
          };
        });
      });
    },
  );

  // Reset
  const $reset = () => {
    settings.value = getEmptySettings();
    weeks.value = [];
  };

  return {
    getTargetWeekAndTraining,
    getTrainingsCount,
    getCompletedTrainingsCount,
    getAllTrainings,
    settings,
    weeks,
    addOrEditTraining,
    addWeek,
    copyTraining,
    copyWeek,
    deleteTraining,
    deleteWeek,
    moveTraining,
    reorderTrainings,
    toggleCompletion,
    updateRating,
    $reset,
  };
});
