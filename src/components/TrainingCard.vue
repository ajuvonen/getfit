<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';
import {Intensity, type Training} from '@/types';
import {getIcon, getIntensityColor} from '@/utils';
import {ACTIVITIES} from '@/constants';
import {useI18n} from 'vue-i18n';
import TrainingCardSummary from './TrainingCardSummary.vue';
import TrainingCardActions from './TrainingCardActions.vue';
import useScreenSize from '@/hooks/screenSize';

defineProps<{
  training: Training;
}>();

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {t} = useI18n();
const {isSmallScreen} = useScreenSize();

</script>
<template>
  <v-card
    :style="{'border-left': `4px solid ${getIntensityColor(training.intensity)}`}"
    class="training-card"
    elevation="0"
  >
    <v-card-item>
      <v-card-title class="d-flex">
        <v-icon
          :icon="getIcon(ACTIVITIES, training.activity)"
          :title="t(`activities.${training.activity}`)"
          :aria-label="t(`activities.${training.activity}`)"
        />
        <span class="ml-3">{{ training.title || t(`activities.${training.activity}`) }}</span>
        <span v-if="training.duration" class="ml-3"
          >{{ training.duration }} {{ schedule.unitOfTime }}</span
        >
      </v-card-title>
      <v-card-subtitle>{{
        t('trainingCard.intensity', [t(`intensities.${Intensity[training.intensity]}`)])
      }}</v-card-subtitle>
    </v-card-item>
    <v-card-text v-if="schedule.lockSchedule" class="d-flex flex-wrap pb-0">
      <training-card-summary :training="training" />
    </v-card-text>
    <v-card-actions v-else :class="{'flex-column': isSmallScreen}">
      <training-card-actions :training="training" />
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" scoped>
.training-card {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.v-card-item {
  cursor: move;
}
</style>
