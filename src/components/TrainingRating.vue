<script setup lang="ts">
import {useScheduleStore} from '@/stores/schedule';
import type {Rating, Training} from '@/types';

defineProps<{
  training: Training;
  disabled: boolean;
}>();

const {updateRating} = useScheduleStore();
</script>
<template>
  <v-radio-group
    :model-value="training.rating"
    :aria-label="$t('trainingCard.ratingLabel')"
    :class="{'training-card__rating--hidden': !training.completed}"
    class="training-card__rating"
    inline
    hide-details
  >
    <v-radio
      v-for="rating in [1, 2, 3, 4, 5]"
      :disabled="disabled || !training.completed"
      :key="rating"
      :value="rating"
      :aria-label="$t('trainingCard.rating', [rating])"
      elevation="0"
      trueIcon="mdi-star"
      :falseIcon="training.rating && training.rating >= rating ? 'mdi-star' : 'mdi-star-outline'"
      @click="updateRating(training, rating as Rating)"
    ></v-radio>
  </v-radio-group>
</template>
<style lang="scss" scoped>
:deep(.v-selection-control-group) {
  display: flex;
  justify-content: center;
}

.training-card__rating--hidden {
  visibility: hidden;
}
</style>
