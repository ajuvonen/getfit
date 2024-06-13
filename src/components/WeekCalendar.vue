<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {groupBy, prop} from 'remeda';
import {UseSortable} from '@vueuse/integrations/useSortable/component';
import {useI18n} from 'vue-i18n';
import {useScheduleStore} from '@/stores/schedule';
import {type Week, Intensity} from '@/types';
import {getIntensityColor} from '@/utils';
import useScreen from '@/hooks/screen';
import useWeekDays from '@/hooks/weekdays';
import {COLORS} from '@/constants';
import TrainingCard from '@/components/TrainingCard.vue';
import WeekCalendarActions from '@/components/WeekCalendarActions.vue';

const props = defineProps<{
  week: Week;
  weekIndex: number;
}>();

const scheduleStore = useScheduleStore();
const {settings} = storeToRefs(scheduleStore);
const {reorderTrainings} = scheduleStore;

const {t} = useI18n();

const {isSmallScreen, isLargeScreen} = useScreen();

const {weekdays, shortWeekdays, getDateInterval, getDisplayWeekNumber} = useWeekDays();

const activeDay = ref(0);

const sortableOptions = {
  handle: '.training-card__title',
  onUpdate: (e: {oldIndex: number; newIndex: number}) =>
    reorderTrainings(props.week.id, e.oldIndex, e.newIndex),
  delay: 250,
  delayOnTouchOnly: true,
};

const tabContent = computed(() => {
  const days = isSmallScreen.value ? shortWeekdays : weekdays;
  return days.value.map((weekDay, weekdayIndex) => {
    const trainings = props.week.trainings.filter(({dayIndex}) => dayIndex === weekdayIndex);
    const maxIntensity = Math.max(...trainings.map(prop('intensity')));

    return {
      weekDay,
      trainings,
      maxIntensity,
    };
  });
});

const groupedTrainings = computed(() => groupBy(props.week.trainings, ({intensity}) => intensity));

const getWeekChipTitle = (intensity: Intensity, count: number) =>
  t('weekCalendar.weekChipTitle', [t(`intensities.${intensity}`), count]);

const getDayChipTitle = (intensity: Intensity, count: number) =>
  t('weekCalendar.dayChipTitle', [count, t(`intensities.${intensity}`)]);
</script>
<template>
  <v-expansion-panel
    tag="li"
    elevation="0"
    :rounded="!isLargeScreen ? 0 : 'rounded'"
    :value="week.id"
  >
    <v-expansion-panel-title class="flex-wrap">
      <div class="week-calendar__drag-handle">
        <v-icon icon="$dragVerticalVariant" />
        <h2 class="text-h5">
          {{ $t('weekCalendar.weekTitle', [getDisplayWeekNumber(weekIndex)]) }}
        </h2>
      </div>
      <div v-if="settings.startDate">
        {{ getDateInterval(weekIndex) }}
      </div>
      <div>
        <v-chip
          v-for="[intensity, group] in Object.entries(groupedTrainings)"
          :key="intensity"
          :color="getIntensityColor(+intensity)"
          :title="getWeekChipTitle(+intensity, group.length)"
          :aria-label="getWeekChipTitle(+intensity, group.length)"
          :style="{color: COLORS.darkGrey}"
          variant="flat"
          label
          class="ml-2"
          >{{ group.length }}</v-chip
        >
      </div>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-tabs v-model="activeDay" grow center-active>
        <v-tab
          v-for="({weekDay, trainings, maxIntensity}, dayIndex) in tabContent"
          :key="dayIndex"
          :value="dayIndex"
          :data-test-id="`week-${weekIndex}-calendar-tab-${dayIndex}`"
        >
          {{ weekDay }}
          <v-chip
            v-if="trainings.length"
            :color="getIntensityColor(maxIntensity)"
            :title="getDayChipTitle(maxIntensity, trainings.length)"
            :aria-label="getDayChipTitle(maxIntensity, trainings.length)"
            :style="{color: COLORS.darkGrey}"
            variant="flat"
            label
            class="ml-4"
            >{{ trainings.length }}</v-chip
          >
        </v-tab>
      </v-tabs>
      <v-window :model-value="activeDay" :disabled="true">
        <v-window-item
          v-for="({trainings}, dayIndex) in tabContent"
          :key="dayIndex"
          :value="dayIndex"
          :data-test-id="`week-${weekIndex}-day-${dayIndex}`"
        >
          <UseSortable
            :model-value="trainings"
            :options="sortableOptions"
            tag="ul"
            class="d-flex flex-wrap mt-4 mb-1 justify-center"
          >
            <training-card
              v-for="training in trainings"
              :key="training.id"
              :training="training"
              tag="li"
            />
          </UseSortable>
        </v-window-item>
      </v-window>
      <WeekCalendarActions
        :weekId="week.id"
        :weekIndex="weekIndex"
        :dayIndex="activeDay"
      ></WeekCalendarActions>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<style lang="scss" scoped>
ul {
  gap: 1rem;
}

.v-expansion-panel-title {
  gap: 1rem;
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
