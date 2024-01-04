<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import useWeekDays from '@/hooks/weekdays';
import useScreenSize from '@/hooks/screenSize';
import {useScheduleStore} from '@/stores/schedule';
import type {Week} from '@/types';
import {SHORT_DATE_FORMATS} from '@/constants';
import SimpleTrainingCard from '@/components/SimpleTrainingCard.vue';
import WeekSupplement from '@/components/WeekSupplement.vue';
import PrintViewTable from '@/components/PrintViewTable.vue';

const scheduleStore = useScheduleStore();
const {settings, weeks} = storeToRefs(scheduleStore);

const {isSmallScreen, isMediumScreen} = useScreenSize();

const {shortWeekdays, getWeekStart, getDisplayWeekNumber, getDateInterval} = useWeekDays();

const trainingsByDay = computed(
  () => (week: Week) =>
    shortWeekdays.value.map((weekDay, weekdayIndex) =>
      week.trainings.filter(({dayIndex}) => dayIndex === weekdayIndex),
    ),
);
</script>

<template>
  <v-card
    color="rgba(255,255,255,0.9)"
    class="mb-10"
    :rounded="isSmallScreen || isMediumScreen ? 0 : 'rounded'"
  >
    <v-card-text>
      <p class="text-center text-subtitle-1 mb-10 d-print-none">{{ $t('print.guide') }}</p>
      <div
        v-for="(week, weekIndex) in weeks"
        :key="week.id"
        class="print-view__table-container"
      >
        <print-view-table :data-test-id="`week-${weekIndex + 1}-table`">
          <template #title>
            <div class="d-flex align-center">
              <h2 class="text-h5 ml-4">
                {{ $t('weekCalendar.weekTitle', [getDisplayWeekNumber(weekIndex + 1)]) }}
              </h2>
              <div v-if="settings.startDate" class="ml-4">
                {{ getDateInterval(weekIndex + 1) }}
              </div>
            </div>
          </template>
          <template v-if="week.trainings.length" #header>
            <tr>
              <th v-for="(day, dayIndex) in shortWeekdays" :key="day">
                <div>{{ day }}</div>
                <div v-if="settings.startDate">
                  {{
                    getWeekStart(weekIndex + 1)
                      .plus({days: dayIndex})
                      .toFormat(SHORT_DATE_FORMATS[$i18n.locale])
                  }}
                </div>
              </th>
            </tr>
          </template>
          <template #body>
            <tr v-if="week.trainings.length">
              <td v-for="(trainings, dayIndex) in trainingsByDay(week)" :key="dayIndex">
                <simple-training-card
                  v-for="training in trainings"
                  :key="training.id"
                  :training="training"
                />
              </td>
            </tr>
            <tr v-else>
              <td colspan="7" class="text-uppercase text-subtitle-2">
                {{ $t('weekCalendar.noTrainings') }}
              </td>
            </tr>
          </template>
        </print-view-table>
        <print-view-table
          v-if="week.trainings.length"
          :tableTitle="$t('print.supplement', [getDisplayWeekNumber(weekIndex + 1)])"
          :data-test-id="`week-${weekIndex + 1}-supplement`"
        >
          <template #header>
            <tr>
              <th width="60%">{{ $t('print.instructions') }}</th>
              <th>{{ $t('print.notes') }}</th>
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
    </v-card-text>
  </v-card>
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

@media screen {
  .print-view__table-container + .print-view__table-container {
    margin-top: 40px;
  }
}

@media print {
  .v-card {
    box-shadow: none;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
