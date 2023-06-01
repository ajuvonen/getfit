<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import useWeekDays from '@/hooks/weekdays';
import {useScheduleStore} from '@/stores/schedule';
import SimpleTrainingCard from '@/components/SimpleTrainingCard.vue';
import WeekSupplement from '@/components/WeekSupplement.vue';
import PrintViewTable from '@/components/PrintViewTable.vue';
import type {Week} from '@/types';

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {t} = useI18n();
const {shortWeekdays} = useWeekDays();
const trainingsByDay = computed(() => (week: Week) =>
  shortWeekdays.value.map((weekDay, weekdayIndex) =>
    week.trainings.filter(({dayIndex}) => dayIndex === weekdayIndex)
  )
);
</script>

<template>
  <h1 class="text-h3 text-center d-print-none">{{ schedule.name || t('print.title') }}</h1>
  <p class="text-center text-subtitle-1 mt-10 mb-10 d-print-none">{{ t('print.guide') }}</p>
  <div
    v-for="(week, weekIndex) in schedule.weeks"
    :key="week.id"
    class="print-view__table-container"
  >
    <print-view-table :tableTitle="t('weekCalendar.weekTitle', [weekIndex + 1])">
      <template #header>
        <tr>
          <th v-for="day in shortWeekdays" :key="day">{{ day }}</th>
        </tr>
      </template>
      <template #body>
        <tr>
          <td v-for="(trainings, dayIndex) in trainingsByDay(week)" :key="dayIndex">
            <simple-training-card
              v-for="training in trainings"
              :key="training.id"
              :training="training"
            />
          </td>
        </tr>
      </template>
    </print-view-table>
    <print-view-table :tableTitle="t('print.supplement', [weekIndex + 1])">
      <template #header>
        <tr>
          <th width="60%">{{ t('print.instructions') }}</th>
          <th>{{ t('print.notes') }}</th>
        </tr>
      </template>
      <template #body>
        <tr>
          <td>
            <week-supplement
              v-for="(trainings, dayIndex) in trainingsByDay(week)"
              :key="dayIndex"
              :trainings="trainings"
              :dayIndex="dayIndex"
            />
          </td>
          <td></td>
        </tr>
      </template>
    </print-view-table>
  </div>
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
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity)) !important;
}

td {
  vertical-align: top;
}

@media screen {
  .print-view__table-container {
    margin-top: 4rem;
  }

  .print-view__table + .print-view__table {
    margin-top: 2rem;
  }
}
</style>
