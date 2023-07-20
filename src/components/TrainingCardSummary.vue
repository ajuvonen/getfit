<script setup lang="ts">
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import type {Training} from '@/types';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import useVuelidate from '@vuelidate/core';
import {maxLength} from '@vuelidate/validators';
import {getValidationErrors} from '@/utils';

const props = defineProps<{
  training: Training;
}>();

const completionSummary = ref(props.training.completionSummary);
const scheduleStore = useScheduleStore();
const {saveCompletionSummary} = scheduleStore;
const appStateStore = useAppStateStore();
const {isSummaryShown} = storeToRefs(appStateStore);
const {t} = useI18n();
const v$ = useVuelidate(
  {
    completionSummary: {maxLength: maxLength(2000)},
  },
  {completionSummary},
);

const handleSave = async () => {
  if (await v$.value.$validate()) {
    saveCompletionSummary(props.training, completionSummary.value);
  }
};
</script>
<template>
  <div class="training-card-summary__description text-body-1">
    {{ training.description }}
  </div>
  <v-expand-transition>
    <v-textarea
      v-if="isSummaryShown(training.id)"
      v-model="completionSummary"
      :error-messages="getValidationErrors(v$.completionSummary)"
      :label="t('trainingCard.completionSummary')"
      maxlength="2000"
      no-resize
      counter
      class="mt-2"
      @input="v$.completionSummary.$touch"
      @blur="v$.completionSummary.$touch(), handleSave()"
    />
  </v-expand-transition>
</template>
<style lang="scss" scoped>
.training-card-summary__description {
  white-space: pre-line;
  text-overflow: ellipsis;
}
</style>
