<script setup lang="ts">
import {storeToRefs} from 'pinia';
import DraggableList from 'vuedraggable';
import WeekCalendar from '@/components/WeekCalendar.vue';
import ScheduleSettings from '@/components/ScheduleSettings.vue';
import EditTrainingDialog from '@/components/EditTrainingDialog.vue';
import {useScheduleStore} from '@/stores/schedule';

const {schedule} = storeToRefs(useScheduleStore());
</script>

<template>
  <schedule-settings />
  <draggable-list
    v-model="schedule.weeks"
    :componentData="{multiple: true, variant: 'accordion'}"
    tag="v-expansion-panels"
    item-key="id"
    handle=".v-expansion-panel-title"
    data-test-id="schedule"
  >
    <template #item="{element, index}">
      <week-calendar :week="element" :weekNumber="index + 1" :data-test-id="`week-${index + 1}`" />
    </template>
  </draggable-list>
  <edit-training-dialog />
</template>
