<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';
import type {Training} from '@/types';
import useWeekDays from '@/hooks/weekdays';

defineProps<{
  training: Training;
}>();
const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {removeTraining, moveTraining, copyTraining} = scheduleStore;
const appStateStore = useAppStateStore();
const {openEditTrainingDialog} = appStateStore;
const {t} = useI18n();
const {weekdays} = useWeekDays();
</script>
<template>
  <v-btn prepend-icon="mdi-pen" variant="flat" @click="openEditTrainingDialog(training)">{{
    t('trainingCard.editTraining')
  }}</v-btn>
  <v-menu location="end" :close-on-content-click="false">
    <template v-slot:activator="{props}">
      <v-btn append-icon="mdi-chevron-right" variant="flat" v-bind="props">
        {{ t('trainingCard.actions') }}
      </v-btn>
    </template>
    <v-list open-strategy="single">
      <v-list-group>
        <template v-slot:activator="{props}">
          <v-list-item
            v-bind="props"
            :title="t('trainingCard.move')"
            prepend-icon="mdi-arrow-all"
          />
        </template>
        <v-list-group v-for="(week, index) in schedule.weeks" :key="week.id">
          <template v-slot:activator="{props}">
            <v-list-item v-bind="props" :title="t('weekCalendar.weekTitle', [index + 1])" />
          </template>
          <v-list-item
            v-for="(day, dayIndex) in weekdays"
            :disabled="week.id === training.weekId && dayIndex === training.dayIndex"
            :key="day"
            :title="day"
            @click="moveTraining(training, week.id, dayIndex)"
          />
        </v-list-group>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{props}">
          <v-list-item
            v-bind="props"
            :title="t('trainingCard.copy')"
            prepend-icon="mdi-content-copy"
          />
        </template>
        <v-list-group v-for="(week, index) in schedule.weeks" :key="week.id">
          <template v-slot:activator="{props}">
            <v-list-item v-bind="props" :title="t('weekCalendar.weekTitle', [index + 1])" />
          </template>
          <v-list-item
            v-for="(day, dayIndex) in weekdays"
            :key="day"
            :title="day"
            @click="copyTraining(training, week.id, dayIndex)"
          />
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-menu>
  <v-btn
    prepend-icon="mdi-delete"
    variant="outlined"
    color="error"
    class="training-card__delete-button"
    @click="removeTraining(training)"
    >{{ t('trainingCard.deleteTraining') }}</v-btn
  >
</template>
