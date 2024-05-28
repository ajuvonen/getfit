<script setup lang="ts">
import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import DraggableList from 'vuedraggable';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import useReset from '@/hooks/reset';
import WeekCalendar from '@/components/WeekCalendar.vue';
import EditTrainingDialog from '@/components/EditTrainingDialog.vue';
import BaseView from '@/components/BaseView.vue';

const scheduleStore = useScheduleStore();
const {weeks} = storeToRefs(scheduleStore);
const {addWeek} = scheduleStore;

const {openWeek} = storeToRefs(useAppStateStore());

const reset = useReset();

watch(
  () => weeks.value.length,
  (newValue, oldValue) => {
    if (newValue < oldValue) {
      openWeek.value = newValue - 1 || 0;
    }
  },
);

const addAndOpenWeek = () => {
  addWeek();
  openWeek.value = weeks.value.length - 1;
};
</script>

<template>
  <BaseView :title="$t('schedule.title')" :guide="$t('schedule.guide')">
    <template #content>
      <v-expansion-panels v-model="openWeek" variant="accordion" color="transparent">
        <draggable-list
          v-if="weeks.length"
          v-model="weeks"
          item-key="id"
          handle=".week-calendar__drag-handle"
          class="schedule__draggable-list"
          data-test-id="schedule"
        >
          <template #item="{element, index}">
            <week-calendar :week="element" :weekIndex="index" :data-test-id="`week-${index}`" />
          </template>
        </draggable-list>
      </v-expansion-panels>
    </template>
    <template #actions>
      <v-btn prepend-icon="$plus" data-test-id="schedule-add-week-button" @click="addAndOpenWeek">{{
        $t('schedule.addWeek')
      }}</v-btn>
      <v-btn
        prepend-icon="$trashCanOutline"
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
<style lang="scss" scoped>
.schedule__draggable-list {
  width: 100%;
}

.v-expansion-panel {
  margin-top: 0.1rem;
  border-radius: 0;
  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
