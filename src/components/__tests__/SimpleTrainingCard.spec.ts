import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {useScheduleStore} from '@/stores/schedule';
import {Intensity, type Training} from '@/types';
import {getEmptyTraining} from '@/utils';
import SimpleTrainingCard from '@/components/SimpleTrainingCard.vue';

const basicTraining: Training = getEmptyTraining({
  activity: 'boxing',
  description: 'Sparring at the gym',
  location: 'Total wreck gym',
});

describe('SimpleTrainingCard', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
  });

  it('mounts', () => {
    const wrapper = mount(SimpleTrainingCard, {
      props: {
        training: basicTraining,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows basic data', () => {
    const wrapper = mount(SimpleTrainingCard, {
      props: {
        training: basicTraining,
      },
    });

    expect(wrapper.find('.simple-training-card__activity-icon').attributes('aria-label')).toBe(
      'Boxing',
    );
    expect(wrapper.find('.simple-training-card__title').text()).toBe('Boxing');
    expect(wrapper.find('.simple-training-card__duration').text()).toBe('1 h');
    expect(wrapper.find('.simple-training-card__location').text()).toBe('Total wreck gym');
    expect(wrapper.find('.simple-training-card__intensity').text()).toBe('Normal');
  });

  it('shows custom data', async () => {
    scheduleStore.settings.unitOfTime = 'm';
    const wrapper = mount(SimpleTrainingCard, {
      props: {
        training: {
          ...basicTraining,
          intensity: Intensity.LIGHT,
          duration: 0,
          location: '',
          title: 'Free fight',
        },
      },
    });

    expect(wrapper.find('.simple-training-card__title').text()).toBe('Free fight');
    expect(wrapper.find('.simple-training-card__duration').text()).toBe('- m');
    expect(wrapper.find('.simple-training-card__location').text()).toBe('-');
    expect(wrapper.find('.simple-training-card__intensity').text()).toBe('Light');
  });
});
