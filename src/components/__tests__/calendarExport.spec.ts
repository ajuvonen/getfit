import {onMounted} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {v4 as uuid} from 'uuid';
import {useScheduleStore} from '@/stores/schedule';
import useCalendarExport from '@/hooks/calendarExport';
import {Intensity, type Week, type ScheduleSettings, type CalendarEvent} from '@/types';
import {getEmptySettings, getEmptyTraining} from '@/utils';

describe('useCalendarExport', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    scheduleStore = useScheduleStore();
  });

  const createTestComponent = (settings: ScheduleSettings, weeks: Week[]) => {
    scheduleStore.$patch((state) => {
      state.settings = settings;
      state.weeks = weeks;
    });
    const promise: Promise<CalendarEvent[]> = new Promise((resolve) => {
      mount({
        template: '<div></div>',
        setup() {
          const {createCalendarEvents} = useCalendarExport();
          onMounted(() => {
            resolve(createCalendarEvents());
          });
        },
      });
    });
    return promise;
  };
  it('creates correct calendar events', async () => {
    const weekId1 = uuid();
    const weekId2 = uuid();
    const mockWeeks: Week[] = [
      {
        id: weekId1,
        trainings: [
          getEmptyTraining({
            weekId: weekId1,
            activity: 'running',
            title: 'Test Training',
            instructions: 'Test Instructions',
            location: 'Test Location',
          }),
          getEmptyTraining({
            weekId: weekId1,
            activity: 'swimming',
            dayIndex: 1,
            title: 'Test Training 2',
            instructions: 'Test Instructions 2',
            duration: 0.5,
            intensity: Intensity.DEMANDING,
            location: 'Test Location 2',
          }),
          getEmptyTraining({
            weekId: weekId1,
            activity: 'sprint',
            dayIndex: 1,
            title: 'Test Training 3',
            instructions: 'Test Instructions 3',
            intensity: Intensity.HEAVY,
            location: 'Test Location 3',
          }),
        ],
      },
      {
        id: weekId2,
        trainings: [
          getEmptyTraining({
            weekId: weekId2,
            activity: 'running',
            dayIndex: 6,
            title: 'Test Training 4',
            instructions: 'Test Instructions 4',
            location: 'Test Location 4',
          }),
          getEmptyTraining({
            weekId: weekId2,
            activity: 'swimming',
            dayIndex: 6,
            title: 'Test Training 5',
            instructions: 'Test Instructions 5',
            intensity: Intensity.LIGHT,
            location: 'Test Location 5',
          }),
        ],
      },
    ];

    const mockSettings: ScheduleSettings = getEmptySettings({
      name: 'Test Schedule',
      startDate: new Date('2024-01-01'),
    });

    const events = await createTestComponent(mockSettings, mockWeeks);

    expect(events).toHaveLength(5);

    // Assertions for the first activity
    expect(events[0].title).toBe('Test Training');
    expect(events[0].description).toBe('Test Instructions');
    expect(events[0].duration.minutes).toBe(60);
    expect(events[0].location).toBe('Test Location');
    expect(events[0].categories).toEqual(['Running', 'Normal']);
    expect(events[0].status).toBe('CONFIRMED');
    expect(events[0].busyStatus).toBe('BUSY');
    expect(events[0].transp).toBe('OPAQUE');
    expect(events[0].productId).toBe('ajuvonen/getfit');
    expect(events[0].classification).toBe('PRIVATE');
    expect(events[0].calName).toBe('Test Schedule');
    expect(events[0].start).toEqual([2024, 1, 1, 12, 0]);

    // Assertions for the second activity
    expect(events[1].title).toBe('Test Training 2');
    expect(events[1].description).toBe('Test Instructions 2');
    expect(events[1].duration.minutes).toBe(30);
    expect(events[1].location).toBe('Test Location 2');
    expect(events[1].categories).toEqual(['Swimming', 'Demanding']);
    expect(events[1].status).toBe('CONFIRMED');
    expect(events[1].busyStatus).toBe('BUSY');
    expect(events[1].transp).toBe('OPAQUE');
    expect(events[1].productId).toBe('ajuvonen/getfit');
    expect(events[1].classification).toBe('PRIVATE');
    expect(events[1].calName).toBe('Test Schedule');
    expect(events[1].start).toEqual([2024, 1, 2, 12, 0]);

    // Assertions for the third activity
    expect(events[2].title).toBe('Test Training 3');
    expect(events[2].description).toBe('Test Instructions 3');
    expect(events[2].duration.minutes).toBe(60);
    expect(events[2].location).toBe('Test Location 3');
    expect(events[2].categories).toEqual(['Sprint', 'Heavy']);
    expect(events[2].status).toBe('CONFIRMED');
    expect(events[2].busyStatus).toBe('BUSY');
    expect(events[2].transp).toBe('OPAQUE');
    expect(events[2].productId).toBe('ajuvonen/getfit');
    expect(events[2].classification).toBe('PRIVATE');
    expect(events[2].calName).toBe('Test Schedule');
    expect(events[2].start).toEqual([2024, 1, 2, 12, 30]);

    // Assertions for the fourth activity
    expect(events[3].title).toBe('Test Training 4');
    expect(events[3].description).toBe('Test Instructions 4');
    expect(events[3].duration.minutes).toBe(60);
    expect(events[3].location).toBe('Test Location 4');
    expect(events[3].categories).toEqual(['Running', 'Normal']);
    expect(events[3].status).toBe('CONFIRMED');
    expect(events[3].busyStatus).toBe('BUSY');
    expect(events[3].transp).toBe('OPAQUE');
    expect(events[3].productId).toBe('ajuvonen/getfit');
    expect(events[3].classification).toBe('PRIVATE');
    expect(events[3].calName).toBe('Test Schedule');
    expect(events[3].start).toEqual([2024, 1, 14, 12, 0]);

    // Assertions for the fifth activity
    expect(events[4].title).toBe('Test Training 5');
    expect(events[4].description).toBe('Test Instructions 5');
    expect(events[4].duration.minutes).toBe(60);
    expect(events[4].location).toBe('Test Location 5');
    expect(events[4].categories).toEqual(['Swimming', 'Light']);
    expect(events[4].status).toBe('CONFIRMED');
    expect(events[4].busyStatus).toBe('BUSY');
    expect(events[4].transp).toBe('OPAQUE');
    expect(events[4].productId).toBe('ajuvonen/getfit');
    expect(events[4].classification).toBe('PRIVATE');
    expect(events[4].calName).toBe('Test Schedule');
    expect(events[4].start).toEqual([2024, 1, 14, 13, 0]);
  });

  it('moves to next date when durations cross over', async () => {
    const weekId1 = uuid();
    const mockWeeks: Week[] = [
      {
        id: weekId1,
        trainings: [
          getEmptyTraining({
            weekId: weekId1,
            activity: 'running',
            title: 'Test Training',
            instructions: 'Test Instructions',
            location: 'Test Location',
          }),
          getEmptyTraining({
            weekId: weekId1,
            activity: 'swimming',
            intensity: Intensity.DEMANDING,
            title: 'Test Training 2',
            instructions: 'Test Instructions 2',
            duration: 0.5,
            location: 'Test Location 2',
          }),
        ],
      },
    ];

    const mockSettings: ScheduleSettings = getEmptySettings({
      name: 'Test Schedule',
      startDate: new Date('2024-01-01'),
      defaultStartTime: {hours: 23, minutes: 30, seconds: 0},
    });

    const events = await createTestComponent(mockSettings, mockWeeks);

    expect(events).toHaveLength(2);

    // Assertions for the first activity
    expect(events[0].title).toBe('Test Training');
    expect(events[0].description).toBe('Test Instructions');
    expect(events[0].duration.minutes).toBe(60);
    expect(events[0].location).toBe('Test Location');
    expect(events[0].categories).toEqual(['Running', 'Normal']);
    expect(events[0].status).toBe('CONFIRMED');
    expect(events[0].busyStatus).toBe('BUSY');
    expect(events[0].transp).toBe('OPAQUE');
    expect(events[0].productId).toBe('ajuvonen/getfit');
    expect(events[0].classification).toBe('PRIVATE');
    expect(events[0].calName).toBe('Test Schedule');
    expect(events[0].start).toEqual([2024, 1, 1, 23, 30]);

    // Assertions for the second activity
    expect(events[1].title).toBe('Test Training 2');
    expect(events[1].description).toBe('Test Instructions 2');
    expect(events[1].duration.minutes).toBe(30);
    expect(events[1].location).toBe('Test Location 2');
    expect(events[1].categories).toEqual(['Swimming', 'Demanding']);
    expect(events[1].status).toBe('CONFIRMED');
    expect(events[1].busyStatus).toBe('BUSY');
    expect(events[1].transp).toBe('OPAQUE');
    expect(events[1].productId).toBe('ajuvonen/getfit');
    expect(events[1].classification).toBe('PRIVATE');
    expect(events[1].calName).toBe('Test Schedule');
    expect(events[1].start).toEqual([2024, 1, 2, 0, 30]);
  });

  it('gives calendar a default name', async () => {
    const weekId = uuid();
    const mockWeeks: Week[] = [
      {
        id: weekId,
        trainings: [
          getEmptyTraining({
            weekId,
            activity: 'running',
          }),
        ],
      },
    ];

    const mockSettings: ScheduleSettings = getEmptySettings({
      name: '',
      startDate: new Date('2024-01-01'),
    });

    const events = await createTestComponent(mockSettings, mockWeeks);

    expect(events).toHaveLength(1);
    expect(events[0].calName).toBe('TrainingSchedule');
  });

  it('gives calendar event a default duration', async () => {
    const weekId = uuid();
    const mockWeeks: Week[] = [
      {
        id: weekId,
        trainings: [
          getEmptyTraining({
            weekId,
            activity: 'running',
            duration: 12,
            unitOfDuration: 'km',
          }),
        ],
      },
    ];

    const mockSettings: ScheduleSettings = getEmptySettings({
      name: '',
      startDate: new Date('2024-01-01'),
    });

    const events = await createTestComponent(mockSettings, mockWeeks);

    expect(events).toHaveLength(1);
    expect(events[0].duration.minutes).toBe(60);
  });
});
