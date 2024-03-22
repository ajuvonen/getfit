import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import {v4 as uuid} from 'uuid';
import {DateTime} from 'luxon';
import DailyAgenda from '@/components/DailyAgenda.vue';
import {useScheduleStore} from '@/stores/schedule';
import {getEmptyTraining} from '@/utils';

describe('DailyAgenda', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
  });

  it('displays training data', () => {
    const weekId = uuid();
    const todayIndex = DateTime.now().weekday - 1;
    scheduleStore.settings.startDate = DateTime.now().startOf('week').toJSDate();
    scheduleStore.weeks.push({
      id: weekId,
      trainings: [
        getEmptyTraining({
          activity: 'boxing',
          dayIndex: todayIndex,
          weekId,
        }),
        getEmptyTraining({
          activity: 'swimming',
          dayIndex: todayIndex,
          weekId,
        }),
        getEmptyTraining({
          dayIndex: (todayIndex + 1) % 7,
          weekId,
        }),
        getEmptyTraining({
          dayIndex: (todayIndex + 2) % 7,
          weekId,
        }),
      ],
    });
    const wrapper = mount(DailyAgenda);

    expect(wrapper.findAll('.training-card__title').length).toBe(2);
    expect(wrapper.findAll('.training-card__title')[0].text()).toBe('Boxing');
    expect(wrapper.findAll('.training-card__title')[1].text()).toBe('Swimming');
  });
});
