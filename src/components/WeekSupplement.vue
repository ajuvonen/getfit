<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import type {Training} from '@/types';
import useWeekDays from '@/hooks/weekdays';
import {getIcon} from '@/utils';
import {ACTIVITIES} from '@/constants';

defineProps<{
  trainings: Training[];
  dayIndex: number;
}>();

const {t} = useI18n();
const {weekdays} = useWeekDays();
</script>
<template>
  <div v-if="trainings.length">
    <div class="mt-4 text-subtitle-1">
      {{ weekdays[dayIndex] }}
    </div>
    <ul>
      <li v-for="training in trainings" :key="training.id" class="mt-1 week-supplement__instruction text-body-1">
        <span>
          <v-icon
            :icon="getIcon(ACTIVITIES, training.activity)"
            :title="t(`activities.${training.activity}`)"
            :aria-label="t(`activities.${training.activity}`)"
          />
          {{ training.title || t(`activities.${training.activity}`) }}:&nbsp;</span
        >
        <span v-if="training.description">{{ training.description }}</span>
        <i v-else>{{ t('weekSupplement.noInstruction') }}</i>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
li {
  list-style-type: none;
}

.v-icon {
  vertical-align: bottom;
}

.week-supplement__instruction {
  padding-left: 1.8em;
  text-indent: -1.8em;
}
</style>
