<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';
import useScreenSize from '@/hooks/screenSize';

defineProps<{
  weekId: string;
  weekNumber: number;
  dayIndex: number;
}>();

const scheduleStore = useScheduleStore();
const {deleteWeek, copyWeek} = scheduleStore;
const {openNewTrainingDialog} = useAppStateStore();
const {isSmallScreen} = useScreenSize();
const {t} = useI18n();
</script>
<template>
  <div class="week-calendar__actions d-flex mt-4" :class="{'flex-column': isSmallScreen}">
    <v-btn
      :data-test-id="`week-${weekNumber}-add-training-button`"
      prepend-icon="mdi-plus"
      variant="flat"
      @click="openNewTrainingDialog(weekId, dayIndex)"
      >{{ t('weekCalendar.addTraining') }}</v-btn
    >
    <v-btn
      :aria-label="t('weekCalendar.copyWeek', [weekNumber])"
      :data-test-id="`week-${weekNumber}-copy-button`"
      prepend-icon="mdi-content-copy"
      variant="flat"
      @click="copyWeek(weekId)"
      >{{ t('weekCalendar.copyWeek') }}</v-btn
    >
    <v-btn
      :aria-label="t('weekCalendar.deleteWeek', [weekNumber])"
      :data-test-id="`week-${weekNumber}-delete-button`"
      color="error"
      variant="outlined"
      prepend-icon="mdi-delete"
      @click="deleteWeek(weekId)"
      >{{ t('weekCalendar.deleteWeek') }}</v-btn
    >
  </div>
</template>
