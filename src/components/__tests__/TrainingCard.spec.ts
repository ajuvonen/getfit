import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import {Intensity, type Training} from '@/types';
import TrainingCard from '@/components/TrainingCard.vue';
import {getEmptyTraining} from '@/utils';

const basicTraining: Training = getEmptyTraining({
  activity: 'boxing',
  instructions: 'Sparring at the gym',
  location: 'Total wreck gym',
});

describe('TrainingCard', () => {
  it('mounts', () => {
    const wrapper = mount(TrainingCard, {
      props: {
        training: basicTraining,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('mounts in simple mode', () => {
    const wrapper = mount(TrainingCard, {
      props: {
        training: basicTraining,
        simple: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows basic data', () => {
    const wrapper = mount(TrainingCard, {
      props: {
        training: basicTraining,
      },
    });

    expect(wrapper.find('.training-card__activity-icon').attributes('aria-label')).toBe('Boxing');
    expect(wrapper.find('.training-card__title').text()).toBe('Boxing');
    expect(wrapper.find('.training-card__duration').text()).toBe('1 h');
    expect(wrapper.find('.training-card__location').text()).toBe('Total wreck gym');
    expect(wrapper.find('.training-card__intensity').text()).toBe('Normal');
  });

  it('shows custom data', async () => {
    const wrapper = mount(TrainingCard, {
      props: {
        training: {
          ...basicTraining,
          intensity: Intensity.HEAVY,
          duration: 0,
          location: '',
          unitOfDuration: 'm',
          title: 'Free fight',
        },
      },
    });

    expect(wrapper.find('.training-card__intensity').text()).toBe('Heavy');
    expect(wrapper.find('.training-card__title').text()).toBe('Free fight');
    expect(wrapper.find('.training-card__duration').text()).toBe('- m');
    expect(wrapper.find('.training-card__location').text()).toBe('-');
  });
});
