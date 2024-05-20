<script setup lang="ts">
import type {Training} from '@/types';
import {getIcon, isDurationTime} from '@/utils';

defineProps<{
  training: Training;
}>();
</script>
<template>
  <div class="simple-training-card my-4 text-body-1">
    <div class="simple-training-card__title">
      <v-icon
        :icon="getIcon(training.activity)"
        :title="$t(`activities.${training.activity}`)"
        :aria-label="$t(`activities.${training.activity}`)"
        class="simple-training-card__activity-icon"
      />
      {{ training.title || $t(`activities.${training.activity}`) }}
    </div>
    <div class="simple-training-card__duration">
      <v-icon
        :icon="isDurationTime(training.unitOfDuration) ? '$timer' : '$goKartTrack'"
        :aria-label="$t('trainingCard.duration')"
      />
      {{ training.duration || '-' }} {{ training.unitOfDuration }}
    </div>
    <div class="simple-training-card__location">
      <v-icon icon="$mapMarker" :aria-label="$t('trainingCard.location')" />
      {{ training.location || '-' }}
    </div>
    <div class="simple-training-card__intensity">
      <v-icon icon="$speedometer" :aria-label="$t('trainingCard.intensity')" />
      {{ $t(`intensities.${training.intensity}`) }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.simple-training-card {
  max-width: 200px;
  > div {
    display: flex;
    gap: 0.5rem;
  }
}

.v-icon {
  vertical-align: bottom;
}
</style>
