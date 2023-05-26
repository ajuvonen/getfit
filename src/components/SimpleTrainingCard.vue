<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';
import {Intensity, type Training} from '@/types';
import {getIcon} from '@/utils';
import {ACTIVITIES} from '@/constants';
import {useI18n} from 'vue-i18n';

defineProps<{
  training: Training;
}>();

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {t} = useI18n();
</script>
<template>
  <div class="simple-training-card">
    <div class="simple-training-card__title">
      <v-icon
        :icon="getIcon(ACTIVITIES, training.activity)"
        :title="t(`activities.${training.activity}`)"
        :aria-label="t(`activities.${training.activity}`)"
        class="simple-training-card__activity-icon"
      />
      {{ training.title || t(`activities.${training.activity}`) }}
    </div>
    <div v-if="training.duration" class="simple-training-card__duration">
      <v-icon icon="mdi-timer" :aria-label="t('trainingCard.duration')" />
      {{ training.duration }} {{ schedule.unitOfTime }}
    </div>
    <div v-if="training.location" class="simple-training-card__location">
      <v-icon icon="mdi-map-marker" :aria-label="t('trainingCard.location')" />
      {{ training.location }}
    </div>
    <div class="simple-training-card__intensity">
      <v-icon icon="mdi-speedometer" :aria-label="t('trainingCard.intensity')" />
      {{ t(`intensities.${Intensity[training.intensity]}`) }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.simple-training-card {
  margin-top: 0.5rem;
  position: relative;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
</style>
