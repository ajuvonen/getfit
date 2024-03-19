<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import type {Training} from '@/types';
import useWeekDays from '@/hooks/weekdays';
import {getIcon} from '@/utils';

defineProps<{
  trainings: Training[];
  dayIndex: number;
}>();

const {t} = useI18n();
const {weekdays} = useWeekDays();
</script>
<template>
  <div v-if="trainings.length">
    <div class="mt-4 text-subtitle-2 text-uppercase">
      {{ weekdays[dayIndex] }}
    </div>
    <ul>
      <li
        v-for="training in trainings"
        :key="training.id"
        class="mt-1 week-supplement__instructions text-body-1"
      >
        <span>
          <v-icon
            :icon="getIcon(training.activity)"
            :title="t(`activities.${training.activity}`)"
            :aria-label="t(`activities.${training.activity}`)"
          />
          {{ training.title || t(`activities.${training.activity}`) }}:&nbsp;</span
        >
        <span v-if="training.instructions">{{ training.instructions }}</span>
        <i v-else>{{ t('weekSupplement.noInstruction') }}</i>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
ul {
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
