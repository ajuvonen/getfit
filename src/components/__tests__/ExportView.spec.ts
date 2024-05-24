import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {DateTime} from 'luxon';
import ExportView from '@/views/ExportView.vue';
import {useScheduleStore} from '@/stores/schedule';
import {getTestWeeks} from '@/utils';

describe('ExportView', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
    scheduleStore.weeks.push(...getTestWeeks());
  });

  it('mounts', () => {
    const wrapper = mount(ExportView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('mounts with start date', () => {
    scheduleStore.settings.startDate = DateTime.fromJSDate(new Date('2024-05-20')).startOf('week').toJSDate();
    const wrapper = mount(ExportView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
