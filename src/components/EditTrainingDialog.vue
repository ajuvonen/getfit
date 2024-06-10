<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useAsyncValidator} from '@vueuse/integrations/useAsyncValidator';
import type {VForm} from 'vuetify/components';
import type {Rules} from 'async-validator';
import {Intensity} from '@/types';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {getIntensityColor, getIcon, getValidationErrors} from '@/utils';
import {DECIMAL_REGEX} from '@/constants';
import useLocalizedActivities from '@/hooks/localizedActivities';
import BaseDialog from '@/components/BaseDialog.vue';

const scheduleStore = useScheduleStore();
const {addOrEditTraining} = scheduleStore;

const {trainingDialogOpen, trainingData} = storeToRefs(useAppStateStore());

const {t} = useI18n();

const tickLabels = computed(() => ({
  [Intensity.LIGHT]: t('intensities.0'),
  [Intensity.NORMAL]: t('intensities.1'),
  [Intensity.DEMANDING]: t('intensities.2'),
  [Intensity.HEAVY]: t('intensities.3'),
}));

const unitsOfDuration = computed(() => [
  {value: 'h', title: t('general.unitsOfDuration.h')},
  {value: 'm', title: t('general.unitsOfDuration.m')},
  {value: 'km', title: t('general.unitsOfDuration.km')},
  {value: 'mi', title: t('general.unitsOfDuration.mi')},
]);

const {localizedAvailableActivities} = useLocalizedActivities();

const handleSave = async () => {
  if (pass.value) {
    addOrEditTraining(trainingData.value);
    trainingDialogOpen.value = false;
  }
};

const rules = computed(() => {
  const maxDuration = trainingData.value.unitOfDuration === 'h' ? 10 : 500;
  return {
    title: {max: 30},
    location: {max: 40},
    instructions: {max: 2000},
    duration: [
      {required: true, message: t('errors.required')},
      {
        type: 'number',
        min: 0,
        max: maxDuration,
        message: t('errors.outsideBounds', [0, maxDuration]),
      },
      {pattern: DECIMAL_REGEX, message: t('errors.invalidPrecision')},
    ],
    unitOfDuration: {required: true, message: t('errors.required')},
    activity: {required: true, message: t('errors.required')},
  } as Rules;
});

const {pass, errorFields} = useAsyncValidator(trainingData, rules, {
  validateOption: {
    suppressWarning: true,
  },
});
</script>
<template>
  <BaseDialog :show="trainingDialogOpen" :title="$t('editTraining.title')">
    <template #content>
      <v-form>
        <v-label for="edit-training-activity">{{ $t('editTraining.activity') }}</v-label>
        <v-select
          id="edit-training-activity"
          v-model="trainingData.activity"
          :error-messages="getValidationErrors(errorFields, 'activity')"
          :items="localizedAvailableActivities"
          eager
          data-test-id="edit-training-activity"
        >
          <template #selection="{item: {title, value}}">
            <div v-if="value">
              <v-icon :icon="getIcon(value)" />
              {{ title }}
            </div>
          </template>
          <template #item="{item: {title, value}, props}">
            <v-list-item v-bind="props" :data-test-id="`edit-training-activity-${value}`">
              <template #title>
                <v-icon :icon="getIcon(value)" />
                {{ title }}
              </template>
            </v-list-item>
          </template>
        </v-select>
        <v-text-field
          v-model="trainingData.title"
          :label="t('editTraining.trainingTitle')"
          :error-messages="getValidationErrors(errorFields, 'title')"
          maxlength="30"
          counter
          data-test-id="edit-training-title"
        />
        <v-text-field
          v-model="trainingData.location"
          :label="t('editTraining.location')"
          :error-messages="getValidationErrors(errorFields, 'location')"
          maxlength="40"
          counter
          data-test-id="edit-training-location"
        />
        <div class="d-flex edit-training__duration-container">
          <v-text-field
            v-model.number="trainingData.duration"
            :error-messages="getValidationErrors(errorFields, 'duration')"
            :label="t('editTraining.duration')"
            class="edit-training-duration"
            type="number"
            data-test-id="edit-training-duration"
          />
          <v-select
            id="edit-training-unit-of-duration"
            v-model="trainingData.unitOfDuration"
            :error-messages="getValidationErrors(errorFields, 'unitOfDuration')"
            :items="unitsOfDuration"
            eager
            data-test-id="edit-training-unit-of-duration"
          ></v-select>
        </div>
        <v-textarea
          v-model="trainingData.instructions"
          :label="t('editTraining.instructions')"
          :error-messages="getValidationErrors(errorFields, 'instructions')"
          clearable
          maxlength="2000"
          no-resize
          counter
          data-test-id="edit-training-instructions"
        />
        <v-label for="edit-training-intensity">{{ $t('editTraining.intensity') }}</v-label>
        <v-slider
          id="edit-training-intensity"
          v-model="trainingData.intensity"
          :ticks="tickLabels"
          :color="getIntensityColor(trainingData.intensity)"
          max="3"
          step="1"
          show-ticks="always"
          tick-size="4"
          data-test-id="edit-training-intensity"
        ></v-slider>
      </v-form>
    </template>
    <template #actions>
      <v-btn
        prepend-icon="$contentSave"
        variant="outlined"
        color="primary"
        data-test-id="edit-training-save-button"
        @click="handleSave()"
        >{{ $t('editTraining.save') }}</v-btn
      >
      <v-btn
        prepend-icon="$close"
        data-test-id="edit-training-close-button"
        variant="text"
        @click="trainingDialogOpen = false;"
        >{{ $t('editTraining.closeDialog') }}</v-btn
      >
    </template>
  </BaseDialog>
</template>
<style lang="scss" scoped>
:deep(.edit-training-duration .v-input__control) {
  max-width: 200px;
  input[type='number'] {
    appearance: textField;
  }
}

.edit-training__duration-container {
  gap: 1rem;
  > * {
    flex: 0 0 calc(50% - 0.5rem);
  }
}
</style>
