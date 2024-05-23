import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import ScheduleView from '@/views/ScheduleView.vue';
import {useScheduleStore} from '@/stores/schedule';
import {getTestWeeks} from '@/utils';

describe('ScheduleView', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
    scheduleStore.weeks.push(...getTestWeeks());
  });

  it('mounts', () => {
    const wrapper = mount(ScheduleView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
