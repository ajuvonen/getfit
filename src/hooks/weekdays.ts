import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';
import {useI18n} from 'vue-i18n';

const sundayFirst = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const mondayFirst = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function useWeekDays() {
  const scheduleStore = useScheduleStore();
  const {schedule} = storeToRefs(scheduleStore);
  const {t} = useI18n();

  const weekdays = computed(() => {
    const dayArray = schedule.value.startsOnSunday ? sundayFirst : mondayFirst;
    return dayArray.map((day) => t(`general.weekdays.${day}`));
  });

  const shortWeekdays = computed(() => {
    const dayArray = schedule.value.startsOnSunday ? sundayFirst : mondayFirst;
    return dayArray.map((day) => t(`general.shortWeekdays.${day}`));
  });

  return {weekdays, shortWeekdays};
}
