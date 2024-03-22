import {describe, it, expect, beforeEach} from 'vitest';
import {VList} from 'vuetify/components';
import {mount} from '@vue/test-utils';
import {v4 as uuid} from 'uuid';
import {getEmptyTraining} from '@/utils';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import TrainingCardActions from '@/components/TrainingCardActions.vue';

describe('TrainingCardActions', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
    appStateStore = useAppStateStore();
  });

  it('mounts', () => {
    const wrapper = mount(TrainingCardActions, {
      props: {
        training: getEmptyTraining(),
        disabled: false,
        simple: false,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('actions work', async () => {
    const wrapper = mount(TrainingCardActions, {
      props: {
        training: getEmptyTraining(),
        disabled: false,
        simple: false,
      },
    });
    await wrapper.find('.training-card__action-button').trigger('click');
    const actions = wrapper.findComponent(VList);
    await actions.find('.training-card__delete-button').trigger('click');
    await actions.find('.training-card__edit-button').trigger('click');
    await actions.find('.training-card__complete-button').trigger('click');
    expect(scheduleStore.deleteTraining).toHaveBeenCalledOnce();
    expect(appStateStore.openEditTrainingDialog).toHaveBeenCalledOnce();
    expect(scheduleStore.toggleCompletion).toHaveBeenCalledOnce();
  });
  
  it('displays instructions', async () =>{ 
    const trainingId = uuid();
    const wrapper = mount(TrainingCardActions, {
      props: {
        training: getEmptyTraining({id: trainingId, instructions: 'Test Instructions'}),
        disabled: false,
        simple: false,
      },
    });
    expect(wrapper.find('.training-card__instructions').exists()).toBe(false);
    await wrapper.find('.training-card__more-button').trigger('click');
    expect(appStateStore.toggleShowInstructions).toHaveBeenCalledWith(trainingId);
  });

  it('disabled prop works', () => {
    const wrapper = mount(TrainingCardActions, {
      props: {
        training: getEmptyTraining({instructions: 'Test Instructions'}),
        disabled: true,
        simple: false,
      },
    });
    expect(wrapper.findAll('button:not([disabled])').length).toBe(0);
    expect(wrapper.findAll('button[disabled]').length).toBe(2);
  });

  it('disabled and simple props work', () => {
    const wrapper = mount(TrainingCardActions, {
      props: {
        training: getEmptyTraining({instructions: 'Test Instructions'}),
        disabled: true,
        simple: true,
      },
    });
    expect(wrapper.findAll('button:not([disabled])').length).toBe(0);
    expect(wrapper.findAll('button[disabled]').length).toBe(2);
  });

  it('simple card can be completed', async () => {
    const wrapper = mount(TrainingCardActions, {
      props: {
        training: getEmptyTraining(),
        disabled: false,
        simple: true,
      },
    });

    await wrapper.find('.training-card__complete-button').trigger('click');
    expect(scheduleStore.toggleCompletion).toHaveBeenCalledOnce();
  });
});
