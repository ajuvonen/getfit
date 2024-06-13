<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {UseSortable} from '@vueuse/integrations/useSortable/component';
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

const sortableOptions = {
  handle: '.week-calendar__drag-handle',
  delay: 250,
  delayOnTouchOnly: true,
};
</script>

<template>
  <BaseView :title="$t('schedule.title')" :guide="$t('schedule.guide')">
    <template #content>
      <v-expansion-panels v-model="openWeek" variant="accordion" color="transparent">
        <UseSortable
          v-if="weeks.length"
          v-model="weeks"
          :options="sortableOptions"
          tag="ul"
          data-test-id="schedule"
          class="schedule__draggable-list"
        >
          <week-calendar
            v-for="(week, index) in weeks"
            :key="week.id"
            :week="week"
            :weekIndex="index"
            :data-test-id="`week-${index}`"
          />
        </UseSortable>
      </v-expansion-panels>
    </template>
    <template #actions>
      <v-btn prepend-icon="$plus" data-test-id="schedule-add-week-button" @click="addWeek()">{{
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
