import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {VCard} from 'vuetify/components';
import InfoDialog from '@/components/InfoDialog.vue';

describe('InfoDialog', () => {
  it('mounts', () => {
    const wrapper = mount(InfoDialog, {
      props: {
        show: true,
        title: 'Info',
      },
      slots: {
        content: 'My content',
      },
    });
    expect(wrapper.findComponent(VCard).html()).toMatchSnapshot();
  });

  it('close works', async () => {
    const wrapper = mount(InfoDialog, {
      props: {
        show: true,
        title: 'Info',
      },
      slots: {
        content: 'My content',
      },
    });
    await wrapper.findComponent(VCard).findByTestId('info-dialog-close-button').trigger('click');
    expect(wrapper.emitted().close?.length).toEqual(1);
  });
});
