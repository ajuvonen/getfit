import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import {getEmptyTraining} from '@/utils';
import WeekSupplement from '@/components/WeekSupplement.vue';

describe('WeekSupplement', () => {
  it('mounts', () => {
    const wrapper = mount(WeekSupplement, {
      props: {
        trainings: [
          getEmptyTraining({activity: 'running'}),
          getEmptyTraining({activity: 'swimming', description: 'swim slow'}),
        ],
        dayIndex: 0,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('remains empty', () => {
    const wrapper = mount(WeekSupplement, {
      props: {
        trainings: [],
        dayIndex: 0,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
