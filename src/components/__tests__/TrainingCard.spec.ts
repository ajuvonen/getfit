import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {v4 as uuidv4} from 'uuid';
import {VList} from 'vuetify/components';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {Intensity, type Training} from '@/types';
import TrainingCard from '@/components/TrainingCard.vue';
import { getEmptyTraining } from '@/utils';

const basicTraining: Training = getEmptyTraining({
  activity: 'boxing',
  description: 'Sparring at the gym',
  location: 'Total wreck gym',
});

describe('TrainingCard', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
    appStateStore = useAppStateStore();
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
    expect(wrapper.find('.training-card__intensity').text()).toBe('Normal');
  });

  it('shows custom data', async () => {
    scheduleStore.settings.unitOfTime = 'm';
    const wrapper = mount(TrainingCard, {
      props: {
        training: {
          ...basicTraining,
          intensity: Intensity.HEAVY,
          duration: 0,
          location: '',
          title: 'Free fight',
        },
      },
    });

    expect(wrapper.find('.training-card__intensity').text()).toBe('Heavy');
    expect(wrapper.find('.training-card__title').text()).toBe('Free fight');
    expect(wrapper.find('.training-card__duration').text()).toBe('- m');
    expect(wrapper.find('.training-card__location').text()).toBe('-');
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
