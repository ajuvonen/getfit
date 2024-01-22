import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';

export default function useReset() {
  const router = useRouter();

  const {t} = useI18n();

  const scheduleStore = useScheduleStore();
  const appStateStore = useAppStateStore();
  const {openConfirmDialog} = appStateStore;

  const {$reset: resetSchedule} = scheduleStore;
  const {$reset: resetAppState} = appStateStore;

  return () => {
    openConfirmDialog(t('general.confirmReset'), () => {
      resetSchedule();
      resetAppState();
      router.push('/');
    });
  };
}
