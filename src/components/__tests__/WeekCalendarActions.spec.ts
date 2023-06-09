import {mount} from '@vue/test-utils';
import {v4 as uuidv4} from 'uuid';
import {describe, it, expect, beforeEach} from 'vitest';
import WeekCalendarActions from '@/components/WeekCalendarActions.vue';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';

describe('WeekCalendarActions', () => {
  const scheduleStore = useScheduleStore();
  const appStateStore = useAppStateStore();

  beforeEach(() => {
    appStateStore.$reset();
    scheduleStore.$reset();
  });

  it('mounts', () => {
    const wrapper = mount(WeekCalendarActions, {
      props: {
        weekNumber: 1,
        dayIndex: 0,
        weekId: uuidv4(),
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('actions work', () => {
    const weekId = uuidv4();
    const wrapper = mount(WeekCalendarActions, {
      props: {
        weekNumber: 1,
        dayIndex: 0,
        weekId: weekId,
      },
    });
    wrapper.findByTestId('week-1-add-training-button').trigger('click');
    wrapper.findByTestId('week-1-copy-button').trigger('click');
    wrapper.findByTestId('week-1-delete-button').trigger('click');
    expect(appStateStore.openNewTrainingDialog).toHaveBeenCalledWith(weekId, 0);
    expect(scheduleStore.copyWeek).toHaveBeenCalledWith(weekId);
    expect(scheduleStore.deleteWeek).toHaveBeenCalledWith(weekId);
  });
});
