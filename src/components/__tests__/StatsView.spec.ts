import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAppStateStore} from '@/stores/appState';
import StatsView from '@/views/StatsView.vue';

describe('StatsView', () => {
  beforeEach(() => {
    const appStateStore = useAppStateStore();
    appStateStore.disableCharts = true;
  });

  it('mounts', () => {
    const wrapper = mount(StatsView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
