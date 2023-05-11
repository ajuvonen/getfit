<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {groupBy, pluck} from 'ramda';
import DraggableList from 'vuedraggable';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import TrainingCard from '@/components/TrainingCard.vue';
import {type Week, Intensity, type Training} from '@/types';
import {getIntensityColor} from '@/utils';
import useScreenSize from '@/hooks/screenSize';
import useWeekDays from '@/hooks/weekdays';

const props = defineProps<{
  week: Week;
  weekNumber: number;
}>();

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {openNewTrainingDialog} = useAppStateStore();
const {deleteWeek, copyWeek, reorderTrainings} = scheduleStore;
const {t} = useI18n();
const {isSmallScreen} = useScreenSize();
const {weekdays} = useWeekDays();
const tab = ref(0);

const tabContent = computed(() => {
  return weekdays.value.map((weekDay, weekdayIndex) => {
    const trainings = props.week.trainings.filter(({dayIndex}) => dayIndex === weekdayIndex);
    const maxIntensity = Math.max(...pluck('intensity', trainings));

    return {
      weekDay,
      trainings,
      maxIntensity,
    };
  });
});

const groupedTrainings = computed(() => {
  const trainings = groupBy(({intensity}) => intensity.toString(), props.week.trainings);
  return trainings;
});
</script>
<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <h2 class="text-h5">{{ t('weekCalendar.weekTitle', [weekNumber]) }}</h2>
      <v-chip
        v-for="[intensity, group] in Object.entries(groupedTrainings)"
        :key="intensity"
        :color="getIntensityColor(+intensity)"
        :title="
          t('weekCalendar.weekChipTitle', [t(`intensities.${Intensity[+intensity]}`), group.length])
        "
        :aria-label="
          t('weekCalendar.weekChipTitle', [t(`intensities.${Intensity[+intensity]}`), group.length])
        "
        class="ml-3"
        >{{ group.length }}</v-chip
      >
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-tabs v-model="tab" grow show-arrows>
        <v-tab
          v-for="({weekDay, trainings, maxIntensity}, dayIndex) in tabContent"
          :key="weekDay"
          :value="dayIndex"
          :data-test-id="`week-${weekNumber}-calendar-tab-${dayIndex}`"
        >
          {{ weekDay }}
          <v-chip
            v-if="trainings.length"
            :color="getIntensityColor(maxIntensity)"
            :title="
              t('weekCalendar.dayChipTitle', [
                trainings.length,
                t(`intensities.${Intensity[maxIntensity]}`),
              ])
            "
            :aria-label="
              t('weekCalendar.dayChipTitle', [
                trainings.length,
                t(`intensities.${Intensity[maxIntensity]}`),
              ])
            "
            class="ml-3"
            >{{ trainings.length }}</v-chip
          >
        </v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item
          v-for="({trainings}, dayIndex) in tabContent"
          :key="dayIndex"
          :value="dayIndex"
          :transition="false"
          :reverse-transition="false"
        >
          <draggable-list
            :model-value="trainings"
            :componentData="{multiple: true, variant: 'accordion'}"
            :class="{'flex-column': isSmallScreen}"
            tag="ul"
            item-key="id"
            handle=".v-card-item"
            class="d-flex flex-wrap"
            @update:model-value="(reorderedTrainings: Training[]) => reorderTrainings(week, reorderedTrainings)"
          >
            <template #item="{element}">
              <li>
                <training-card :training="element" />
              </li>
            </template>
          </draggable-list>
          <div v-if="!schedule.lockSchedule" class="week-calendar__actions d-flex mt-4" :class="{'flex-column': isSmallScreen}">
            <v-btn
              :data-test-id="`week-${weekNumber}-add-training-button`"
              prepend-icon="mdi-plus"
              variant="flat"
              @click="openNewTrainingDialog(week.id, dayIndex)"
              >{{ t('weekCalendar.addTraining') }}</v-btn
            >
            <v-btn
              :aria-label="t('weekCalendar.copyWeek', [weekNumber])"
              prepend-icon="mdi-content-copy"
              variant="flat"
              @click="copyWeek(week.id)"
              >{{ t('weekCalendar.copyWeek') }}</v-btn
            >
            <v-btn
              :aria-label="t('weekCalendar.deleteWeek', [weekNumber])"
              color="error"
              variant="outlined"
              prepend-icon="mdi-delete"
              @click="deleteWeek(week.id)"
              >{{ t('weekCalendar.deleteWeek') }}</v-btn
            >
          </div>
        </v-window-item>
      </v-window>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<style lang="scss" scoped>
ul {
  list-style-type: none;
}

.week-calendar__actions {
  gap: 0.5rem;
  &.flex-column {
    align-items: stretch;
  }
}

</style>
