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
        name: 'Pie',
        template: '<div></div>',
      },
      Bar: {
        name: 'Bar',
        template: '<div></div>',
      },
      Line: {
        name: 'Line',
        template: '<div></div>',
      },
    }));

    const wrapper = mount(StatsView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
