<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';
import useScreen from '@/hooks/screen';
import useWeekDays from '@/hooks/weekdays';
import useLocalizedActivities from '@/hooks/localizedActivities';

defineProps<{
  weekId: string;
  weekIndex: number;
  dayIndex: number;
}>();

const {t} = useI18n();

const {deleteWeek, copyWeek, getTargetWeekAndTraining} = useScheduleStore();

const {openNewTrainingDialog, openConfirmDialog} = useAppStateStore();

const {localizedAvailableActivities} = useLocalizedActivities();

const {getDisplayWeekNumber} = useWeekDays();

const {isSmallScreen} = useScreen();

const confirmDelete = (weekId: string) => {
  const [targetWeek] = getTargetWeekAndTraining(weekId);
  if (targetWeek?.trainings.length) {
    openConfirmDialog(t('weekCalendar.deleteWeekConfirm'), () => deleteWeek(weekId));
  } else {
    deleteWeek(weekId);
  }
};
</script>
<template>
  <div class="d-flex mt-4" :class="{'flex-column': isSmallScreen}">
    <v-btn
      :data-test-id="`week-${weekIndex}-add-training-button`"
      prepend-icon="$plus"
      variant="text"
      @click="openNewTrainingDialog(weekId, dayIndex, localizedAvailableActivities)"
      >{{ $t('weekCalendar.addTraining') }}</v-btn
    >
    <v-btn
      :aria-label="$t('weekCalendar.copyWeek', [getDisplayWeekNumber(weekIndex)])"
      :data-test-id="`week-${weekIndex}-copy-button`"
      prepend-icon="$contentCopy"
      variant="text"
      @click="copyWeek(weekId)"
      >{{ $t('weekCalendar.copyWeek') }}</v-btn
    >
    <v-btn
      :aria-label="$t('weekCalendar.deleteWeek', [getDisplayWeekNumber(weekIndex)])"
      :data-test-id="`week-${weekIndex}-delete-button`"
      color="error"
      variant="outlined"
      prepend-icon="$delete"
      @click="confirmDelete(weekId)"
      >{{ $t('weekCalendar.deleteWeek') }}</v-btn
    >
  </div>
</template>
