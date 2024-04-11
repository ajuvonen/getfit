<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {required, between, maxLength, helpers} from '@vuelidate/validators';
import VueDatePicker from '@vuepic/vue-datepicker';
import {useScheduleStore} from '@/stores/schedule';
import useLocalizedActivities from '@/hooks/localizedActivities';
import useValidatedRef from '@/hooks/validatedRef';
import {DATE_FORMATS} from '@/constants';
import {decimalRegex, getIcon} from '@/utils';
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
    between: settings.value.defaultUnitOfDuration === 'h' ? between(0, 10) : between(0, 500),
    precision: helpers.withMessage(t('errors.invalidPrecision'), decimalRegex),
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
        :error-messages="nameErrors"
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
        :min-date="DateTime.now().minus({years: 1}).toJSDate()"
        :locale="$i18n.locale"
        :clearable="false"
        :format="DATE_FORMATS[$i18n.locale]"
        :teleport="true"
      >
        <template #dp-input="{value, onClear, openMenu}">
          <v-text-field
            id="settings-start-date"
            :model-value="value"
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
      <v-label>{{ $t('settings.defaultStart') }}</v-label>
      <v-expand-transition>
        <VueDatePicker
          v-if="settings.startDate"
          v-model="settings.defaultStartTime"
          :auto-apply="true"
          :locale="$i18n.locale"
          :clearable="false"
          :teleport="true"
          minutes-increment="5"
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
        v-model.number="duration"
        :error-messages="durationErrors"
        id="settings-default-duration"
        :aria-label="$t('settings.defaultDuration')"
        class="settings-input"
        type="text"
        variant="underlined"
        inputmode="decimal"
      ></v-text-field>
      <v-label for="settings-default-unit-of-duration">{{
        $t('settings.defaultUnitOfDuration')
      }}</v-label>
      <v-radio-group
        id="settings-default-unit-of-duration"
        v-model="settings.defaultUnitOfDuration"
        inline
      >
        <v-radio
          v-for="unit in ['h', 'm', 'km', 'mi']"
          :label="$t(`general.unitsOfDuration.${unit}`)"
          :key="unit"
          :value="unit"
          :data-test-id="`settings-default-unit-of-duration-${unit}`"
        ></v-radio>
      </v-radio-group>
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
            <v-icon :icon="getIcon(activity.value)" size="large" />
            {{ activity.title }}
          </v-label>
        </div>
      </div>
      <v-label for="settings-visual-mode">{{ $t('settings.theme') }}</v-label>
      <v-radio-group id="settings-visual-mode" v-model="settings.darkMode" inline hide-details>
        <v-radio
          :label="$t('settings.darkModeAuto')"
          value="auto"
          data-test-id="settings-visual-mode-auto"
        ></v-radio>
        <v-radio
          :label="$t('settings.darkModeLight')"
          value="light"
          data-test-id="settings-visual-mode-light"
        ></v-radio>
        <v-radio
          :label="$t('settings.darkModeDark')"
          value="dark"
          data-test-id="settings-visual-mode-dark"
        ></v-radio>
      </v-radio-group>
      <v-label for="settings-card-background">{{ $t('settings.cardBackground') }}</v-label>
      <v-radio-group
        id="settings-card-background"
        v-model="settings.decoratedCards"
        inline
        hide-details
      >
        <v-radio
          :label="$t('settings.decoratedCards')"
          :value="true"
          data-test-id="settings-decorated-cards"
        ></v-radio>
        <v-radio
          :label="$t('settings.plainCards')"
          :value="false"
          data-test-id="settings-plain-cards"
        ></v-radio>
      </v-radio-group>
    </template>
  </BaseView>
</template>

<style lang="scss" scoped>
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
