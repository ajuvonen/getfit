<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';
import {Intensity, type Training} from '@/types';
import {getIcon, getIntensityColor} from '@/utils';
import {ACTIVITIES} from '@/constants';
import {useI18n} from 'vue-i18n';
import TrainingCardSummary from '@/components/TrainingCardSummary.vue';
import TrainingCardActions from '@/components/TrainingCardActions.vue';
import {useAppStateStore} from '@/stores/appState';

defineProps<{
  training: Training;
}>();

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const appStateStore = useAppStateStore();
const {isSummaryShown} = storeToRefs(appStateStore);
const {toggleSummaryShown} = appStateStore;
const {t} = useI18n();
</script>
<template>
  <v-card class="training-card mx-2 mt-4 mb-2" min-width="400" max-width="400">
    <v-card-item
      class="training-card__title-wrapper text-white"
      :style="{'background-color': getIntensityColor(training.intensity)}"
    >
      <v-icon
        :icon="getIcon(ACTIVITIES, training.activity)"
        :title="t(`activities.${training.activity}`)"
        :aria-label="t(`activities.${training.activity}`)"
        :color="getIntensityColor(training.intensity)"
        class="training-card__activity-icon"
        size="x-large"
      />
      <v-card-title class="d-flex ml-15 flex-column justify-top">
        <div class="training-card__title">
          {{ training.title || t(`activities.${training.activity}`) }}
        </div>
        <div v-if="training.duration" class="training-card__duration text-subtitle-2">
          <v-icon icon="mdi-timer" :aria-label="t('trainingCard.duration')" />
          {{ training.duration }} {{ schedule.unitOfTime }}
        </div>
        <div v-if="training.location" class="training-card__location text-subtitle-2">
          <v-icon icon="mdi-map-marker" :aria-label="t('trainingCard.location')" />
          {{ training.location }}
        </div>
        <div class="training-card__intensity text-subtitle-2">
          <v-icon icon="mdi-speedometer" :aria-label="t('trainingCard.intensity')" />
          {{ t(`intensities.${Intensity[training.intensity]}`) }}
        </div>
      </v-card-title>
    </v-card-item>
    <v-card-text class="training-card__text">
      <training-card-summary :training="training" />
    </v-card-text>
    <v-card-actions class="justify-center">
      <training-card-actions v-if="!schedule.lockSchedule" :training="training" />
      <v-btn
        v-else
        class="training-card__show-summary-button"
        @click="toggleSummaryShown(training.id)"
        >{{
          t(isSummaryShown(training.id) ? 'trainingCard.hideSummary' : 'trainingCard.showSummary')
        }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" scoped>
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

.training-card__subtitle {
  opacity: 1;
}

.training-card__text {
  margin-top: 7.5rem;
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
