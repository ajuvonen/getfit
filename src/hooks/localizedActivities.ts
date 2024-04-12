import {pipe, prop, sortBy, map} from 'remeda';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {ACTIVITIES} from '@/constants';
import type {LocalizedActivity} from '@/types';
import {useScheduleStore} from '@/stores/schedule';

export default function useLocalizedActivities() {
  const {t} = useI18n();
  const scheduleStore = useScheduleStore();
  const localizeAndSort = (activities: string[]): LocalizedActivity[] =>
    pipe(
      activities,
      map((activity) => ({
        value: activity,
        title: t(`activities.${activity}`),
      })),
      sortBy(prop('title')),
    );

  const localizedActivities = computed(() => localizeAndSort(ACTIVITIES));
  const localizedAvailableActivities = computed(() =>
    localizeAndSort(
      ACTIVITIES.filter((activity) => scheduleStore.settings.availableActivities.includes(activity)),
    ),
  );
  return {localizedActivities, localizedAvailableActivities};
}
