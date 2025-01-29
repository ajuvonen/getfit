<script setup lang="ts">
import {computed} from 'vue';
import {useScheduleStore} from '@/stores/schedule';
import type {Rating, Training} from '@/types';

defineProps<{
  training: Training;
  disabled: boolean;
}>();

const {updateRating} = useScheduleStore();

const ratingClasses = computed(() => (training: Training, rating: number) => ({
  'training-card-rating__star': true,
  [`training-card-rating__star--${rating}`]: true,
  'training-card-rating__star--filled': training.rating && training.rating >= rating,
}));
</script>
<template>
  <v-radio-group
    :model-value="training.rating"
    :aria-label="$t('trainingCard.ratingLabel')"
    :class="{'training-card-rating--hidden': !training.completed}"
    :disabled="disabled || !training.completed"
    class="training-card-rating"
    inline
    hide-details
  >
    <v-radio
      v-for="rating in [1, 2, 3, 4, 5]"
      :key="rating"
      :value="rating"
      :aria-label="$t('trainingCard.rating', [rating])"
      :class="ratingClasses(training, rating)"
      :falseIcon="training.rating && training.rating >= rating ? '$star' : '$starOutline'"
      elevation="0"
      trueIcon="$star"
      @click="updateRating(training, rating as Rating)"
    ></v-radio>
  </v-radio-group>
</template>
<style scoped>
:deep(.v-selection-control-group) {
  display: flex;
  justify-content: center;
}

.training-card-rating--hidden {
  visibility: hidden;
}
</style>
