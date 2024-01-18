import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {VCard} from 'vuetify/components';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {Intensity} from '@/types';
import EditTrainingDialog from '@/components/EditTrainingDialog.vue';

describe('EditTrainingDialog', () => {
  const scheduleStore = useScheduleStore();
  const appStateStore = useAppStateStore();

  beforeEach(() => {
    appStateStore.$reset();
    scheduleStore.$reset();
    scheduleStore.addWeek();
    appStateStore.trainingDialogOpen = true;
  });

  it('mounts', () => {
    const wrapper = mount(EditTrainingDialog);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('displays correct data', () => {
    appStateStore.trainingData = {
      id: 'test-id',
      weekId: 'test-week-id',
      dayIndex: 0,
      duration: 1,
      activity: 'boxing',
      description: 'Light training at the gym',
      title: 'Sparring',
      intensity: Intensity.NORMAL,
      location: 'Unisport Gym',
    };

    const wrapper = mount(EditTrainingDialog);
    const card = wrapper.getComponent(VCard);
    expect(card.findByTestId('edit-training-activity').text()).toBe('Boxing');
    expect(card.findByTestId('edit-training-duration').find<HTMLInputElement>('input').element.value).toBe('1');
    expect(card.findByTestId('edit-training-description').find<HTMLTextAreaElement>('textarea').element.value).toBe('Light training at the gym');
    expect(card.findByTestId('edit-training-title').find<HTMLInputElement>('input').element.value).toBe('Sparring');
    expect(card.findByTestId('edit-training-intensity').find<HTMLInputElement>('input').element.value).toBe(Intensity.NORMAL.toString());
    expect(card.findByTestId('edit-training-location').find<HTMLInputElement>('input').element.value).toBe('Unisport Gym');
  });
});
