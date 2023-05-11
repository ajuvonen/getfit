<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import {maxLength} from '@vuelidate/validators';
import {useScheduleStore} from '@/stores/schedule';
import useLocalizedActivities from '@/hooks/localizedActivities';
import {getValidationErrors} from '@/utils';

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {addWeek, changeUnitOfTime, toggleLockSchedule} = scheduleStore;
const {t} = useI18n();
const settingsOpen = ref(0);
const {localizedActivities} = useLocalizedActivities();

const selectAll = computed({
  get() {
    return schedule.value.availableActivities.length === localizedActivities.value.length;
  },
  set() {
    if (schedule.value.availableActivities.length === localizedActivities.value.length) {
      schedule.value.availableActivities = [];
    } else {
      schedule.value.availableActivities = localizedActivities.value.map(
        (activity) => activity.value
      );
    }
  },
});

const v$ = useVuelidate(
  {
    name: {maxLength: maxLength(30)},
  },
  schedule
);
</script>
<template>
  <v-card class="mx-auto mt-10 mb-10">
    <v-card-text>
      <v-expansion-panels v-model="settingsOpen">
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>
            <h2 class="text-h5">{{ t('settings.title') }}</h2>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-text-field
              id="schedule-settings-program-name"
              v-model="schedule.name"
              :label="t('settings.programName')"
              :error-messages="getValidationErrors(v$.name)"
              maxlength="30"
              counter
              variant="underlined"
              @input="v$.name.$touch"
              @blur="v$.name.$touch"
            />
            <v-label for="schedule-settings-start-of-week">{{ t('settings.startOfWeek') }}</v-label>
            <v-radio-group
              id="schedule-settings-start-of-week"
              v-model="schedule.startsOnSunday"
              inline
            >
              <v-radio
                :label="t('general.weekdays.monday')"
                :value="false"
                data-test-id="settings-start-of-week-monday"
              ></v-radio>
              <v-radio
                :label="t('general.weekdays.sunday')"
                :value="true"
                data-test-id="settings-start-of-week-sunday"
              ></v-radio>
            </v-radio-group>
            <v-label for="schedule-settings-unit-of-time">{{ t('settings.unitOfTime') }}</v-label>
            <v-radio-group
              id="schedule-settings-unit-of-time"
              :model-value="schedule.unitOfTime"
              @update:model-value="changeUnitOfTime"
              inline
            >
              <v-radio :label="t('settings.hours')" value="h" data-test-id="settings-unit-of-time-h"></v-radio>
              <v-radio :label="t('settings.minutes')" value="m" data-test-id="settings-unit-of-time-m"></v-radio>
            </v-radio-group>
            <v-label>{{ t('settings.availableActivities') }}</v-label>
            <v-checkbox-btn
              v-model="selectAll"
              :value="true"
              label="Toggle All"
              color="secondary"
              hide-details="auto"
              data-test-id="settings-toggle-all-activities"
            />
            <div role="group">
              <div
                v-for="activity in localizedActivities"
                :key="activity.value"
                class="settings__icon-container"
              >
                <v-checkbox-btn
                  :id="`settings-activity-${activity.value}`"
                  v-model="schedule.availableActivities"
                  :value="activity.value"
                  :data-test-id="`settings-activity-${activity.value}`"
                  class="flex-grow-0"
                />
                <v-label :for="`settings-activity-${activity.value}`" class="flex-grow-1">
                  <v-icon :icon="activity.icon" size="large" />
                  {{ activity.title }}
                </v-label>
              </div>
            </div>
            <v-label for="settings-lock-schedule">{{ t('settings.lockSchedule') }}</v-label>
            <v-switch
              id="settings-lock-schedule"
              :model-value="schedule.lockSchedule"
              :value="true"
              color="secondary"
              hide-details="auto"
              @update:model-value="toggleLockSchedule"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions v-if="!schedule.lockSchedule">
      <v-btn @click="addWeek()" prepend-icon="mdi-plus" data-test-id="settings-add-week">{{
        t('settings.addWeek')
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
.v-input {
  max-width: 500px;
}

.v-label {
  display: block;
}

.settings__icon-container {
  display: inline-flex;
  align-items: center;
  width: 12rem;
}
</style>
