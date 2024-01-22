import {ref} from 'vue';
import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';
import type {Training} from '@/types';
import {clone} from 'ramda';
import {useScheduleStore} from './schedule';

export const useAppStateStore = defineStore('appState', () => {
  // State refs
  const trainingDialogOpen = ref(false);

  const confirmDialogOpen = ref(false);

  const confirmText = ref('');

  const confirmAction = ref(() => {});

  const trainingData = ref({} as Training);

  // Actions
  const openConfirmDialog = (text: string, action: () => void) => {
    confirmText.value = text;
    confirmAction.value = action;
    confirmDialogOpen.value = true;
  };

  const openNewTrainingDialog = (weekId: string, dayIndex: number) => {
    const scheduleStore = useScheduleStore();
    trainingData.value = {
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
    trainingDialogOpen.value = true;
  };

  const openEditTrainingDialog = (training: Training) => {
    const scheduleStore = useScheduleStore();
    const clonedTraining = clone(training);
    if (
      clonedTraining.activity &&
      !scheduleStore.settings.availableActivities.includes(clonedTraining.activity)
    ) {
      clonedTraining.activity = '';
    }
    trainingData.value = clonedTraining;
    trainingDialogOpen.value = true;
  };

  const $reset = () => {
    trainingDialogOpen.value = false;
    trainingData.value = {} as Training;
  };

  return {
    confirmDialogOpen,
    confirmText,
    confirmAction,
    trainingDialogOpen,
    trainingData,
    openConfirmDialog,
    openNewTrainingDialog,
    openEditTrainingDialog,
    $reset,
  };
});
