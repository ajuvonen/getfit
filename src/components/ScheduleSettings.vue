<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import useVuelidate from '@vuelidate/core';
import {required, between, maxLength, integer, helpers} from '@vuelidate/validators';
import VueDatePicker from '@vuepic/vue-datepicker';
import {useScheduleStore} from '@/stores/schedule';
import useLocalizedActivities from '@/hooks/localizedActivities';
import useScreenSize from '@/hooks/screenSize';
import {DATE_FORMATS} from '@/constants';
import {getValidationErrors, decimalRegex} from '@/utils';

const scheduleStore = useScheduleStore();
const {schedule} = storeToRefs(scheduleStore);
const {addWeek, changeUnitOfTime, changeStartOfWeek, toggleLockSchedule} = scheduleStore;

const {t} = useI18n();

const {isSmallScreen, isMediumScreen} = useScreenSize();

const settingsOpen = ref<number | null>(0);

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
        (activity) => activity.value,
      );
    }
  },
});

const getDisabledDays = computed(() =>
  schedule.value.startsOnSunday ? [1, 2, 3, 4, 5, 6] : [0, 2, 3, 4, 5, 6],
);

const rules = computed(() => ({
  // name: {maxLength: maxLength(30)},
  defaultDuration: {
    required,
    between: between(0, schedule.value.unitOfTime === 'm' ? 300 : 6),
    precision:
      schedule.value.unitOfTime === 'm'
        ? integer
        : helpers.withMessage(t('errors.invalidPrecision'), decimalRegex),
  },
}));

const v$ = useVuelidate(rules, schedule);
</script>
<template>
  <v-card color="rgba(255,255,255,0.9)" class="mb-10" :rounded="isSmallScreen || isMediumScreen ? 0 : 'rounded'">
    <v-card-text>
      <v-expansion-panels v-model="settingsOpen">
        <v-expansion-panel elevation="0" class="bg-transparent">
          <v-expansion-panel-title data-test-id="schedule-settings__heading">
            <h2 class="text-h5">{{ $t('settings.title') }}</h2>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <!-- <v-text-field
              id="schedule-settings-program-name"
              class="schedule-settings-input--wide"
              v-model="schedule.name"
              :label="$t('settings.programName')"
              :error-messages="getValidationErrors(v$.name)"
              maxlength="30"
              counter
              variant="underlined"
              @input="v$.name.$touch"
              @blur="v$.name.$touch"
            /> -->
            <v-label for="schedule-settings-start-of-week">{{
              $t('settings.startOfWeek')
            }}</v-label>
            <v-radio-group
              id="schedule-settings-start-of-week"
              :model-value="schedule.startsOnSunday"
              inline
              @update:model-value="changeStartOfWeek"
            >
              <v-radio
                :label="$t('general.weekdays.monday')"
                :value="false"
                data-test-id="schedule-settings-start-of-week-monday"
              ></v-radio>
              <v-radio
                :label="$t('general.weekdays.sunday')"
                :value="true"
                data-test-id="schedule-settings-start-of-week-sunday"
              ></v-radio>
            </v-radio-group>
            <v-label for="schedule-settings-start-date">{{ $t('settings.startDate') }}</v-label>
            <VueDatePicker
              v-model="schedule.startDate"
              :auto-apply="true"
              :disabled-week-days="getDisabledDays"
              :start-time="{hours: 0, minutes: 0}"
              :enable-time-picker="false"
              :week-start="schedule.startsOnSunday ? 0 : 1"
              :min-date="DateTime.now().startOf('week').toJSDate()"
              :locale="$i18n.locale"
              :clearable="false"
              :format="DATE_FORMATS[$i18n.locale]"
              teleport-center
            >
              <template #dp-input="{value, onClear, openMenu}">
                <v-text-field
                  id="schedule-settings-start-date"
                  :model-value="value"
                  :placeholder="$t('settings.startDateHint')"
                  clearable
                  variant="underlined"
                  readonly
                  @keyup.enter="openMenu"
                  @click:clear="onClear"
                ></v-text-field>
              </template>
            </VueDatePicker>
            <v-expand-transition>
              <div v-if="schedule.startDate">
                <v-label for="schedule-settings-week-numbering">
                  {{ $t('settings.weekNumbering') }}
                </v-label>
                <v-radio-group
                  id="schedule-settings-week-number"
                  v-model="schedule.actualWeekNumbering"
                  inline
                >
                  <v-radio
                    :label="$t('settings.assignedWeekNumbers')"
                    :value="false"
                    data-test-id="schedule-settings-week-numbering-assigned"
                  ></v-radio>
                  <v-radio
                    :label="$t('settings.actualWeekNumbers')"
                    :value="true"
                    data-test-id="schedule-settings-week-numbering-actual"
                  ></v-radio>
                </v-radio-group>
              </div>
            </v-expand-transition>
            <v-label for="schedule-settings-unit-of-time">{{ $t('settings.unitOfTime') }}</v-label>
            <v-radio-group
              id="schedule-settings-unit-of-time"
              :model-value="schedule.unitOfTime"
              @update:model-value="changeUnitOfTime"
              inline
            >
              <v-radio
                :label="$t('settings.hours')"
                value="h"
                data-test-id="schedule-settings-unit-of-time-h"
              ></v-radio>
              <v-radio
                :label="$t('settings.minutes')"
                value="m"
                data-test-id="schedule-settings-unit-of-time-m"
              ></v-radio>
            </v-radio-group>
            <v-label for="schedule-settings-default-duration">Default Activity Duration</v-label>
            <v-text-field
              id="schedule-settings-default-duration"
              class="schedule-settings-input"
              v-model="schedule.defaultDuration"
              :error-messages="getValidationErrors(v$.defaultDuration)"
              :suffix="schedule.unitOfTime"
              type="number"
              variant="underlined"
              hide-spin-buttons
              @input="v$.defaultDuration.$touch"
              @blur="v$.defaultDuration.$touch"
            ></v-text-field>
            <v-label>{{ $t('settings.availableActivities') }}</v-label>
            <v-checkbox-btn
              v-model="selectAll"
              :value="true"
              :label="$t('settings.toggleAllActivities')"
              color="secondary"
              data-test-id="schedule-settings-toggle-all-activities"
            />
            <div role="group">
              <div
                v-for="activity in localizedActivities"
                :key="activity.value"
                class="schedule-settings__icon-container d-inline-flex"
              >
                <v-checkbox-btn
                  :id="`schedule-settings-activity-${activity.value}`"
                  v-model="schedule.availableActivities"
                  :value="activity.value"
                  class="flex-grow-0"
                />
                <v-label :for="`schedule-settings-activity-${activity.value}`" class="flex-grow-1">
                  <v-icon :icon="activity.icon" size="large" />
                  {{ activity.title }}
                </v-label>
              </div>
            </div>
            <!-- <v-label for="schedule-settings-lock-schedule-button">{{
              $t('settings.lockSchedule')
            }}</v-label>
            <v-switch
              id="schedule-settings-lock-schedule-button"
              :model-value="schedule.lockSchedule"
              :value="true"
              color="secondary"
              hide-details="auto"
              @update:model-value="toggleLockSchedule"
            /> -->
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions v-if="!schedule.lockSchedule">
      <v-btn
        prepend-icon="mdi-plus"
        data-test-id="schedule-settings-add-week-button"
        @click="addWeek(), (settingsOpen = null)"
        >{{ $t('settings.addWeek') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
:deep(#schedule-settings-start-date) {
  padding-top: 0;
  padding-bottom: 0;
}

.dp__main, .schedule-settings-input {
  max-width: 150px;
}

.schedule-settings-input--wide {
  max-width: 500px;
}

.v-label {
  display: block;
}

.schedule-settings__icon-container {
  align-items: center;
  width: 12rem;
}
</style>
