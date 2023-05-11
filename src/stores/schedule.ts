import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';
import {clone, lensProp, over} from 'ramda';
import type {Schedule, Training, Week} from '@/types';
import {ACTIVITIES} from '@/constants';
import {roundNearestQuarter} from '@/utils';
import {useAppStateStore} from '@/stores/appState';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedule: {
      name: '',
      startsOnSunday: false,
      availableActivities: ACTIVITIES.map(({value}) => value),
      weeks: [],
      unitOfTime: 'h',
      lockSchedule: false,
    } as Schedule,
  }),
  getters: {
    getTargetWeekAndTraining: (state) => (weekId: string, trainingId?: string) => {
      const targetWeek = state.schedule.weeks.find(({id}) => id === weekId) as Week;
      const targetTraining = trainingId
        ? targetWeek.trainings.find(({id}) => id === trainingId)
        : undefined;
      return [targetWeek, targetTraining] as [Week, Training | undefined];
    },
  },
  actions: {
    addWeek() {
      this.schedule.weeks.push({
        id: uuidv4(),
        trainings: [],
      });
    },
    deleteWeek(weekId: string) {
      this.schedule.weeks = this.schedule.weeks.filter(({id}) => id !== weekId);
    },
    copyWeek(weekId: string) {
      const [targetWeek] = this.getTargetWeekAndTraining(weekId);
      const newWeekId = uuidv4();
      const cloneWeek = {
        id: newWeekId,
        trainings: targetWeek.trainings.map((training) => ({
          ...training,
          completionSummary: '',
          id: uuidv4(),
          weekId: newWeekId,
        })),
      } as Week;
      this.schedule.weeks.push(cloneWeek);
    },
    addOrEditTraining(training: Training) {
      const [targetWeek] = this.getTargetWeekAndTraining(training.weekId);
      const targetIndex = targetWeek.trainings.findIndex(({id}) => id === training.id);
      if (targetIndex >= 0) {
        targetWeek.trainings[targetIndex] = training;
      } else {
        targetWeek.trainings.push(training);
      }
    },
    removeTraining(training: Training) {
      const [targetWeek] = this.getTargetWeekAndTraining(training.weekId);
      targetWeek.trainings = targetWeek.trainings.filter(({id}) => id !== training.id);
    },
    moveTraining(training: Training, newWeekId: string, dayIndex: number) {
      const [originalWeek, targetTraining] = this.getTargetWeekAndTraining(
        training.weekId,
        training.id
      ) as [Week, Training];
      const [targetWeek] = this.getTargetWeekAndTraining(newWeekId);
      originalWeek.trainings = originalWeek.trainings.filter(({id}) => id !== targetTraining.id);
      targetTraining.weekId = newWeekId;
      targetTraining.dayIndex = dayIndex;
      targetWeek.trainings.push(targetTraining);
    },
    reorderTrainings(week: Week, trainings: Training[]) {
      const [targetWeek] = this.getTargetWeekAndTraining(week.id);
      targetWeek.trainings = targetWeek.trainings
        .filter(({id}) => trainings.every(({id: reorderedId}) => reorderedId !== id))
        .concat(trainings);
    },
    copyTraining(training: Training, weekId: string, dayIndex: number) {
      const [targetWeek] = this.getTargetWeekAndTraining(weekId);
      const clonedTraining = {
        ...clone(training),
        id: uuidv4(),
        weekId,
        dayIndex,
        completionSummary: '',
      } as Training;
      targetWeek.trainings.push(clonedTraining);
    },
    saveCompletionSummary(training: Training, completionSummary: string) {
      const [, targetTraining] = this.getTargetWeekAndTraining(training.weekId, training.id) as [
        Week,
        Training
      ];
      targetTraining.completionSummary = completionSummary;
    },
    changeUnitOfTime(newValue: 'h' | 'm') {
      if (this.schedule.unitOfTime !== newValue) {
        const multiplier = newValue === 'h' ? 1 / 60 : 60;
        const precision = newValue === 'h' ? 2 : 0;
        this.schedule.weeks = this.schedule.weeks.map((week) => ({
          ...week,
          trainings: week.trainings.map(
            over(lensProp('duration'), (duration) =>
              roundNearestQuarter(duration * multiplier, precision)
            )
          ),
        }));
        this.schedule.unitOfTime = newValue;
      }
    },
    toggleLockSchedule() {
      const appStateStore = useAppStateStore();
      appStateStore.summaryShown = [];
      this.schedule.lockSchedule = !this.schedule.lockSchedule;
    },
  },
});
