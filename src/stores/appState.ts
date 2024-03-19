import {ref} from 'vue';
import {defineStore} from 'pinia';
import type {LocalizedActivity, Training} from '@/types';
import {useScheduleStore} from '@/stores/schedule';
import {getEmptyTraining} from '@/utils';

export const useAppStateStore = defineStore('appState', () => {
  const scheduleStore = useScheduleStore();

  // State refs
  const trainingDialogOpen = ref(false);

  const confirmDialogOpen = ref(false);

  const confirmText = ref('');

  const confirmAction = ref(() => {});

  const trainingData = ref(getEmptyTraining());

  const openWeek = ref<number | null>(0);

  const openDescriptions = ref<string[]>([]);

  // Actions
  const openConfirmDialog = (text: string, action: () => void) => {
    confirmText.value = text;
    confirmAction.value = action;
    confirmDialogOpen.value = true;
  };

  const toggleShowDescription = (trainingId: string) => {
    if (openDescriptions.value.includes(trainingId)) {
      openDescriptions.value = openDescriptions.value.filter((id) => id !== trainingId);
    } else {
      openDescriptions.value.push(trainingId);
    }
  };

  const openNewTrainingDialog = (
    weekId: string,
    dayIndex: number,
    activities: LocalizedActivity[],
  ) => {
    trainingData.value = getEmptyTraining({
      weekId,
      dayIndex,
      activity: activities[0]?.value || '',
      duration: scheduleStore.settings.defaultDuration,
    });

    trainingDialogOpen.value = true;
  };

  const openEditTrainingDialog = (training: Training) => {
    const clonedTraining = {...training};
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
    openDescriptions,
    openConfirmDialog,
    openNewTrainingDialog,
    openEditTrainingDialog,
    toggleShowDescription,
    $reset,
  };
});
