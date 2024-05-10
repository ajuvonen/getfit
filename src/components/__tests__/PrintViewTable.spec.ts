import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import PrintViewTable from '@/components/PrintViewTable.vue';

describe('PrintViewTable', () => {
  it('mounts', () => {
    const wrapper = mount(PrintViewTable, {
      props: {
        tableTitle: 'My table',
      },
      slots: {
        header: '<tr><th>My header</th></tr>',
        body: '<tr><td>Body content</td></tr>',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('slot overrides table title', () => {
    const wrapper = mount(PrintViewTable, {
      props: {
        tableTitle: 'My table',
      },
      slots: {
        title: '<h2>My title</h2>',
        header: '<tr><th>My header</th></tr>',
        body: '<tr><td>Body content</td></tr>',
      },
    });
    expect(wrapper.find('h2').text()).toBe('My title');
  });
});
