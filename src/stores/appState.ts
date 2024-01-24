import {ref} from 'vue';
import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';
import type {LocalizedActivity, Training} from '@/types';
import {clone} from 'ramda';
import {useScheduleStore} from '@/stores/schedule';

export const useAppStateStore = defineStore('appState', () => {
  const scheduleStore = useScheduleStore();

  // State refs
  const trainingDialogOpen = ref(false);

  const confirmDialogOpen = ref(false);

  const confirmText = ref('');

  const confirmAction = ref(() => {});

  const trainingData = ref({} as Training);

  const openWeek = ref<number | null>(0);

  // Actions
  const openConfirmDialog = (text: string, action: () => void) => {
    confirmText.value = text;
    confirmAction.value = action;
    confirmDialogOpen.value = true;
  };

  const openNewTrainingDialog = (weekId: string, dayIndex: number, activities: LocalizedActivity[] ) => {
    trainingData.value = {
      id: uuidv4(),
      weekId,
      dayIndex,
      duration: scheduleStore.settings.defaultDuration,
      activity: activities[0]?.value || '',
      description: '',
      title: '',
      intensity: 0,
      location: '',
    };
    trainingDialogOpen.value = true;
  };

  const openEditTrainingDialog = (training: Training) => {
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
    confirmDialogOpen.value = false;
    confirmText.value = '';
    confirmAction.value = () => {};
    openWeek.value = null;
  };

  return {
    confirmDialogOpen,
    confirmText,
    confirmAction,
    openWeek,
    trainingDialogOpen,
    trainingData,
    openConfirmDialog,
    openNewTrainingDialog,
    openEditTrainingDialog,
    $reset,
  };
});
