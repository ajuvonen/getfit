<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {groupBy, pluck} from 'ramda';
import DraggableList from 'vuedraggable';
import {useScheduleStore} from '@/stores/schedule';
import {type Week, Intensity, type Training} from '@/types';
import {getIntensityColor} from '@/utils';
import useScreenSize from '@/hooks/screenSize';
import useWeekDays from '@/hooks/weekdays';
import TrainingCard from '@/components/TrainingCard.vue';
import WeekCalendarActions from '@/components/WeekCalendarActions.vue';
import {useI18n} from 'vue-i18n';

const props = defineProps<{
  week: Week;
  weekIndex: number;
}>();

const scheduleStore = useScheduleStore();
const {settings} = storeToRefs(scheduleStore);
const {reorderTrainings} = scheduleStore;

const {t} = useI18n();

const {isSmallScreen, isMediumScreen} = useScreenSize();

const {weekdays, shortWeekdays, getDateInterval, getDisplayWeekNumber} = useWeekDays();

const activeDay = ref<number | null>(null);

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

const getWeekChipTitle = (intensity: Intensity, count: number) =>
  t('weekCalendar.weekChipTitle', [t(`intensities.${intensity}`), count]);

const getDayChipTitle = (intensity: Intensity, count: number) =>
  t('weekCalendar.dayChipTitle', [count, t(`intensities.${intensity}`)]);
</script>
<template>
  <v-expansion-panel
    style="background: rgba(255, 255, 255, 0.9)"
    :rounded="isSmallScreen || isMediumScreen ? 0 : 'rounded'"
  >
    <v-expansion-panel-title>
      <div class="week-calendar__drag-handle">
        <v-icon icon="mdi-drag-vertical-variant" />
        <h2 class="text-h5">
          {{ $t('weekCalendar.weekTitle', [getDisplayWeekNumber(weekIndex)]) }}
        </h2>
      </div>
      <div v-if="!isSmallScreen && settings.startDate" class="ml-4">
        {{ getDateInterval(weekIndex) }}
      </div>
      <v-chip
        v-for="[intensity, group] in Object.entries(groupedTrainings)"
        :key="intensity"
        :color="getIntensityColor(+intensity)"
        :title="getWeekChipTitle(+intensity, group.length)"
        :aria-label="getWeekChipTitle(+intensity, group.length)"
        variant="flat"
        label
        class="ml-4"
        >{{ group.length }}</v-chip
      >
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-tabs v-model="activeDay" grow show-arrows center-active>
        <v-tab
          v-for="({weekDay, trainings, maxIntensity}, dayIndex) in tabContent"
          :key="weekDay"
          :value="dayIndex"
          :data-test-id="`week-${weekIndex}-calendar-tab-${dayIndex}`"
        >
          {{ weekDay }}
          <v-chip
            v-if="trainings.length"
            :color="getIntensityColor(maxIntensity)"
            :title="getDayChipTitle(maxIntensity, trainings.length)"
            :aria-label="getDayChipTitle(maxIntensity, trainings.length)"
            variant="flat"
            label
            class="ml-4"
            >{{ trainings.length }}</v-chip
          >
        </v-tab>
      </v-tabs>
      <v-window v-model="activeDay">
        <v-window-item
          v-for="({trainings}, dayIndex) in tabContent"
          :key="dayIndex"
          :value="dayIndex"
          :data-test-id="`week-${weekIndex}-day-${dayIndex}`"
        >
          <draggable-list
            :model-value="trainings"
            :componentData="{multiple: true, variant: 'accordion'}"
            :class="{'flex-column': isSmallScreen}"
            tag="ul"
            item-key="id"
            handle=".v-card-item"
            class="d-flex flex-wrap"
            @update:model-value="
              (reorderedTrainings: Training[]) => reorderTrainings(week, reorderedTrainings)
            "
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
        :weekId="week.id"
        :weekIndex="weekIndex"
        :dayIndex="activeDay || 0"
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

.v-chip {
  cursor: pointer;
}

:deep(.v-expansion-panel-title__overlay) {
  pointer-events: none;
}
</style>
