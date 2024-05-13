import {describe, it, expect, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import StatsView from '@/views/StatsView.vue';

describe('StatsView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
