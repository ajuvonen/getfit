import {DateTime} from 'luxon';
import {useI18n} from 'vue-i18n';
import type {CalendarEvent, ScheduleSettings, Week} from '@/types';

export default function useCalendarExport() {
  const createCalendarEvents = (weeks: Week[], settings: ScheduleSettings) => {
    const events = [] as CalendarEvent[];

    const {t} = useI18n();

    weeks.forEach(({trainings}, weekIndex) => {
      const startDate = DateTime.fromJSDate(settings.startDate!).plus({weeks: weekIndex}).set({
        hour: settings.defaultStartTime.hours,
        minute: settings.defaultStartTime.minutes,
      });
      let accumulatedDuration = 0;
      let currentDayIndex = -1;
      trainings.forEach(
        ({activity, dayIndex, title, description, duration, intensity, location}) => {
          if (dayIndex !== currentDayIndex) {
            accumulatedDuration = 0;
            currentDayIndex = dayIndex;
          }
          const minutes = settings.unitOfTime === 'm' ? duration : duration * 60;
          const start = startDate.plus({days: dayIndex}).plus({minutes: accumulatedDuration});
          events.push({
            title: title || t(`activities.${activity}`),
            description,
            start: [start.year, start.month, start.day, start.hour, start.minute],
            duration: {minutes},
            location,
            categories: [t(`activities.${activity}`), t(`intensities.${intensity}`)],
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            productId: 'ajuvonen/getfit',
          });
          accumulatedDuration = accumulatedDuration + minutes;
        },
      );
    });

    return events;
  };

  return {createCalendarEvents};
}
