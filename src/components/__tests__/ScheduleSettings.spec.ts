import {nextTick} from 'vue';
import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import ScheduleSettings from '@/components/ScheduleSettings.vue';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {VSwitch} from 'vuetify/components/VSwitch';

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

  // it('hides actions when schedule is locked', async () => {
  //   const wrapper = mount(ScheduleSettings);
  //   expect(wrapper.findByTestId('schedule-settings-add-week-button').exists()).toBe(true);

  //   wrapper.findComponent(VSwitch).vm.$emit('update:modelValue');
  //   expect(scheduleStore.toggleLockSchedule).toHaveBeenCalled();
  //   scheduleStore.schedule.lockSchedule = true;
  //   await nextTick();
  //   expect(wrapper.findByTestId('schedule-settings-add-week-button').exists()).toBe(false);
  // });
});
