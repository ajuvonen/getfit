import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import ScheduleView from '@/views/ScheduleView.vue';

describe('ScheduleView', () => {
  it('mounts', () => {
    const wrapper = mount(ScheduleView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
