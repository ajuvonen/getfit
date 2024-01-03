import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {DATE_FORMATS} from '@/constants';

const sundayFirst = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const mondayFirst = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function useWeekDays() {
  const scheduleStore = useScheduleStore();
  const {schedule} = storeToRefs(scheduleStore);
  const {t, locale} = useI18n();

  const weekdays = computed(() => {
    const dayArray = schedule.value.startsOnSunday ? sundayFirst : mondayFirst;
    return dayArray.map((day) => t(`general.weekdays.${day}`));
  });

  const shortWeekdays = computed(() => {
    const dayArray = schedule.value.startsOnSunday ? sundayFirst : mondayFirst;
    return dayArray.map((day) => t(`general.shortWeekdays.${day}`));
  });

  const weekStart = computed(() => (weekNumber: number) => {
    const startDate = schedule.value.startDate
      ? DateTime.fromJSDate(schedule.value.startDate)
      : DateTime.local().startOf('week');
    return startDate.plus({
      weeks: weekNumber - 1,
    });
  });

  const getDateInterval = computed(() => (weekNumber: number) => {
    const formattedStart = weekStart.value(weekNumber)?.toFormat(DATE_FORMATS[locale.value]);
    const formattedEnd = weekStart
      .value(weekNumber)
      .plus({days: 6})
      .toFormat(DATE_FORMATS[locale.value]);
    return `${formattedStart} - ${formattedEnd}`;
  });

  const getDisplayWeekNumber = computed(
    () => (weekNumber: number) =>
      schedule.value.startDate && schedule.value.actualWeekNumbering
        ? weekStart.value(weekNumber).weekNumber
        : weekNumber,
  );

  return {weekdays, shortWeekdays, getDateInterval, getDisplayWeekNumber};
}
