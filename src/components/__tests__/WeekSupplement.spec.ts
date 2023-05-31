import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import {v4 as uuidv4} from 'uuid';
import {Intensity, type Training} from '@/types';
import WeekSupplement from '@/components/WeekSupplement.vue';

const trainings = [
  {
    id: uuidv4(),
    weekId: uuidv4(),
    dayIndex: 0,
    activity: 'boxing',
    title: '',
    description: 'Sparring at the gym',
    duration: 1,
    intensity: Intensity.MEDIUM,
    completionSummary: '',
    location: 'Total wreck gym',
  },
] as Training[];

describe('WeekSupplement', () => {
  it('mounts', () => {
    const wrapper = mount(WeekSupplement, {
      props: {
        trainings,
        dayIndex: 0,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
