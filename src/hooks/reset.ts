import {useRouter} from 'vue-router';
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';

export default function useReset() {
  const router = useRouter();

  const scheduleStore = useScheduleStore();
  const appStateStore = useAppStateStore();

  const {$reset: resetSchedule} = scheduleStore;
  const {$reset: resetAppState} = appStateStore;

  return () => {
    resetSchedule();
    resetAppState();
    router.push('/');
  };
}
