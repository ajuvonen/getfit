import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {useScheduleStore} from '@/stores/schedule';
import TrainingRating from '@/components/TrainingRating.vue';
import {getEmptyTraining} from '@/utils';

describe('TrainingCard', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
  });

  it('mounts', () => {
    const wrapper = mount(TrainingRating, {
      props: {
        training: getEmptyTraining(),
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('calls store on rating change', async () => {
    const training = getEmptyTraining();
    const wrapper = mount(TrainingRating, {
      props: {
        training: training,
      },
    });

    await wrapper.find('button:nth-child(1)').trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 1);
    await wrapper.find('button:nth-child(2)').trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 2);
    await wrapper.find('button:nth-child(3)').trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 3);
    await wrapper.find('button:nth-child(4)').trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 4);
    await wrapper.find('button:nth-child(5)').trigger('click');
    expect(scheduleStore.updateRating).toHaveBeenLastCalledWith(training, 5);
  });
});
