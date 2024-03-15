<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type {Training} from '@/types';
import {getIcon, getIntensityColor} from '@/utils';
import {useScheduleStore} from '@/stores/schedule';
import {COLORS} from '@/constants';
import TrainingCardActions from '@/components/TrainingCardActions.vue';
import TrainingRating from '@/components/TrainingRating.vue';

defineProps<{
  training: Training;
}>();

const {settings} = storeToRefs(useScheduleStore());
</script>
<template>
  <div
    class="training-card__container"
    :class="{'training-card__container--plain': !settings.decoratedCards}"
    :style="settings.decoratedCards ? `background: url('/getfit/${training.activity}.jpg')` : ''"
  >
    <v-card
      class="training-card"
      :color="getIntensityColor(training.intensity, settings.decoratedCards ? 0.8 : 1)"
      :style="{
        color: COLORS.darkGrey,
      }"
    >
      <v-card-item class="training-card__title-wrapper">
        <div
          class="training-card__icons d-flex align-center"
          :class="{'training-card__icons--completed': training.completed}"
        >
          <v-icon
            :icon="getIcon(training.activity)"
            :title="
              training.completed
                ? $t(`trainingCard.completed`, [$t(`activities.${training.activity}`)])
                : $t(`activities.${training.activity}`)
            "
            :aria-label="$t(`activities.${training.activity}`)"
            class="training-card__activity-icon"
            size="x-large"
          />
        </div>
        <v-card-title class="ml-11">
          <div class="training-card__title text-truncate">
            {{ training.title || $t(`activities.${training.activity}`) }}
          </div>
          <div class="training-card__duration text-subtitle-2">
            <v-icon icon="mdi-timer" :aria-label="$t('trainingCard.duration')" />
            {{ training.duration || '-' }} {{ settings.unitOfTime }}
          </div>
          <div class="training-card__intensity text-subtitle-2">
            <v-icon icon="mdi-speedometer" :aria-label="$t('trainingCard.intensity')" />
            {{ $t(`intensities.${training.intensity}`) }}
          </div>
          <div class="training-card__location text-subtitle-2">
            <v-icon icon="mdi-map-marker" :aria-label="$t('trainingCard.location')" />
            {{ training.location || '-' }}
          </div>
        </v-card-title>
      </v-card-item>
      <v-card-text
        class="training-card__text px-4"
        :class="training.description || training.completed ? 'pt-2' : ''"
      >
        <span v-if="!training.completed">{{ training.description }}</span>
        <training-rating v-if="training.completed" :training="training" />
      </v-card-text>
      <training-card-actions :training="training" />
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.training-card__container {
  background-size: cover !important;
  border-radius: 4px;
}

.training-card {
  min-width: 300px;
  max-width: 500px;
  backdrop-filter: grayscale(1);
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

.training-card__text {
  margin-top: 7rem;
  padding: 0;
  white-space: pre-wrap;
}

.training-card__icons {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding: 0 0.7rem;
}

.training-card__icons--completed {
  background: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 10px,
    transparent 10px,
    transparent 20px
  );
  border-bottom-right-radius: 4px;
}

.training-card__duration,
.training-card__location,
.training-card__intensity {
  display: flex;
  gap: 0.5rem;
}
</style>
