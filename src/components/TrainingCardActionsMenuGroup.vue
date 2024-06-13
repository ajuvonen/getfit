<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {v4 as uuid} from 'uuid';
import type {Training, Week} from '@/types';
import useWeekDays from '@/hooks/weekdays';
import {useScheduleStore} from '@/stores/schedule';
import {computed} from 'vue';

const props = defineProps<{
  action: 'move' | 'copy';
  training: Training;
}>();

const scheduleStore = useScheduleStore();
const {settings, weeks} = storeToRefs(scheduleStore);
const {moveTraining, copyTraining, addWeek, getTargetWeekAndTraining} = scheduleStore;

const {getDisplayWeekNumber, getShortDate, weekdays} = useWeekDays();

const menuAction = props.action === 'move' ? moveTraining : copyTraining;
const menuIcon = props.action === 'move' ? '$arrowAll' : '$contentCopy';

const listWeeks = computed<Week[]>(() => [
  ...weeks.value,
  {
    id: '',
    trainings: [],
  },
]);

const doMenuAction = (training: Training, weekId = uuid(), dayIndex: number) => {
  if (!getTargetWeekAndTraining(weekId)[0]) {
    addWeek(weekId);
  }
  menuAction(training, weekId, dayIndex);
};
</script>
<template>
  <v-list-group :data-test-id="`training-card-actions-${action}-menu`">
    <template v-slot:activator="{props}">
      <v-list-item
        v-bind="props"
        :title="$t(`trainingCard.${action}`)"
        :prepend-icon="menuIcon"
        :data-test-id="`training-card-actions-${action}-button`"
      />
    </template>
    <v-list-group v-for="(week, weekIndex) in listWeeks" :key="week.id">
      <template v-slot:activator="{props}">
        <v-list-item
          v-bind="props"
          :title="
            week.id
              ? $t('weekCalendar.weekTitle', [getDisplayWeekNumber(weekIndex)])
              : $t('weekCalendar.newWeek')
          "
        />
      </template>
      <v-list-item
        v-for="(day, dayIndex) in weekdays"
        :disabled="week.id === training.weekId && dayIndex === training.dayIndex"
        :key="day"
        :title="day"
        @click="doMenuAction(training, week.id || undefined, dayIndex)"
      >
        <template v-if="settings.startDate" #append>
          <span class="ml-4">{{ getShortDate(weekIndex, dayIndex) }}</span>
        </template>
      </v-list-item>
    </v-list-group>
  </v-list-group>
</template>
