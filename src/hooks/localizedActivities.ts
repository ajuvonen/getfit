import {prop, sortBy} from 'ramda';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {ACTIVITIES} from '@/constants';
import type {BaseActivity, LocalizedActivity} from '@/types';
import {useScheduleStore} from '@/stores/schedule';

export default function useLocalizedActivities() {
  const {t} = useI18n();
  const scheduleStore = useScheduleStore();
  const localizeAndSort = (activities: BaseActivity[]) =>
    sortBy(
      prop('title'),
      activities.map((activity) => ({
        ...activity,
        title: t(`activities.${activity.value}`),
      })),
    ) as LocalizedActivity[];

  const localizedActivities = computed(() => localizeAndSort(ACTIVITIES));
  const localizedAvailableActivities = computed(() =>
    localizeAndSort(
      ACTIVITIES.filter(({value}) => scheduleStore.schedule.availableActivities.includes(value)),
    ),
  );
  return {localizedActivities, localizedAvailableActivities};
}
