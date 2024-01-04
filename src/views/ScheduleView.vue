<script setup lang="ts">
import {storeToRefs} from 'pinia';
import DraggableList from 'vuedraggable';
import {useScheduleStore} from '@/stores/schedule';
import WeekCalendar from '@/components/WeekCalendar.vue';
import ScheduleSettings from '@/components/ScheduleSettings.vue';
import EditTrainingDialog from '@/components/EditTrainingDialog.vue';

const {schedule} = storeToRefs(useScheduleStore());
</script>

<template>
  <schedule-settings />
  <draggable-list
    v-if="schedule.weeks.length"
    v-model="schedule.weeks"
    :componentData="{variant: 'accordion', color: 'transparent'}"
    tag="v-expansion-panels"
    item-key="id"
    handle=".week-calendar__drag-handle"
    data-test-id="schedule"
    class="mb-10"
  >
    <template #item="{element, index}">
      <week-calendar :week="element" :weekNumber="index + 1" :data-test-id="`week-${index + 1}`" />
    </template>
  </draggable-list>
  <edit-training-dialog />
</template>
