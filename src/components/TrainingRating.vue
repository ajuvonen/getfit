<script setup lang="ts">
import type {Training} from '@/types';
import {computed} from 'vue';

const props = defineProps<{
  training: Training;
}>();

const updateRating = (rating: 1 | 2 | 3 | 4 | 5) => {
  if (props.training.rating === rating) {
    props.training.rating = null;
  } else {
    props.training.rating = rating;
  }
};

const baseAttributes = computed(() => ({
  elevation: 0,
  size: 'small',
  color: 'transparent',
}));
</script>
<template>
  <div class="d-flex justify-center">
    <v-btn
      v-bind="baseAttributes"
      :icon="training.rating && training.rating >= 1 ? 'mdi-star' : 'mdi-star-outline'"
      @click="updateRating(1)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes"
      :icon="training.rating && training.rating >= 2 ? 'mdi-star' : 'mdi-star-outline'"
      @click="updateRating(2)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes"
      color="transparent"
      :icon="training.rating && training.rating >= 3 ? 'mdi-star' : 'mdi-star-outline'"
      @click="updateRating(3)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes"
      color="transparent"
      :icon="training.rating && training.rating >= 4 ? 'mdi-star' : 'mdi-star-outline'"
      @click="updateRating(4)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes"
      color="transparent"
      :icon="training.rating && training.rating === 5 ? 'mdi-star' : 'mdi-star-outline'"
      @click="updateRating(5)"
    ></v-btn>
  </div>
</template>
