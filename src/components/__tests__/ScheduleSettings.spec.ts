// import {nextTick} from 'vue';
import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import ScheduleSettings from '@/components/ScheduleSettings.vue';
// import {VSwitch} from 'vuetify/components/VSwitch';

describe('ScheduleSettings', () => {
  const scheduleStore = useScheduleStore();
  const appStateStore = useAppStateStore();

  beforeEach(() => {
    appStateStore.$reset();
    scheduleStore.$reset();
  });

  it('mounts', () => {
    const wrapper = mount(ScheduleSettings);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
