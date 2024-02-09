<script setup lang="ts">
import {computed} from 'vue';
import {useScheduleStore} from '@/stores/schedule';
import type {Rating, Training} from '@/types';

const props = defineProps<{
  training: Training;
}>();

const {updateRating} = useScheduleStore();

const baseAttributes = computed(() => (rating: Rating) => ({
  elevation: 0,
  size: 'small',
  color: 'transparent',
  icon:
    rating && props.training.rating && props.training.rating >= rating
      ? 'mdi-star'
      : 'mdi-star-outline',
}));
</script>
<template>
  <div class="d-flex justify-space-evenly">
    <v-btn
      v-bind="baseAttributes(1)"
      @click="updateRating(training, 1)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes(2)"
      @click="updateRating(training, 2)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes(3)"
      @click="updateRating(training, 3)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes(4)"
      @click="updateRating(training, 4)"
    ></v-btn>
    <v-btn
      v-bind="baseAttributes(5)"
      @click="updateRating(training, 5)"
    ></v-btn>
  </div>
</template>
