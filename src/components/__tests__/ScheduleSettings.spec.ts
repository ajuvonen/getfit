// import {nextTick} from 'vue';
import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import ScheduleSettings from '@/components/ScheduleSettings.vue';

describe('ScheduleSettings', () => {
  it('mounts', () => {
    const wrapper = mount(ScheduleSettings);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
