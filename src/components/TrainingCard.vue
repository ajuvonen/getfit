<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type {Training} from '@/types';
import {getIcon, getIntensityColor} from '@/utils';
import {useScheduleStore} from '@/stores/schedule';
import useScreen from '@/hooks/screen';
import {COLORS} from '@/constants';
import TrainingCardActions from '@/components/TrainingCardActions.vue';
import TrainingRating from '@/components/TrainingRating.vue';

defineProps<{
  training: Training;
}>();

const {isDark} = useScreen();

const {settings} = storeToRefs(useScheduleStore());
</script>
<template>
  <v-card class="training-card mx-2 mt-4 mb-2" :color="isDark ? COLORS.lightGrey : undefined">
    <v-card-item class="training-card__title-wrapper">
      <v-icon
        :icon="getIcon(training.activity)"
        :title="$t(`activities.${training.activity}`)"
        :aria-label="$t(`activities.${training.activity}`)"
        :color="isDark ? COLORS.darkGrey : COLORS.offWhite"
        :style="{background: getIntensityColor(training.intensity)}"
        class="training-card__activity-icon"
        size="x-large"
      />
      <v-card-title class="d-flex ml-11 flex-column">
        <div class="training-card__title">
          {{ training.title || $t(`activities.${training.activity}`) }}
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex flex-column">
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
          </div>
          <div class="d-flex align-center">
            <transition name="fall">
              <v-icon
                v-if="training.completed"
                size="x-large"
                icon="mdi-check"
                class="training-card__completion-mark"
              />
            </transition>
          </div>
        </div>
      </v-card-title>
    </v-card-item>
    <v-card-text
      class="training-card__text"
      :class="training.description || training.completed ? 'pt-2 px-4' : ''"
    >
      <span v-if="!training.completed">{{ training.description }}</span>
      <training-rating v-if="training.completed" :training="training" />
    </v-card-text>
    <training-card-actions :training="training" />
  </v-card>
</template>
<style lang="scss" scoped>
.training-card {
  width: 250px;
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
  border-radius: 4px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding: 0rem 1.5rem 0 3.2rem;
  margin-left: -1.5rem;
  box-shadow: inset -5px -5px 10px 0px rgba(33, 33, 33, 0.3);
}

.training-card__duration,
.training-card__location,
.training-card__intensity {
  display: flex;
  gap: 0.5rem;
}

.fall-enter-from {
  opacity: 0;
  transform: scale(0) rotate(-20deg);
}

.fall-enter-active {
  transition:
    opacity 0.1s,
    transform 0.5s ease-in;
}

.fall-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0);
}
</style>
