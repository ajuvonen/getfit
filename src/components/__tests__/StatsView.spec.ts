import {describe, it, expect, vi, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import StatsView from '@/views/StatsView.vue';
import {useScheduleStore} from '@/stores/schedule';
import {getTestWeeks} from '@/utils';

describe('StatsView', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    scheduleStore = useScheduleStore();
    scheduleStore.weeks.push(...getTestWeeks());
  });

  it('mounts', () => {
    vi.mock('vue-chartjs', () => ({
      Pie: {
        template: '<div></div>',
      },
      Bar: {
        template: '<div></div>',
      },
      Line: {
        template: '<div></div>',
      },
    }));

    const wrapper = mount(StatsView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
