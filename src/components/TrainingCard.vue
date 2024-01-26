<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type {Training} from '@/types';
import {getIcon, getIntensityColor} from '@/utils';
import {useScheduleStore} from '@/stores/schedule';
import TrainingCardActions from '@/components/TrainingCardActions.vue';

defineProps<{
  training: Training;
}>();

const {settings} = storeToRefs(useScheduleStore());
</script>
<template>
  <v-card class="training-card mx-2 mt-4 mb-2">
    <v-card-item
      class="training-card__title-wrapper text-white"
      :style="{'background-color': getIntensityColor(training.intensity)}"
    >
      <v-icon
        :icon="getIcon(training.activity)"
        :title="$t(`activities.${training.activity}`)"
        :aria-label="$t(`activities.${training.activity}`)"
        :color="getIntensityColor(training.intensity)"
        class="training-card__activity-icon"
        size="x-large"
      />
      <v-card-title class="d-flex ml-15 flex-column justify-top">
        <div class="training-card__title">
          {{ training.title || $t(`activities.${training.activity}`) }}
        </div>
        <div v-if="training.duration" class="training-card__duration text-subtitle-2">
          <v-icon icon="mdi-timer" :aria-label="$t('trainingCard.duration')" />
          {{ training.duration }} {{ settings.unitOfTime }}
        </div>
        <div v-if="training.location" class="training-card__location text-subtitle-2">
          <v-icon icon="mdi-map-marker" :aria-label="$t('trainingCard.location')" />
          {{ training.location }}
        </div>
        <div class="training-card__intensity text-subtitle-2">
          <v-icon icon="mdi-speedometer" :aria-label="$t('trainingCard.intensity')" />
          {{ $t(`intensities.${training.intensity}`) }}
        </div>
      </v-card-title>
    </v-card-item>
    <v-card-text class="training-card__text" :class="training.description ? 'pt-2 px-4' : ''">
      {{ training.description }}
    </v-card-text>
    <training-card-actions :training="training" />
  </v-card>
</template>
<style lang="scss" scoped>
.training-card {
  max-width: 500px;
  min-width: 250px;
}

.v-card-item {
  cursor: move;
}

.training-card__title-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 7rem;
}

.training-card__title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.training-card__text {
  margin-top: 7rem;
  padding: 0;
  white-space: pre-wrap;
}

.training-card__activity-icon {
  background: white;
  border-radius: 50%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding: 0rem 2rem 0 3.5rem;
  margin-left: -1.5rem;
}
</style>
