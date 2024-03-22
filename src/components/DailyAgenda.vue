<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {useScheduleStore} from '@/stores/schedule';
import TrainingCard from '@/components/TrainingCard.vue';

const scheduleStore = useScheduleStore();
const {weeks, settings} = storeToRefs(scheduleStore);

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
  <div class="daily-agenda has-scroll mt-10 d-flex">
    <TrainingCard
      v-for="training in dailyTrainings"
      :key="training.id"
      :training="training"
      simple
    />
    <p v-if="!dailyTrainings.length" class="mx-auto">{{ $t('home.noTrainings') }}</p>
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
