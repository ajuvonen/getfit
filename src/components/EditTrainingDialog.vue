<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useVuelidate} from '@vuelidate/core';
import {required, between, maxLength, integer, helpers} from '@vuelidate/validators';
import type {VForm} from 'vuetify/components';
import {Intensity} from '@/types';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {ACTIVITIES} from '@/constants';
import {getIntensityColor, getIcon, getValidationErrors, decimalRegex} from '@/utils';
import useLocalizedActivities from '@/hooks/localizedActivities';
import BaseDialog from '@/components/BaseDialog.vue';

const scheduleStore = useScheduleStore();
const {settings} = storeToRefs(scheduleStore);
const {addOrEditTraining} = scheduleStore;

const {trainingDialogOpen, trainingData} = storeToRefs(useAppStateStore());

const {t} = useI18n();

const tickLabels = computed(() => ({
  [Intensity.LIGHT]: t('intensities.0'),
  [Intensity.NORMAL]: t('intensities.1'),
  [Intensity.MEDIUM]: t('intensities.2'),
  [Intensity.HEAVY]: t('intensities.3'),
}));

const {localizedAvailableActivities} = useLocalizedActivities();

const handleSave = async () => {
  if (await v$.value.$validate()) {
    addOrEditTraining(trainingData.value);
    resetAndClose();
  }
};

const rules = computed(() => ({
  title: {maxLength: maxLength(30)},
  location: {maxLength: maxLength(40)},
  description: {maxLength: maxLength(2000)},
  duration: {
    required,
    between: between(0, settings.value.unitOfTime === 'm' ? 360 : 6),
    precision:
      settings.value.unitOfTime === 'm'
        ? integer
        : helpers.withMessage(t('errors.invalidPrecision'), decimalRegex),
  },
  activity: {required},
}));

const v$ = useVuelidate(rules, trainingData);

const resetAndClose = () => {
  v$.value.$reset();
  trainingDialogOpen.value = false;
};
</script>
<template>
  <BaseDialog :open="trainingDialogOpen" :title="$t('editTraining.title')">
    <template #content>
      <v-form>
        <v-label for="edit-training-activity">{{ $t('editTraining.activity') }}</v-label>
        <v-select
          id="edit-training-activity"
          v-model="trainingData.activity"
          :error-messages="getValidationErrors(v$.activity)"
          :items="localizedAvailableActivities"
          eager
          data-test-id="edit-training-activity"
          @input="v$.activity.$touch"
          @blur="v$.activity.$touch"
        >
          <template #selection="{item: {title, value}}">
            <div v-if="value">
              <v-icon :icon="getIcon(ACTIVITIES, value)" />
              {{ title }}
            </div>
          </template>
          <template #item="{item: {title, value}, props}">
            <v-list-item v-bind="props" :data-test-id="`edit-training-activity-${value}`">
              <template #title>
                <v-icon :icon="getIcon(ACTIVITIES, value)" />
                {{ title }}
              </template>
            </v-list-item>
          </template>
        </v-select>
        <v-text-field
          v-model="trainingData.title"
          :label="t('editTraining.trainingTitle')"
          :error-messages="getValidationErrors(v$.title)"
          maxlength="30"
          counter
          data-test-id="edit-training-title"
          @input="v$.title.$touch"
          @blur="v$.title.$touch"
        />
        <v-text-field
          v-model="trainingData.location"
          :label="t('editTraining.location')"
          :error-messages="getValidationErrors(v$.location)"
          maxlength="40"
          counter
          data-test-id="edit-training-location"
          @input="v$.location.$touch"
          @blur="v$.location.$touch"
        />
        <v-text-field
          v-model.number="trainingData.duration"
          :error-messages="getValidationErrors(v$.duration)"
          :suffix="settings.unitOfTime"
          :label="t('editTraining.duration')"
          class="edit-training-duration"
          type="number"
          data-test-id="edit-training-duration"
          @input="v$.duration.$touch"
          @blur="v$.duration.$touch"
        />
        <v-textarea
          v-model="trainingData.description"
          :label="t('editTraining.description')"
          :error-messages="getValidationErrors(v$.description)"
          clearable
          maxlength="2000"
          no-resize
          counter
          data-test-id="edit-training-description"
          @input="v$.description.$touch"
          @blur="v$.description.$touch"
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
        prepend-icon="mdi-content-save"
        variant="outlined"
        color="primary"
        data-test-id="edit-training-save-button"
        @click="handleSave()"
        >{{ $t('editTraining.save') }}</v-btn
      >
      <v-btn
        prepend-icon="mdi-close"
        data-test-id="edit-training-close-button"
        variant="text"
        @click="resetAndClose"
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
</style>
