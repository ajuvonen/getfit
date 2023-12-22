import {computed} from 'vue';
import {useWindowSize} from '@vueuse/core';

export default function useScreenSize() {
  const {width} = useWindowSize();
  const isSmallScreen = computed(() => width.value < 600);
  return {isSmallScreen};
}
