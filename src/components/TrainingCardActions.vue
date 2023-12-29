<script setup lang="ts">
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
const {deleteTraining, moveTraining, copyTraining} = scheduleStore;

const appStateStore = useAppStateStore();
const {openEditTrainingDialog} = appStateStore;

const {weekdays} = useWeekDays();
</script>
<template>
  <v-menu location="top center" :close-on-content-click="false">
    <template v-slot:activator="{props}">
      <v-btn
        :aria-label="$t('trainingCard.actionsLabel', training.activity)"
        prepend-icon="mdi-menu"
        variant="flat"
        v-bind="props"
        class="training-card__action-button"
      >
        {{ $t('trainingCard.actions') }}
      </v-btn>
    </template>
    <v-list open-strategy="single">
      <v-list-item
        :title="$t('trainingCard.editTraining')"
        prepend-icon="mdi-pen"
        class="training-card__edit-button"
        @click="openEditTrainingDialog(training)"
      />
      <v-list-group>
        <template v-slot:activator="{props}">
          <v-list-item
            v-bind="props"
            :title="$t('trainingCard.move')"
            prepend-icon="mdi-arrow-all"
          />
        </template>
        <v-list-group v-for="(week, index) in schedule.weeks" :key="week.id">
          <template v-slot:activator="{props}">
            <v-list-item v-bind="props" :title="$t('weekCalendar.weekTitle', [index + 1])" />
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
            :title="$t('trainingCard.copy')"
            prepend-icon="mdi-content-copy"
          />
        </template>
        <v-list-group v-for="(week, index) in schedule.weeks" :key="week.id">
          <template v-slot:activator="{props}">
            <v-list-item v-bind="props" :title="$t('weekCalendar.weekTitle', [index + 1])" />
          </template>
          <v-list-item
            v-for="(day, dayIndex) in weekdays"
            :key="day"
            :title="day"
            @click="copyTraining(training, week.id, dayIndex)"
          />
        </v-list-group>
      </v-list-group>
      <v-list-item
        :title="$t('trainingCard.deleteTraining')"
        prepend-icon="mdi-delete"
        class="text-error training-card__delete-button"
        @click="deleteTraining(training)"
      />
    </v-list>
  </v-menu>
</template>
