import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {v4 as uuid} from 'uuid';  
import {getEmptyTraining} from '@/utils';
import { useAppStateStore } from '@/stores/appState';
import TrainingCardInstructions from '@/components/TrainingCardInstructions.vue';

describe('TrainingCardInstructions', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('mounts', () => {
    const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    const wrapper = mount(TrainingCardInstructions, {
      props: {
        training: getEmptyTraining({description}),
        show: true,
      },
    });
    expect(wrapper.find('.training-card__instructions').exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('remains hidden when show is false', () => {
    const wrapper = mount(TrainingCardInstructions, {
      props: {
        training: getEmptyTraining(),
        show: false,
      },
    });
    expect(wrapper.find('.training-card__instructions').exists()).toBe(false);
  });

  it('closes when clicked', async () => {
    const trainingId = uuid();
    const wrapper = mount(TrainingCardInstructions, {
      props: {
        training: getEmptyTraining({id: trainingId}),
        show: true,
      },
    });
    expect(wrapper.find('.training-card__instructions').exists()).toBe(true);
    await wrapper.find('.training-card__instructions__close-button').trigger('click');
    expect(appStateStore.toggleShowDescription).toHaveBeenCalledWith(trainingId);
  })
});
