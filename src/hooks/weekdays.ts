import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {DATE_FORMATS, SHORT_DATE_FORMATS, WEEKDAYS} from '@/constants';
import type {Locale} from '@/types';

export default function useWeekDays() {
  const scheduleStore = useScheduleStore();
  const {settings} = storeToRefs(scheduleStore);
  const {t, locale} = useI18n();

  const weekdays = computed(() => {
    const dayArray = settings.value.startsOnSunday ? WEEKDAYS.sundayFirst : WEEKDAYS.mondayFirst;
    return dayArray.map((day) => t(`general.weekdays.${day}`));
  });

  const shortWeekdays = computed(() => {
    const dayArray = settings.value.startsOnSunday ? WEEKDAYS.sundayFirst : WEEKDAYS.mondayFirst;
    return dayArray.map((day) => t(`general.shortWeekdays.${day}`));
  });

  const getWeekStart = computed(() => (weekIndex: number) => {
    const startDate = settings.value.startDate
      ? DateTime.fromJSDate(settings.value.startDate)
      : DateTime.local().startOf('week');
    return startDate.plus({
      weeks: weekIndex,
    });
  });

  const getDateInterval = computed(() => (weekIndex: number) => {
    const formattedStart = getWeekStart
      .value(weekIndex)
      .toFormat(DATE_FORMATS[locale.value as Locale]);
    const formattedEnd = getWeekStart
      .value(weekIndex)
      .plus({days: 6})
      .endOf('day')
      .toFormat(DATE_FORMATS[locale.value as Locale]);
    return `${formattedStart} - ${formattedEnd}`;
  });

  const getDisplayWeekNumber = computed(
    () => (weekIndex: number) =>
      settings.value.startDate && settings.value.actualWeekNumbering
        ? getWeekStart.value(weekIndex).weekNumber
        : weekIndex + 1,
  );

  const getShortDate = computed(
    () => (weekIndex: number, dayIndex: number) =>
      getWeekStart
        .value(weekIndex)
        .plus({days: dayIndex})
        .toFormat(SHORT_DATE_FORMATS[locale.value as Locale]),
  );

  return {weekdays, shortWeekdays, getDateInterval, getDisplayWeekNumber, getShortDate};
}
