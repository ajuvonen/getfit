import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {VCard} from 'vuetify/components';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {Intensity} from '@/types';
import {getEmptyTraining} from '@/utils';
import EditTrainingDialog from '@/components/EditTrainingDialog.vue';

describe('EditTrainingDialog', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
    appStateStore = useAppStateStore();
    scheduleStore.addWeek();
    appStateStore.trainingDialogOpen = true;
  });

  it('mounts', () => {
    const wrapper = mount(EditTrainingDialog);
    expect(wrapper.findComponent(VCard).html()).toMatchSnapshot();
  });

  it('displays correct data', () => {
    appStateStore.trainingData = getEmptyTraining({
      activity: 'boxing',
      description: 'Light training at the gym',
      title: 'Sparring',
      location: 'Unisport Gym',
    });

    const wrapper = mount(EditTrainingDialog);
    const card = wrapper.getComponent(VCard);
    expect(card.findByTestId('edit-training-activity').text()).toBe('Boxing');
    expect(
      card.findByTestId('edit-training-duration').find<HTMLInputElement>('input').element.value,
    ).toBe('1');
    expect(
      card.findByTestId('edit-training-description').find<HTMLTextAreaElement>('textarea').element
        .value,
    ).toBe('Light training at the gym');
    expect(
      card.findByTestId('edit-training-title').find<HTMLInputElement>('input').element.value,
    ).toBe('Sparring');
    expect(
      card.findByTestId('edit-training-intensity').find<HTMLInputElement>('input').element.value,
    ).toBe(Intensity.NORMAL.toString());
    expect(
      card.findByTestId('edit-training-location').find<HTMLInputElement>('input').element.value,
    ).toBe('Unisport Gym');
  });
});
