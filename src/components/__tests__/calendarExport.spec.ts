import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {v4 as uuidv4} from 'uuid';
import useCalendarExport from '@/hooks/calendarExport';
import {Intensity, type Week, type ScheduleSettings, type CalendarEvent} from '@/types';
import {onMounted} from 'vue';

const createTestComponent = (settings: ScheduleSettings, weeks: Week[]) => {
  const promise: Promise<CalendarEvent[]> = new Promise((resolve) => {
    mount({
      template: '<div></div>',
      setup() {
        const {createCalendarEvents} = useCalendarExport();
        onMounted(() => {
          resolve(createCalendarEvents(weeks, settings));
        });
      },
    });
  });
  return promise;
};

describe('useCalendarExport', () => {
  it('createCalendarEvents creates correct calendar events', async () => {
    const weekId1 = uuidv4();
    const weekId2 = uuidv4();
    const mockWeeks: Week[] = [
      {
        id: weekId1,
        trainings: [
          {
            id: uuidv4(),
            weekId: weekId1,
            activity: 'running',
            dayIndex: 0,
            title: 'Test Training',
            description: 'Test Description',
            duration: 60,
            intensity: Intensity.NORMAL,
            location: 'Test Location',
            completionSummary: '',
          },
          {
            id: uuidv4(),
            weekId: weekId1,
            activity: 'swimming',
            dayIndex: 1,
            title: 'Test Training 2',
            description: 'Test Description 2',
            duration: 30,
            intensity: Intensity.MEDIUM,
            location: 'Test Location 2',
            completionSummary: '',
          },
          {
            id: uuidv4(),
            weekId: weekId1,
            activity: 'sprint',
            dayIndex: 1,
            title: 'Test Training 3',
            description: 'Test Description 3',
            duration: 60,
            intensity: Intensity.HEAVY,
            location: 'Test Location 3',
            completionSummary: '',
          },
        ],
      },
      {
        id: weekId2,
        trainings: [
          {
            id: uuidv4(),
            weekId: weekId2,
            activity: 'running',
            dayIndex: 6,
            title: 'Test Training 4',
            description: 'Test Description 4',
            duration: 60,
            intensity: Intensity.NORMAL,
            location: 'Test Location 4',
            completionSummary: '',
          },
          {
            id: uuidv4(),
            weekId: weekId2,
            activity: 'swimming',
            dayIndex: 6,
            title: 'Test Training 5',
            description: 'Test Description 5',
            duration: 60,
            intensity: Intensity.LIGHT,
            location: 'Test Location 5',
            completionSummary: '',
          },
        ],
      },
    ];

    const mockSettings: ScheduleSettings = {
      name: 'Test Schedule',
      startDate: new Date('2024-01-01'),
      actualWeekNumbering: false,
      availableActivities: ['running', 'swimming', 'sprint'],
      defaultStartTime: {hours: 9, minutes: 0, seconds: 0},
      defaultDuration: 60,
      unitOfTime: 'm',
      lockSchedule: false,
      startsOnSunday: false,
    };

    const events = await createTestComponent(mockSettings, mockWeeks);

    expect(events).toHaveLength(5);

    // Assertions for the first activity
    expect(events[0].title).toBe('Test Training');
    expect(events[0].description).toBe('Test Description');
    expect(events[0].duration.minutes).toBe(60);
    expect(events[0].location).toBe('Test Location');
    expect(events[0].categories).toEqual(['Running', 'Normal']);
    expect(events[0].status).toBe('CONFIRMED');
    expect(events[0].busyStatus).toBe('BUSY');
    expect(events[0].productId).toBe('ajuvonen/getfit');
    expect(events[0].start).toEqual([2024, 1, 1, 9, 0]);

    // Assertions for the second activity
    expect(events[1].title).toBe('Test Training 2');
    expect(events[1].description).toBe('Test Description 2');
    expect(events[1].duration.minutes).toBe(30);
    expect(events[1].location).toBe('Test Location 2');
    expect(events[1].categories).toEqual(['Swimming', 'Medium']);
    expect(events[1].status).toBe('CONFIRMED');
    expect(events[1].busyStatus).toBe('BUSY');
    expect(events[1].productId).toBe('ajuvonen/getfit');
    expect(events[1].start).toEqual([2024, 1, 2, 9, 0]);

    // Assertions for the third activity
    expect(events[2].title).toBe('Test Training 3');
    expect(events[2].description).toBe('Test Description 3');
    expect(events[2].duration.minutes).toBe(60);
    expect(events[2].location).toBe('Test Location 3');
    expect(events[2].categories).toEqual(['Sprint', 'Heavy']);
    expect(events[2].status).toBe('CONFIRMED');
    expect(events[2].busyStatus).toBe('BUSY');
    expect(events[2].productId).toBe('ajuvonen/getfit');
    expect(events[2].start).toEqual([2024, 1, 2, 9, 30]);

    // Assertions for the fourth activity
    expect(events[3].title).toBe('Test Training 4');
    expect(events[3].description).toBe('Test Description 4');
    expect(events[3].duration.minutes).toBe(60);
    expect(events[3].location).toBe('Test Location 4');
    expect(events[3].categories).toEqual(['Running', 'Normal']);
    expect(events[3].status).toBe('CONFIRMED');
    expect(events[3].busyStatus).toBe('BUSY');
    expect(events[3].productId).toBe('ajuvonen/getfit');
    expect(events[3].start).toEqual([2024, 1, 14, 9, 0]);

    // Assertions for the fifth activity
    expect(events[4].title).toBe('Test Training 5');
    expect(events[4].description).toBe('Test Description 5');
    expect(events[4].duration.minutes).toBe(60);
    expect(events[4].location).toBe('Test Location 5');
    expect(events[4].categories).toEqual(['Swimming', 'Light']);
    expect(events[4].status).toBe('CONFIRMED');
    expect(events[4].busyStatus).toBe('BUSY');
    expect(events[4].productId).toBe('ajuvonen/getfit');
    expect(events[4].start).toEqual([2024, 1, 14, 10, 0]);
  });

  it('createCalendarEvents moves to next date when durations cross over', async () => {
    const weekId1 = uuidv4();
    const mockWeeks: Week[] = [
      {
        id: weekId1,
        trainings: [
          {
            id: uuidv4(),
            weekId: weekId1,
            activity: 'running',
            dayIndex: 0,
            title: 'Test Training',
            description: 'Test Description',
            duration: 60,
            intensity: Intensity.NORMAL,
            location: 'Test Location',
            completionSummary: '',
          },
          {
            id: uuidv4(),
            weekId: weekId1,
            activity: 'swimming',
            dayIndex: 0,
            title: 'Test Training 2',
            description: 'Test Description 2',
            duration: 30,
            intensity: Intensity.MEDIUM,
            location: 'Test Location 2',
            completionSummary: '',
          },
        ],
      },
    ];

    const mockSettings: ScheduleSettings = {
      name: 'Test Schedule',
      startDate: new Date('2024-01-01'),
      actualWeekNumbering: false,
      availableActivities: ['running', 'swimming', 'sprint'],
      defaultStartTime: {hours: 23, minutes: 30, seconds: 0},
      defaultDuration: 60,
      unitOfTime: 'm',
      lockSchedule: false,
      startsOnSunday: false,
    };

    const events = await createTestComponent(mockSettings, mockWeeks);

    expect(events).toHaveLength(2);

    // Assertions for the first activity
    expect(events[0].title).toBe('Test Training');
    expect(events[0].description).toBe('Test Description');
    expect(events[0].duration.minutes).toBe(60);
    expect(events[0].location).toBe('Test Location');
    expect(events[0].categories).toEqual(['Running', 'Normal']);
    expect(events[0].status).toBe('CONFIRMED');
    expect(events[0].busyStatus).toBe('BUSY');
    expect(events[0].productId).toBe('ajuvonen/getfit');
    expect(events[0].start).toEqual([2024, 1, 1, 23, 30]);

    // Assertions for the second activity
    expect(events[1].title).toBe('Test Training 2');
    expect(events[1].description).toBe('Test Description 2');
    expect(events[1].duration.minutes).toBe(30);
    expect(events[1].location).toBe('Test Location 2');
    expect(events[1].categories).toEqual(['Swimming', 'Medium']);
    expect(events[1].status).toBe('CONFIRMED');
    expect(events[1].busyStatus).toBe('BUSY');
    expect(events[1].productId).toBe('ajuvonen/getfit');
    expect(events[1].start).toEqual([2024, 1, 2, 0, 30]);
  });
});
