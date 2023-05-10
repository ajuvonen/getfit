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
      this.trainingData = {
        id: uuidv4(),
        weekId,
        dayIndex,
        duration: 0,
        activity: '',
        description: '',
        title: '',
        intensity: 0,
        completionSummary: '',
        location: '',
      };
      this.trainingDialogOpen = true;
    },
    openEditTrainingDialog(training: Training) {
      const scheduleStore = useScheduleStore();
      const clonedTraining = clone(training);
      if (
        clonedTraining.activity &&
        !scheduleStore.schedule.availableActivities.includes(clonedTraining.activity)
      ) {
        clonedTraining.activity = '';
      }
      this.trainingData = clonedTraining;
      this.trainingDialogOpen = true;
    },
    closeEditTrainingDialog() {
      this.trainingDialogOpen = false;
    },
  },
});
