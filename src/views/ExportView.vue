<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {createEvents} from 'ics';
import useWeekDays from '@/hooks/weekdays';
import useCalendarExport from '@/hooks/calendarExport';
import {useScheduleStore} from '@/stores/schedule';
import type {Week} from '@/types';
import SimpleTrainingCard from '@/components/SimpleTrainingCard.vue';
import WeekSupplement from '@/components/WeekSupplement.vue';
import PrintViewTable from '@/components/PrintViewTable.vue';
import BaseView from '@/components/BaseView.vue';

const {settings, weeks} = storeToRefs(useScheduleStore());

const {t} = useI18n();

const {createCalendarEvents} = useCalendarExport();

const {shortWeekdays, getShortDate, getDisplayWeekNumber, getDateInterval} = useWeekDays();

const trainingsByDay = computed(
  () => (week: Week) =>
    shortWeekdays.value.map((_weekDay, weekdayIndex) =>
      week.trainings.filter(({dayIndex}) => dayIndex === weekdayIndex),
    ),
);

const downloadICS = async () => {
  const events = createCalendarEvents();
  const {value, error} = createEvents(events);
  if (error) {
    console.error(error);
  } else if (value) {
    const file = new File([value], t('export.filename'), {type: 'text/calendar'});
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = t('export.filename');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  }
};

const print = () => {
  window.print();
};
</script>

<template>
  <BaseView :title="$t('export.title')" :guide="$t('export.guide')">
    <template #content>
      <div class="export__button-container d-print-none d-flex flex-wrap justify-center mb-4">
        <v-btn
          v-if="settings.startDate"
          prepend-icon="$calendar"
          variant="text"
          data-test-id="export-download-button"
          @click="downloadICS"
          >{{ $t('export.download') }}</v-btn
        >
        <v-btn
          prepend-icon="$printer"
          variant="text"
          data-test-id="export-print-button"
          @click="print"
          >{{ $t('export.print') }}</v-btn
        >
      </div>
      <div v-for="(week, weekIndex) in weeks" :key="week.id" class="export__table-container">
        <PrintViewTable :data-test-id="`week-${weekIndex}-table`">
          <template #title>
            <div class="d-flex align-center">
              <h2 class="text-h5">
                {{ $t('weekCalendar.weekTitle', [getDisplayWeekNumber(weekIndex)]) }}
              </h2>
              <div v-if="settings.startDate" class="ml-4">
                {{ getDateInterval(weekIndex) }}
              </div>
            </div>
          </template>
          <template v-if="week.trainings.length" #header>
            <tr>
              <th v-for="(day, dayIndex) in shortWeekdays" :key="day">
                <div>{{ day }}</div>
                <div v-if="settings.startDate">
                  {{ getShortDate(weekIndex, dayIndex) }}
                </div>
              </th>
            </tr>
          </template>
          <template #body>
            <tr v-if="week.trainings.length">
              <td v-for="(trainings, dayIndex) in trainingsByDay(week)" :key="dayIndex">
                <SimpleTrainingCard
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
        </PrintViewTable>
        <PrintViewTable
          v-if="week.trainings.length"
          :tableTitle="$t('export.supplement', [getDisplayWeekNumber(weekIndex)])"
          :data-test-id="`week-${weekIndex}-supplement`"
          :striped="false"
        >
          <template #header>
            <tr>
              <th width="60%">{{ $t('export.instructions') }}</th>
              <th class="hidden-screen-only">{{ $t('export.notes') }}</th>
            </tr>
          </template>
          <template #body>
            <tr>
              <td>
                <WeekSupplement
                  v-for="(trainings, dayIndex) in trainingsByDay(week)"
                  :key="dayIndex"
                  :trainings="trainings"
                  :dayIndex="dayIndex"
                />
              </td>
              <td class="hidden-screen-only"></td>
            </tr>
          </template>
        </PrintViewTable>
      </div>
    </template>
  </BaseView>
</template>
<style scoped>
.export__button-container {
  gap: 0.5rem;
}

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
  .export__table-container + .export__table-container {
    margin-top: 40px;
  }
}

@media print {
  .v-card {
    width: 100vw;
    box-shadow: none;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
