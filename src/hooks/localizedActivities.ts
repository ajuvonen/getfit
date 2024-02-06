import {pipe, prop, sortBy, map} from 'remeda';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {ACTIVITIES} from '@/constants';
import type {BaseActivity, LocalizedActivity} from '@/types';
import {useScheduleStore} from '@/stores/schedule';

export default function useLocalizedActivities() {
  const {t} = useI18n();
  const scheduleStore = useScheduleStore();
  const localizeAndSort = (activities: BaseActivity[]): LocalizedActivity[] =>
    pipe(
      activities,
      map((activity) => ({
        ...activity,
        title: t(`activities.${activity.value}`),
      })),
      sortBy(prop('title')),
    );

  const localizedActivities = computed(() => localizeAndSort(ACTIVITIES));
  const localizedAvailableActivities = computed(() =>
    localizeAndSort(
      ACTIVITIES.filter(({value}) => scheduleStore.settings.availableActivities.includes(value)),
    ),
  );
  return {localizedActivities, localizedAvailableActivities};
}
