import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import SettingsView from '@/views/SettingsView.vue';

describe('SettingsView', () => {
  it('mounts', () => {
    const wrapper = mount(SettingsView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
