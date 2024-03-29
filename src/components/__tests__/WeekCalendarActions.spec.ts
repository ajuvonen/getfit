import {mount} from '@vue/test-utils';
import {v4 as uuidv4} from 'uuid';
import {describe, it, expect, beforeEach} from 'vitest';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import WeekCalendarActions from '@/components/WeekCalendarActions.vue';

describe('WeekCalendarActions', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
    appStateStore = useAppStateStore();
  });

  it('mounts', () => {
    const wrapper = mount(WeekCalendarActions, {
      props: {
        weekIndex: 0,
        dayIndex: 0,
        weekId: uuidv4(),
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('actions work', async () => {
    const weekId = uuidv4();
    const wrapper = mount(WeekCalendarActions, {
      props: {
        weekIndex: 0,
        dayIndex: 0,
        weekId: weekId,
      },
    });
    await wrapper.findByTestId('week-0-add-training-button').trigger('click');
    await wrapper.findByTestId('week-0-copy-button').trigger('click');
    await wrapper.findByTestId('week-0-delete-button').trigger('click');
    expect(appStateStore.openNewTrainingDialog).toHaveBeenCalledWith(
      weekId,
      0,
      expect.objectContaining([
        {
          icon: 'mdi-badminton',
          title: 'Badminton',
          value: 'badminton',
        },
      ]),
    );
    expect(scheduleStore.copyWeek).toHaveBeenCalledWith(weekId);
    expect(scheduleStore.deleteWeek).toHaveBeenCalledWith(weekId);
  });
});
