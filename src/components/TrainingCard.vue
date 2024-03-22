<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import type {Training} from '@/types';
import {getIcon, getIntensityColor} from '@/utils';
import {useScheduleStore} from '@/stores/schedule';
import {COLORS} from '@/constants';
import useScreen from '@/hooks/screen';
import TrainingCardActions from '@/components/TrainingCardActions.vue';
import TrainingCardRating from '@/components/TrainingCardRating.vue';
import TrainingCardInstructions from '@/components/TrainingCardInstructions.vue';
import {useAppStateStore} from '@/stores/appState';

const props = withDefaults(defineProps<{
  training: Training;
  simple?: boolean;
}>(), {
  simple: false,
});

const {settings} = storeToRefs(useScheduleStore());

const appStateStore = useAppStateStore();
const {visibleInstructions} = storeToRefs(appStateStore);

const isDescriptionOpen = computed(() => visibleInstructions.value.includes(props.training.id));

const {isSmallScreen} = useScreen();
</script>
<template>
  <div
    class="training-card__container"
    :class="{'training-card__container--plain': !settings.decoratedCards}"
    :style="settings.decoratedCards ? `background: url('/getfit/${training.activity}.jpg')` : ''"
  >
    <v-card
      class="training-card"
      :width="isSmallScreen ? '280px' : '350px'"
      :color="getIntensityColor(training.intensity, settings.decoratedCards ? 0.8 : 1)"
      :style="{
        color: training.completed ? COLORS.lightGrey :COLORS.darkGrey,
      }"
    >
      <v-card-title class="ml-10 training-card__title">
        <v-icon v-if="!simple" icon="mdi-drag-vertical-variant" size="normal" />
        <span class="text-truncate">{{
          training.title || $t(`activities.${training.activity}`)
        }}</span>
      </v-card-title>
      <v-card-text class="ml-10">
        <div
          class="training-card__icons d-flex align-center px-2"
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
        <div class="training-card__duration text-subtitle-2">
          <v-icon icon="mdi-timer" :aria-label="$t('trainingCard.duration')" />
          <span>{{ training.duration || '-' }} {{ settings.unitOfTime }}</span>
        </div>
        <div class="training-card__intensity text-subtitle-2">
          <v-icon icon="mdi-speedometer" :aria-label="$t('trainingCard.intensity')" />
          <span>{{ $t(`intensities.${training.intensity}`) }}</span>
        </div>
        <div class="training-card__location text-subtitle-2">
          <v-icon icon="mdi-map-marker" :aria-label="$t('trainingCard.location')" />
          <span class="text-truncate"> {{ training.location || '-' }}</span>
        </div>
        <TrainingCardRating :training="training" :disabled="isDescriptionOpen" />
      </v-card-text>
      <TrainingCardActions :training="training" :disabled="isDescriptionOpen" :simple="simple" />
      <TrainingCardInstructions :training="training" :show="isDescriptionOpen" />
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.training-card__container {
  background-size: cover !important;
  border-radius: 4px;
  width: fit-content;
  height: fit-content;
}

.training-card {
  backdrop-filter: grayscale(1);
}

.training-card__title {
  cursor: move;
}

.training-card__icons {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
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

.training-card__title,
.training-card__duration,
.training-card__location,
.training-card__intensity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
