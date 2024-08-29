import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {DateTime} from 'luxon';
import SettingsView from '@/views/SettingsView.vue';
import {useScheduleStore} from '@/stores/schedule';
import {ACTIVITIES} from '@/constants';

describe('SettingsView', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
  });

  it('mounts', () => {
    const wrapper = mount(SettingsView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('mounts with start date', () => {
    scheduleStore.settings.startDate = DateTime.now().startOf('week').toJSDate();
    const wrapper = mount(SettingsView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('toggles all activities', async () => {
    const wrapper = mount(SettingsView);
    expect(scheduleStore.settings.availableActivities).toEqual(ACTIVITIES);
    await wrapper.findByTestId('settings-toggle-all-activities').find('input').setValue(false);
    expect(scheduleStore.settings.availableActivities).toEqual([]);
    await wrapper.findByTestId('settings-toggle-all-activities').find('input').setValue(true);
    expect(scheduleStore.settings.availableActivities).toEqual(
      expect.arrayContaining(ACTIVITIES),
    );
  });
});
