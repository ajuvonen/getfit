import {computed} from 'vue';
import {usePreferredDark, useWindowSize} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useScheduleStore} from '@/stores/schedule';

export default function useScreen() {
  const {width} = useWindowSize();
  const preferredDark = usePreferredDark();

  const {settings} = storeToRefs(useScheduleStore());

  const isSmallScreen = computed(() => width.value < 600);
  const isLargeScreen = computed(() => width.value >= 960);

  const isDark = computed(() =>
    settings.value.darkMode === 'auto' ? preferredDark.value : settings.value.darkMode === 'dark',
  );

  return {isSmallScreen, isLargeScreen, isDark};
}
