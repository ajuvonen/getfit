<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type {Training} from '@/types';
import useWeekDays from '@/hooks/weekdays';
import {useScheduleStore} from '@/stores/schedule';

const props = defineProps<{
  action: 'move' | 'copy';
  training: Training;
}>();

const scheduleStore = useScheduleStore();
const {settings, weeks} = storeToRefs(scheduleStore);
const {moveTraining, copyTraining} = scheduleStore;

const {getDisplayWeekNumber, getShortDate, weekdays} = useWeekDays();

const menuAction = props.action === 'move' ? moveTraining : copyTraining;
const menuIcon = props.action === 'move' ? 'mdi-arrow-all' : 'mdi-content-copy';
</script>
<template>
  <v-list-group>
    <template v-slot:activator="{props}">
      <v-list-item
        v-bind="props"
        :title="$t(`trainingCard.${action}`)"
        :prepend-icon="menuIcon"
      />
    </template>
    <v-list-group v-for="(week, weekIndex) in weeks" :key="week.id">
      <template v-slot:activator="{props}">
        <v-list-item
          v-bind="props"
          :title="$t('weekCalendar.weekTitle', [getDisplayWeekNumber(weekIndex)])"
        />
      </template>
      <v-list-item
        v-for="(day, dayIndex) in weekdays"
        :disabled="week.id === training.weekId && dayIndex === training.dayIndex"
        :key="day"
        :title="day"
        @click="menuAction(training, week.id, dayIndex)"
      >
        <template v-if="settings.startDate" #append>
          <span class="ml-4">{{ getShortDate(dayIndex, weekIndex) }}</span>
        </template>
      </v-list-item>
    </v-list-group>
  </v-list-group>
</template>
<style lang="scss" scoped></style>
