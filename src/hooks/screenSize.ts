import {computed} from 'vue';
import {useMq} from 'vue3-mq';

export default function useScreenSize() {
  const mq = useMq();
  const isSmallScreen = computed(() => mq.current === 'xs');
  return {isSmallScreen};
}
