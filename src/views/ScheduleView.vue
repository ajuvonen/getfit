<script setup lang="ts">
import {storeToRefs} from 'pinia';
import DraggableList from 'vuedraggable';
import {useScheduleStore} from '@/stores/schedule';
import useReset from '@/hooks/reset';
import WeekCalendar from '@/components/WeekCalendar.vue';
import EditTrainingDialog from '@/components/EditTrainingDialog.vue';
import BaseView from '@/components/BaseView.vue';

const scheduleStore = useScheduleStore();
const {weeks} = storeToRefs(scheduleStore);
const {addWeek} = scheduleStore;

const reset = useReset();
</script>

<template>
  <BaseView :title="$t('schedule.title')">
    <template #content>
      <draggable-list
        v-if="weeks.length"
        v-model="weeks"
        :componentData="{variant: 'accordion', color: 'transparent'}"
        tag="v-expansion-panels"
        item-key="id"
        handle=".week-calendar__drag-handle"
        data-test-id="schedule"
      >
        <template #item="{element, index}">
          <week-calendar :week="element" :weekIndex="index" :data-test-id="`week-${index}`" />
        </template>
      </draggable-list>
    </template>
    <template #actions>
      <v-btn prepend-icon="mdi-plus" data-test-id="schedule-add-week-button" @click="addWeek">{{
        $t('schedule.addWeek')
      }}</v-btn>
      <v-btn
        prepend-icon="mdi-trash-can-outline"
        color="error"
        variant="outlined"
        data-test-id="schedule-reset-button"
        @click="reset"
        >{{ $t('schedule.reset') }}</v-btn
      >
    </template>
  </BaseView>
  <edit-training-dialog />
</template>
