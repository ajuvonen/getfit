<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {required, between, maxLength, integer, helpers} from '@vuelidate/validators';
import VueDatePicker from '@vuepic/vue-datepicker';
import {useScheduleStore} from '@/stores/schedule';
import useLocalizedActivities from '@/hooks/localizedActivities';
import useValidatedRef from '@/hooks/validatedRef';
import {DATE_FORMATS} from '@/constants';
import {decimalRegex} from '@/utils';
import BaseView from '@/components/BaseView.vue';

const {settings} = storeToRefs(useScheduleStore());

const {t} = useI18n();

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
  <BaseView :title="$t('settings.title')" :guide="$t('settings.guide')">
    <template #content>
      <v-text-field
        id="settings-program-name"
        class="settings-input--wide"
        v-model="name"
        :label="$t('settings.programName')"
        :error-messages="nameErrors()"
        maxlength="30"
        counter
        variant="underlined"
      />
      <v-label for="settings-start-of-week">{{ $t('settings.startOfWeek') }}</v-label>
      <v-radio-group id="settings-start-of-week" v-model="settings.startsOnSunday" inline>
        <v-radio
          :label="$t('general.weekdays.monday')"
          :value="false"
          data-test-id="settings-start-of-week-monday"
        ></v-radio>
        <v-radio
          :label="$t('general.weekdays.sunday')"
          :value="true"
          data-test-id="settings-start-of-week-sunday"
        ></v-radio>
      </v-radio-group>
      <v-label for="settings-start-date">{{ $t('settings.startDate') }}</v-label>
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
            id="settings-start-date"
            :model-value="value"
            :placeholder="$t('settings.startDateHint')"
            clearable
            variant="underlined"
            readonly
            data-test-id="settings-start-date-input"
            @keyup.enter="openMenu"
            @click:clear="onClear"
          ></v-text-field>
        </template>
      </VueDatePicker>
      <v-expand-transition>
        <div v-if="settings.startDate">
          <v-label for="settings-week-numbering">
            {{ $t('settings.weekNumbering') }}
          </v-label>
          <v-radio-group id="settings-week-number" v-model="settings.actualWeekNumbering" inline>
            <v-radio
              :label="$t('settings.assignedWeekNumbers')"
              :value="false"
              data-test-id="settings-week-numbering-assigned"
            ></v-radio>
            <v-radio
              :label="$t('settings.actualWeekNumbers')"
              :value="true"
              data-test-id="settings-week-numbering-actual"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-expand-transition>
      <v-label for="settings-unit-of-time">{{ $t('settings.unitOfTime') }}</v-label>
      <v-radio-group id="settings-unit-of-time" v-model="settings.unitOfTime" inline>
        <v-radio
          :label="$t('settings.hours')"
          value="h"
          data-test-id="settings-unit-of-time-h"
        ></v-radio>
        <v-radio
          :label="$t('settings.minutes')"
          value="m"
          data-test-id="settings-unit-of-time-m"
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
              data-test-id="settings-default-start-time-input"
              @keyup.enter="openMenu"
            ></v-text-field>
          </template>
        </VueDatePicker>
      </v-expand-transition>
      <v-text-field
        v-model="duration"
        :error-messages="durationErrors()"
        id="settings-default-duration"
        :suffix="settings.unitOfTime"
        :aria-label="$t('settings.defaultDuration')"
        class="settings-input"
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
        data-test-id="settings-toggle-all-activities"
      />
      <div role="group">
        <div
          v-for="activity in localizedActivities"
          :key="activity.value"
          class="settings__icon-container d-inline-flex"
        >
          <v-checkbox-btn
            :id="`settings-activity-${activity.value}`"
            v-model="settings.availableActivities"
            :value="activity.value"
            class="flex-grow-0"
          />
          <v-label :for="`settings-activity-${activity.value}`" class="flex-grow-1">
            <v-icon :icon="activity.icon" size="large" />
            {{ activity.title }}
          </v-label>
        </div>
      </div>
    </template>
  </BaseView>
</template>

<style lang="scss" scoped>
:deep(.v-field__clearable) {
  align-items: center !important;
}

.dp__main,
.settings-input {
  max-width: 175px;
}

:deep(.dp__input_wrap) {
  box-sizing: border-box;
}

.settings-input--wide {
  max-width: 500px;
}

.v-label {
  display: block;
}

.settings__icon-container {
  align-items: center;
  width: 12rem;
}
</style>
