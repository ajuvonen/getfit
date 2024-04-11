<script setup lang="ts">
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

const {deleteWeek, copyWeek} = useScheduleStore();

const {openNewTrainingDialog} = useAppStateStore();

const {localizedAvailableActivities} = useLocalizedActivities();

const {getDisplayWeekNumber} = useWeekDays();

const {isSmallScreen} = useScreen();
</script>
<template>
  <div class="week-calendar__actions d-flex mt-4" :class="{'flex-column': isSmallScreen}">
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
      @click="deleteWeek(weekId)"
      >{{ $t('weekCalendar.deleteWeek') }}</v-btn
    >
  </div>
</template>
