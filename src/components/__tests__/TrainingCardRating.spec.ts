import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {useScheduleStore} from '@/stores/schedule';
import TrainingCardRating from '@/components/TrainingCardRating.vue';
import {getEmptyTraining} from '@/utils';

describe('TrainingCard', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
  });

  it('mounts', () => {
    const wrapper = mount(TrainingCardRating, {
      props: {
        training: getEmptyTraining(),
        disabled: false,
      },
    });
    expect(wrapper.find('.training-card__rating--hidden').exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows ratings when training is complete', () => {
    const wrapper = mount(TrainingCardRating, {
      props: {
        training: getEmptyTraining({completed: true}),
        disabled: false,
      },
    });
    expect(wrapper.find('.training-card__rating--hidden').exists()).toBe(false);
  });

  it('calls store on rating change', async () => {
    const training = getEmptyTraining({completed: true});
    const wrapper = mount(TrainingCardRating, {
      props: {
        training: training,
        disabled: false,
      },
    });

    await wrapper
      .find('.training-card__rating .v-selection-control:nth-child(1) input')
      .trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 1);
    await wrapper
      .find('.training-card__rating .v-selection-control:nth-child(2) input')
      .trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 2);
    await wrapper
      .find('.training-card__rating .v-selection-control:nth-child(3) input')
      .trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 3);
    await wrapper
      .find('.training-card__rating .v-selection-control:nth-child(4) input')
      .trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 4);
    await wrapper
      .find('.training-card__rating .v-selection-control:nth-child(5) input')
      .trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 5);
  });

  it('is disabled', () => {
    const wrapper = mount(TrainingCardRating, {
      props: {
        training: getEmptyTraining(),
        disabled: true,
      },
    });
    expect(wrapper.findAll('input[disabled]')).toHaveLength(5);
    expect(wrapper.findAll('input:not([disabled])')).toHaveLength(0);
  });
});
