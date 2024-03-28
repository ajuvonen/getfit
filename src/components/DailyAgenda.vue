<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {useScheduleStore} from '@/stores/schedule';
import TrainingCard from '@/components/TrainingCard.vue';

const scheduleStore = useScheduleStore();
const {weeks, settings, getTotalTrainings, getCompletedTrainings} = storeToRefs(scheduleStore);

const dailyTrainings = computed(() => {
  const startDate = DateTime.fromJSDate(settings.value.startDate!);
  const difference = Math.ceil(startDate.diffNow('weeks').weeks);
  if (difference < 1) {
    const targetWeek = weeks.value[Math.abs(difference)];
    if (targetWeek) {
      const targetDay = (DateTime.now().weekday - (settings.value.startsOnSunday ? 0 : 1)) % 7;
      return targetWeek.trainings.filter(({dayIndex}) => dayIndex === targetDay);
    }
  }
  return [];
});
</script>
<template>
  <v-progress-circular
    :model-value="(getCompletedTrainings / getTotalTrainings) * 100"
    class="mx-auto"
    size="150"
    width="15"
  >
    <v-fab-transition>
      <span v-if="getTotalTrainings > getCompletedTrainings" class="text-h4">
        {{ getCompletedTrainings }} / {{ getTotalTrainings }}
      </span>
      <v-icon v-else icon="mdi-trophy-outline" size="70" />
    </v-fab-transition>
  </v-progress-circular>
  <h1 class="mt-10 text-h3 text-center">
    {{ $t('home.dailyAgenda') }}
  </h1>
  <div class="daily-agenda has-scroll mt-10 d-flex">
    <TrainingCard
      v-for="training in dailyTrainings"
      :key="training.id"
      :training="training"
      simple
    />
    <p v-if="!dailyTrainings.length" class="mx-auto text-h6">{{ $t('home.noTrainings') }}</p>
  </div>
</template>
<style lang="scss" scoped>
.daily-agenda {
  gap: 1rem;
  overflow-x: scroll;
}

.training-card__container:first-child {
  margin-left: auto;
}

.training-card__container:last-child {
  margin-right: auto;
}
</style>
