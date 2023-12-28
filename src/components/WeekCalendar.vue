<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {groupBy, pluck} from 'ramda';
import DraggableList from 'vuedraggable';
import {useScheduleStore} from '@/stores/schedule';
import TrainingCard from '@/components/TrainingCard.vue';
import WeekCalendarActions from '@/components/WeekCalendarActions.vue';
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
const {reorderTrainings} = scheduleStore;
const {t} = useI18n();
const {isSmallScreen, isMediumScreen} = useScreenSize();
const {weekdays, shortWeekdays} = useWeekDays();
const activeDay = ref(0);

const tabContent = computed(() => {
  const days = isSmallScreen.value ? shortWeekdays : weekdays;
  return days.value.map((weekDay, weekdayIndex) => {
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
  return trainings as Record<string, Training[]>;
});
</script>
<template>
  <v-expansion-panel style="background: rgba(255,255,255,0.9)" :rounded="isSmallScreen || isMediumScreen ? 0 : 'rounded'">
    <v-expansion-panel-title>
      <div class="week-calendar__drag-handle">
        <v-icon icon="mdi-drag-vertical-variant" />
        <h2 class="text-h5">{{ t('weekCalendar.weekTitle', [weekNumber]) }}</h2>
      </div>
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
      <v-tabs v-model="activeDay" grow show-arrows>
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
      <v-window v-model="activeDay">
        <v-window-item
          v-for="({trainings}, dayIndex) in tabContent"
          :key="dayIndex"
          :value="dayIndex"
          :data-test-id="`week-${weekNumber}-day-${dayIndex}`"
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
        </v-window-item>
      </v-window>
      <week-calendar-actions
        v-if="!schedule.lockSchedule"
        :weekId="week.id"
        :weekNumber="weekNumber"
        :dayIndex="activeDay"
      ></week-calendar-actions>
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

.week-calendar__drag-handle {
  display: flex;
  align-items: center;
  cursor: move;
}

:deep(.v-expansion-panel-title__overlay) {
  pointer-events: none;
}
</style>
