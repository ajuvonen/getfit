<script setup lang="ts">
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';
import useScreenSize from '@/hooks/screenSize';
import useWeekDays from '@/hooks/weekdays';

defineProps<{
  weekId: string;
  weekIndex: number;
  dayIndex: number;
}>();

const scheduleStore = useScheduleStore();
const {deleteWeek, copyWeek} = scheduleStore;

const {openNewTrainingDialog} = useAppStateStore();

const {getDisplayWeekNumber} = useWeekDays();

const {isSmallScreen} = useScreenSize();
</script>
<template>
  <div class="week-calendar__actions d-flex mt-4" :class="{'flex-column': isSmallScreen}">
    <v-btn
      :data-test-id="`week-${weekIndex}-add-training-button`"
      prepend-icon="mdi-plus"
      variant="tonal"
      @click="openNewTrainingDialog(weekId, dayIndex)"
      >{{ $t('weekCalendar.addTraining') }}</v-btn
    >
    <v-btn
      :aria-label="$t('weekCalendar.copyWeek', [getDisplayWeekNumber(weekIndex)])"
      :data-test-id="`week-${weekIndex}-copy-button`"
      prepend-icon="mdi-content-copy"
      variant="tonal"
      @click="copyWeek(weekId)"
      >{{ $t('weekCalendar.copyWeek') }}</v-btn
    >
    <v-btn
      :aria-label="$t('weekCalendar.deleteWeek', [getDisplayWeekNumber(weekIndex)])"
      :data-test-id="`week-${weekIndex}-delete-button`"
      color="error"
      variant="outlined"
      prepend-icon="mdi-delete"
      @click="deleteWeek(weekId)"
      >{{ $t('weekCalendar.deleteWeek') }}</v-btn
    >
  </div>
</template>
