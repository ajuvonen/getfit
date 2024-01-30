import {DateTime} from 'luxon';
import {useI18n} from 'vue-i18n';
import type {CalendarEvent} from '@/types';
import {useScheduleStore} from '@/stores/schedule';
import {storeToRefs} from 'pinia';

export default function useCalendarExport() {
  const {t} = useI18n();
  const scheduleStore = useScheduleStore();
  const {settings, weeks} = storeToRefs(scheduleStore);

  const createCalendarEvents = () =>
    weeks.value.flatMap(({trainings}, weekIndex) => {
      const startDate = DateTime.fromJSDate(settings.value.startDate!)
        .plus({weeks: weekIndex})
        .set({
          hour: settings.value.defaultStartTime.hours,
          minute: settings.value.defaultStartTime.minutes,
        });
      let accumulatedDuration = 0;
      let currentDayIndex = 0;
      return trainings.map(
        ({activity, dayIndex, title, description, duration, intensity, location}) => {
          if (dayIndex !== currentDayIndex) {
            accumulatedDuration = 0;
            currentDayIndex = dayIndex;
          }
          const minutes = settings.value.unitOfTime === 'm' ? duration : duration * 60;
          const start = startDate.plus({days: dayIndex}).plus({minutes: accumulatedDuration});
          accumulatedDuration = accumulatedDuration + minutes;
          return {
            title: title || t(`activities.${activity}`),
            description,
            start: [start.year, start.month, start.day, start.hour, start.minute],
            duration: {minutes},
            location,
            categories: [t(`activities.${activity}`), t(`intensities.${intensity}`)],
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            transp: 'OPAQUE',
            productId: 'ajuvonen/getfit',
            classification: 'PRIVATE',
            calName: settings.value.name || t('export.filename'),
          } as CalendarEvent;
        },
      );
    });

  return {createCalendarEvents};
}
