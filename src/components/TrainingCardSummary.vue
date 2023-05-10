<script setup lang="ts">
import {ref} from 'vue';
import type {Training} from '@/types';
import {useScheduleStore} from '@/stores/schedule';
import useVuelidate from '@vuelidate/core';
import {maxLength} from '@vuelidate/validators';
import {useI18n} from 'vue-i18n';
import {getValidationErrors} from '@/utils';

const props = defineProps<{
  training: Training;
}>();

const completionSummary = ref(props.training.completionSummary);
const scheduleStore = useScheduleStore();
const {saveCompletionSummary} = scheduleStore;
const {t} = useI18n();
const v$ = useVuelidate(
  {
    completionSummary: {maxLength: maxLength(2000)},
  },
  {completionSummary}
);

const handleSave = async () => {
  if (await v$.value.$validate()) {
    saveCompletionSummary(props.training, completionSummary.value);
  }
};
</script>
<template>
  <v-textarea
    :model-value="training.description"
    :label="t('editTraining.description')"
    disabled
    no-resize
  />
  <v-textarea
    v-model="completionSummary"
    :error-messages="getValidationErrors(v$.completionSummary)"
    :label="t('trainingCard.completionSummary')"
    maxlength="2000"
    no-resize
    counter
    @input="v$.completionSummary.$touch"
    @blur="v$.completionSummary.$touch(), handleSave()"
  />
</template>
