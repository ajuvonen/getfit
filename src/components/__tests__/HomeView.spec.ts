import {it, expect, describe, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {v4 as uuid} from 'uuid';
import {useScheduleStore} from '@/stores/schedule';
import {getEmptyTraining} from '@/utils';
import HomeView from '@/views/HomeView.vue';

describe('HomeView', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
  });

  it('mounts', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('mounts with agenda', () => {
    const weekId = uuid();
    scheduleStore.weeks.push({
      id: weekId,
      trainings: [
        getEmptyTraining({
          weekId,
          activity: 'running',
          dayIndex: DateTime.now().weekday - 1,
        }),
      ],
    });
    scheduleStore.settings.startDate = DateTime.now().startOf('week').toJSDate();
    const wrapper = mount(HomeView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
