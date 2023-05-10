import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';
import {useI18n} from 'vue-i18n';

export default function useWeekDays() {
  const scheduleStore = useScheduleStore();
  const {schedule} = storeToRefs(scheduleStore);
  const {t} = useI18n();

  const weekdays = computed(() => {
    const dayArray = schedule.value.startsOnSunday
      ? ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return dayArray.map((day) => t(`general.weekdays.${day}`));
  });

  return {weekdays};
}
