import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

describe('ChartScreenReaderTable', () => {
  it('mounts', () => {
    const wrapper = mount(ChartScreenReaderTable, {
      props: {
        title: 'Amount of trainings',
        id: 'my-chart',
        columnHeaders: ['Running', 'Sprint', 'Swimming'],
        data: [[1, 2, 3]],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('table').classes()).toContain('d-sr-only');
  });

  it('mounts with row headers', () => {
    const wrapper = mount(ChartScreenReaderTable, {
      props: {
        title: 'Amount of trainings',
        id: 'my-chart',
        columnHeaders: ['Running', 'Sprint', 'Swimming'],
        rowHeaders: ['Week 1', 'Week 2', 'Week 3'],
        data: [[1, 2, 3], [1, 1, 2], [3, 3, 0]],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
