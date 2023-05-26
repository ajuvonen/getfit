<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import useWeekDays from '@/hooks/weekdays';
import {useScheduleStore} from '@/stores/schedule';
import SimpleTrainingCard from '@/components/SimpleTrainingCard.vue';
import type {Week} from '@/types';

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {t} = useI18n();
const {weekdays} = useWeekDays();
const trainingsByDay = computed(() => (week: Week) =>
  weekdays.value.map((weekDay, weekdayIndex) =>
    week.trainings.filter(({dayIndex}) => dayIndex === weekdayIndex)
  )
);
</script>

<template>
  <h1 class="text-h3 text-center">{{ schedule.name || t('print.title') }}</h1>
  <p class="text-center mt-10 mb-10">{{ t('print.guide') }}</p>
  <v-table v-for="(week, index) in schedule.weeks" :key="week.id" class="print-view__table">
    <template #top>
      <h3>{{ t('weekCalendar.weekTitle', [index + 1]) }}</h3>
    </template>
    <thead>
      <tr>
        <th v-for="day in weekdays" :key="day">{{ day }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th v-for="(trainings, index) in trainingsByDay(week)" :key="index">
          <simple-training-card v-for="training in trainings" :key="training.id" :training="training" />
        </th>
      </tr>
    </tbody>
  </v-table>
</template>
<style lang="scss" scoped>
.simple-training-card + .simple-training-card {
  margin-top: 1rem;
  &:before {
    content: '';
    position: absolute;
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    width: 100%;
    top: -0.5rem;
  }
}

th {
  vertical-align: top;
}

@media print {
  .print-view__table {
    page-break-after: always;
    break-after: page;
  }
}
</style>
