import {nextTick} from 'vue';
import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {v4 as uuidv4} from 'uuid';
import {VList} from 'vuetify/components';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {Intensity, type Training} from '@/types';
import TrainingCard from '@/components/TrainingCard.vue';

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

describe('TrainingCard', () => {
  const scheduleStore = useScheduleStore();
  const appStateStore = useAppStateStore();

  beforeEach(() => {
    appStateStore.$reset();
    scheduleStore.$reset();
  });

  it('mounts', () => {
    const wrapper = mount(TrainingCard, {
      props: {
        training: basicTraining,
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
    expect(wrapper.find('.training-card__intensity').text()).toBe('Medium');
  });

  it('shows custom data', async () => {
    scheduleStore.settings.unitOfTime = 'm';
    const wrapper = mount(TrainingCard, {
      props: {
        training: {
          ...basicTraining,
          duration: 60,
          location: '',
          title: 'Free fight',
        },
      },
    });

    expect(wrapper.find('.training-card__title').text()).toBe('Free fight');
    expect(wrapper.find('.training-card__duration').text()).toBe('60 m');
    expect(wrapper.find('.training-card__location').exists()).toBe(false);

    await wrapper.setProps({
      training: {
        ...basicTraining,
        duration: 0,
      },
    });

    expect(wrapper.find('.training-card__duration').exists()).toBe(false);
  });

  it('hides actions when schedule is locked', async () => {
    const wrapper = mount(TrainingCard, {
      props: {
        training: basicTraining,
      },
    });
    expect(wrapper.find('.training-card__action-button').exists()).toBe(true);
    expect(wrapper.find('.training-card__show-summary-button').exists()).toBe(false);

    scheduleStore.settings.lockSchedule = true;
    await nextTick();

    expect(wrapper.find('.training-card__action-button').exists()).toBe(false);
    expect(wrapper.find('.training-card__show-summary-button').exists()).toBe(true);
  });

  it('actions work', async () => {
    const wrapper = mount(TrainingCard, {
      props: {
        training: basicTraining,
      },
    });
    await wrapper.find('.training-card__action-button').trigger('click');
    const actions = wrapper.findComponent(VList);
    await actions.find('.training-card__delete-button').trigger('click');
    await actions.find('.training-card__edit-button').trigger('click');
    expect(scheduleStore.deleteTraining).toHaveBeenCalledOnce();
    expect(appStateStore.openEditTrainingDialog).toHaveBeenCalledOnce();
  });
});
