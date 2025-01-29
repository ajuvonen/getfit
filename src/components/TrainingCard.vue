<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import type {Training} from '@/types';
import {getIcon, getIntensityColor, isDurationTime} from '@/utils';
import {useScheduleStore} from '@/stores/schedule';
import {COLORS} from '@/constants';
import useScreen from '@/hooks/screen';
import TrainingCardActions from '@/components/TrainingCardActions.vue';
import TrainingCardRating from '@/components/TrainingCardRating.vue';
import TrainingCardInstructions from '@/components/TrainingCardInstructions.vue';
import {useAppStateStore} from '@/stores/appState';

const props = withDefaults(
  defineProps<{
    training: Training;
    simple?: boolean;
    tag?: keyof HTMLElementTagNameMap;
  }>(),
  {
    simple: false,
    tag: 'div',
  },
);

const {settings} = storeToRefs(useScheduleStore());

const appStateStore = useAppStateStore();
const {visibleInstructions} = storeToRefs(appStateStore);

const isDescriptionOpen = computed(() => visibleInstructions.value.includes(props.training.id));

const {isSmallScreen} = useScreen();

const containerClasses = computed(() => ({
  'training-card__container': true,
  'training-card__container--small': isSmallScreen.value,
  'training-card__container--plain': !settings.value.decoratedCards,
}));
</script>
<template>
  <component
    :is="tag"
    :class="containerClasses"
    :style="settings.decoratedCards ? `background: url('/getfit/${training.activity}.jpg')` : ''"
  >
    <v-card
      class="training-card"
      :min-width="isSmallScreen ? 280 : 350"
      :color="getIntensityColor(training.intensity, settings.decoratedCards ? 0.8 : 1)"
      :style="{
        color: training.completed ? COLORS.lightGrey : COLORS.darkGrey,
      }"
    >
      <v-card-title class="ml-10 training-card__title">
        <v-icon v-if="!simple" icon="$dragVerticalVariant" size="normal" />
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
          <v-icon
            :icon="isDurationTime(training.unitOfDuration) ? '$timer' : '$goKartTrack'"
            :aria-label="$t('trainingCard.duration')"
          />
          {{ training.duration || '-' }}
          {{ training.unitOfDuration }}
        </div>
        <div class="training-card__intensity text-subtitle-2">
          <v-icon icon="$speedometer" :aria-label="$t('trainingCard.intensity')" />
          <span>{{ $t(`intensities.${training.intensity}`) }}</span>
        </div>
        <div class="training-card__location text-subtitle-2">
          <v-icon icon="$mapMarker" :aria-label="$t('trainingCard.location')" />
          <span class="text-truncate"> {{ training.location || '-' }}</span>
        </div>
        <TrainingCardRating :training="training" :disabled="isDescriptionOpen" />
      </v-card-text>
      <TrainingCardActions :training="training" :disabled="isDescriptionOpen" :simple="simple" />
      <TrainingCardInstructions :training="training" :show="isDescriptionOpen" />
    </v-card>
  </component>
</template>
<style scoped>
.training-card__container {
  background-size: cover !important;
  border-radius: 4px;
  max-width: 350px;
  &.training-card__container--small {
    flex: 1;
  }
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
