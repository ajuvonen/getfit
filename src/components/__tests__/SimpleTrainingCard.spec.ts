import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {v4 as uuidv4} from 'uuid';
import SimpleTrainingCard from '@/components/SimpleTrainingCard.vue';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {Intensity, type Training} from '@/types';

const basicTraining = {
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
} as Training;

describe('SimpleTrainingCard', () => {
  const scheduleStore = useScheduleStore();
  const appStateStore = useAppStateStore();

  beforeEach(() => {
    appStateStore.$reset();
    scheduleStore.$reset();
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

    expect(wrapper.find('.simple-training-card__activity-icon').attributes('aria-label')).toBe('Boxing');
    expect(wrapper.find('.simple-training-card__title').text()).toBe('Boxing');
    expect(wrapper.find('.simple-training-card__duration').text()).toBe('1 h');
    expect(wrapper.find('.simple-training-card__location').text()).toBe('Total wreck gym');
    expect(wrapper.find('.simple-training-card__intensity').text()).toBe('Medium');
  });

  it('shows custom data', async () => {
    scheduleStore.schedule.unitOfTime = 'm';
    const wrapper = mount(SimpleTrainingCard, {
      props: {
        training: {
          ...basicTraining,
          duration: 60,
          location: '',
          title: 'Free fight',
        },
      },
    });

    expect(wrapper.find('.simple-training-card__title').text()).toBe('Free fight');
    expect(wrapper.find('.simple-training-card__duration').text()).toBe('60 m');
    expect(wrapper.find('.simple-training-card__location').exists()).toBe(false);
    expect(wrapper.find('.simple-training-card__intensity').text()).toBe('Medium');

    await wrapper.setProps({
      training: {
        ...basicTraining,
        duration: 0,
      },
    });

    expect(wrapper.find('.simple-training-card__duration').exists()).toBe(false);
  });
});
