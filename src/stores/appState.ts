import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';
import type {Training} from '@/types';
import {clone} from 'ramda';
import {useScheduleStore} from './schedule';

export const useAppStateStore = defineStore('appState', {
  state: () => ({
    trainingDialogOpen: false,
    trainingData: {} as Training,
  }),
  actions: {
    openNewTrainingDialog(weekId: string, dayIndex: number) {
      const scheduleStore = useScheduleStore();
      this.trainingData = {
        id: uuidv4(),
        weekId,
        dayIndex,
        duration: scheduleStore.settings.defaultDuration,
        activity: '',
        description: '',
        title: '',
        intensity: 0,
        location: '',
      };
      this.trainingDialogOpen = true;
    },
    openEditTrainingDialog(training: Training) {
      const scheduleStore = useScheduleStore();
      const clonedTraining = clone(training);
      if (
        clonedTraining.activity &&
        !scheduleStore.settings.availableActivities.includes(clonedTraining.activity)
      ) {
        clonedTraining.activity = '';
      }
      this.trainingData = clonedTraining;
      this.trainingDialogOpen = true;
    },
  },
});
