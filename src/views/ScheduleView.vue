<script setup lang="ts">
import {storeToRefs} from 'pinia';
import DraggableList from 'vuedraggable';
import {useScheduleStore} from '@/stores/schedule';
import WeekCalendar from '@/components/WeekCalendar.vue';
import ScheduleSettings from '@/components/ScheduleSettings.vue';
import EditTrainingDialog from '@/components/EditTrainingDialog.vue';

const {weeks} = storeToRefs(useScheduleStore());
</script>

<template>
  <schedule-settings />
  <draggable-list
    v-if="weeks.length"
    v-model="weeks"
    :componentData="{variant: 'accordion', color: 'transparent'}"
    tag="v-expansion-panels"
    item-key="id"
    handle=".week-calendar__drag-handle"
    data-test-id="schedule"
    class="mb-10"
  >
    <template #item="{element, index}">
      <week-calendar :week="element" :weekIndex="index" :data-test-id="`week-${index}`" />
    </template>
  </draggable-list>
  <edit-training-dialog />
</template>
