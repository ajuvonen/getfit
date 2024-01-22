<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {required, between, maxLength, integer, helpers} from '@vuelidate/validators';
import VueDatePicker from '@vuepic/vue-datepicker';
import {useScheduleStore} from '@/stores/schedule';
import useLocalizedActivities from '@/hooks/localizedActivities';
import useScreenSize from '@/hooks/screenSize';
import useValidatedRef from '@/hooks/validatedRef';
import useReset from '@/hooks/reset';
import {DATE_FORMATS} from '@/constants';
import {decimalRegex} from '@/utils';

const scheduleStore = useScheduleStore();
const {settings} = storeToRefs(scheduleStore);
const {addWeek} = scheduleStore;

const reset = useReset();

const {t} = useI18n();

const {isSmallScreen, isMediumScreen} = useScreenSize();

const settingsOpen = ref<number | null>(0);

const {localizedActivities} = useLocalizedActivities();

const selectAll = computed({
  get() {
    return settings.value.availableActivities.length === localizedActivities.value.length;
  },
  set() {
    if (settings.value.availableActivities.length === localizedActivities.value.length) {
      settings.value.availableActivities = [];
    } else {
      settings.value.availableActivities = localizedActivities.value.map(
        (activity) => activity.value,
      );
    }
  },
});

const getDisabledDays = computed(() =>
  settings.value.startsOnSunday ? [1, 2, 3, 4, 5, 6] : [0, 2, 3, 4, 5, 6],
);

const rules = computed(() => ({
  name: {maxLength: maxLength(30)},
  defaultDuration: {
    required,
    between: between(0, settings.value.unitOfTime === 'm' ? 360 : 6),
    precision:
      settings.value.unitOfTime === 'm'
        ? integer
        : helpers.withMessage(t('errors.invalidPrecision'), decimalRegex),
  },
}));

const [name, nameErrors] = useValidatedRef(settings, 'name', rules);
const [duration, durationErrors] = useValidatedRef(settings, 'defaultDuration', rules);
</script>
<template>
  <v-card
    color="rgba(255,255,255,0.9)"
    class="mb-10"
    :rounded="isSmallScreen || isMediumScreen ? 0 : 'rounded'"
  >
    <v-card-text>
      <v-expansion-panels v-model="settingsOpen">
        <v-expansion-panel elevation="0" class="bg-transparent">
          <v-expansion-panel-title data-test-id="schedule-settings-heading">
            <h2 class="text-h5">{{ $t('settings.title') }}</h2>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-text-field
              id="schedule-settings-program-name"
              class="schedule-settings-input--wide"
              v-model="name"
              :label="$t('settings.programName')"
              :error-messages="nameErrors"
              maxlength="30"
              counter
              variant="underlined"
            />
            <v-label for="schedule-settings-start-of-week">{{
              $t('settings.startOfWeek')
            }}</v-label>
            <v-radio-group
              id="schedule-settings-start-of-week"
              v-model="settings.startsOnSunday"
              inline
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
              v-model="settings.startDate"
              :auto-apply="true"
              :disabled-week-days="getDisabledDays"
              :start-time="{hours: 0, minutes: 0}"
              :enable-time-picker="false"
              :week-start="settings.startsOnSunday ? 0 : 1"
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
                  data-test-id="schedule-settings-start-date-input"
                  @keyup.enter="openMenu"
                  @click:clear="onClear"
                ></v-text-field>
              </template>
            </VueDatePicker>
            <v-expand-transition>
              <div v-if="settings.startDate">
                <v-label for="schedule-settings-week-numbering">
                  {{ $t('settings.weekNumbering') }}
                </v-label>
                <v-radio-group
                  id="schedule-settings-week-number"
                  v-model="settings.actualWeekNumbering"
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
            <v-radio-group id="schedule-settings-unit-of-time" v-model="settings.unitOfTime" inline>
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
            <v-label>{{ $t('settings.defaultStart') }}</v-label>
            <v-expand-transition>
              <VueDatePicker
                v-if="settings.startDate"
                v-model="settings.defaultStartTime"
                :auto-apply="true"
                :locale="$i18n.locale"
                :clearable="false"
                minutes-increment="5"
                teleport-center
                time-picker
              >
                <template #dp-input="{value, openMenu}">
                  <v-text-field
                    :model-value="value"
                    :aria-label="$t('settings.defaultStartTime')"
                    variant="underlined"
                    readonly
                    hide-details
                    data-test-id="schedule-settings-default-start-time-input"
                    @keyup.enter="openMenu"
                  ></v-text-field>
                </template>
              </VueDatePicker>
            </v-expand-transition>
            <v-text-field
              v-model="duration"
              :error-messages="durationErrors"
              id="schedule-settings-default-duration"
              :suffix="settings.unitOfTime"
              :aria-label="$t('settings.defaultDuration')"
              class="schedule-settings-input"
              type="number"
              variant="underlined"
              hide-spin-buttons
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
                  v-model="settings.availableActivities"
                  :value="activity.value"
                  class="flex-grow-0"
                />
                <v-label :for="`schedule-settings-activity-${activity.value}`" class="flex-grow-1">
                  <v-icon :icon="activity.icon" size="large" />
                  {{ activity.title }}
                </v-label>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions>
      <v-btn
        prepend-icon="mdi-plus"
        data-test-id="schedule-settings-add-week-button"
        @click="addWeek(), (settingsOpen = null)"
        >{{ $t('settings.addWeek') }}</v-btn
      >
      <v-btn
        prepend-icon="mdi-trash-can-outline"
        color="error"
        variant="outlined"
        data-test-id="schedule-settings-reset-button"
        @click="reset"
        >{{ $t('settings.reset') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
:deep(.v-field__clearable) {
  align-items: center !important;
}

.dp__main,
.schedule-settings-input {
  max-width: 175px;
}

:deep(.dp__input_wrap) {
  box-sizing: border-box;
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
