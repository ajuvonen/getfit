import {describe, it, expect, vi, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import {v4 as uuid} from 'uuid';
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';
import {getEmptySettings, getEmptyTraining} from '@/utils';
import {Intensity, type ScheduleSettings, type Week} from '@/types';
import useReset from '@/hooks/reset';
import useScreen from '@/hooks/screen';
import useCalendarExport from '@/hooks/calendarExport';
import useWeekDays from '@/hooks/weekdays';
import {nextTick} from 'vue';

const withSetup = <T>(hook: () => T) =>
  new Promise<T>((resolve) => {
    shallowMount({
      template: '<div></div>',
      setup() {
        resolve(hook());
      },
    });
  });

describe('hooks', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
    scheduleStore = useScheduleStore();
  });

  it('opens a confirmation dialog which resets the stores', async () => {
    const resetFn = await withSetup(useReset);
    appStateStore.trainingData = getEmptyTraining();
    scheduleStore.settings.name = 'Test schedule';
    resetFn();
    expect(appStateStore.openConfirmDialog).toHaveBeenCalled();
  });

  it('uses preferred dark mode', async () => {
    const {isDark} = await withSetup(useScreen);

    expect(isDark.value).toBe(false);
    scheduleStore.settings.darkMode = 'dark';
    expect(isDark.value).toBe(true);
    scheduleStore.settings.darkMode = 'light';
    expect(isDark.value).toBe(false);
  });

  it('announces small size', async () => {
    vi.stubGlobal('innerWidth', 599);
    const {isSmallScreen, isLargeScreen} = await withSetup(useScreen);
    expect(isSmallScreen.value).toBe(true);
    expect(isLargeScreen.value).toBe(false);
    vi.unstubAllGlobals();
  });

  it('announces medium size 1', async () => {
    vi.stubGlobal('innerWidth', 600);
    const {isSmallScreen, isLargeScreen} = await withSetup(useScreen);
    expect(isSmallScreen.value).toBe(false);
    expect(isLargeScreen.value).toBe(false);
    vi.unstubAllGlobals();
  });

  it('announces medium size 2', async () => {
    vi.stubGlobal('innerWidth', 959);
    const {isSmallScreen, isLargeScreen} = await withSetup(useScreen);
    expect(isSmallScreen.value).toBe(false);
    expect(isLargeScreen.value).toBe(false);
    vi.unstubAllGlobals();
  });

  it('announces large size', async () => {
    vi.stubGlobal('innerWidth', 960);
    const {isSmallScreen, isLargeScreen} = await withSetup(useScreen);
    expect(isSmallScreen.value).toBe(false);
    expect(isLargeScreen.value).toBe(true);
    vi.unstubAllGlobals();
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

    const {createCalendarEvents} = await withSetup(useCalendarExport);
    scheduleStore.weeks = mockWeeks;
    scheduleStore.settings = mockSettings;
    const events = createCalendarEvents();
    expect(events).toHaveLength(1);
    expect(events[0].duration.minutes).toBe(60);
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

    const {createCalendarEvents} = await withSetup(useCalendarExport);
    scheduleStore.weeks = mockWeeks;
    scheduleStore.settings = mockSettings;
    const events = createCalendarEvents();

    expect(events).toHaveLength(1);
    expect(events[0].calName).toBe('TrainingSchedule');
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

    const {createCalendarEvents} = await withSetup(useCalendarExport);
    scheduleStore.weeks = mockWeeks;
    scheduleStore.settings = mockSettings;
    const events = createCalendarEvents();

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

    const {createCalendarEvents} = await withSetup(useCalendarExport);
    scheduleStore.weeks = mockWeeks;
    scheduleStore.settings = mockSettings;
    const events = createCalendarEvents();

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

  it('lists weekdays in correct order', async () => {
    const {weekdays} = await withSetup(useWeekDays);
    expect(weekdays.value).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
    scheduleStore.settings.startsOnSunday = true;
    expect(weekdays.value).toEqual([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]);
  });

  it('lists short weekdays in correct order', async () => {
    const {shortWeekdays} = await withSetup(useWeekDays);
    expect(shortWeekdays.value).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    scheduleStore.settings.startsOnSunday = true;
    expect(shortWeekdays.value).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  it('returns a date interval for selected week', async () => {
    const {getDateInterval} = await withSetup(useWeekDays);
    scheduleStore.settings.startDate = new Date('05-20-2024');
    expect(getDateInterval.value(0)).toEqual('05/20/2024 - 05/26/2024');
    expect(getDateInterval.value(1)).toEqual('05/27/2024 - 06/02/2024');
    expect(getDateInterval.value(2)).toEqual('06/03/2024 - 06/09/2024');
  });

  it('returns display week number', async () => {
    const {getDisplayWeekNumber} = await withSetup(useWeekDays);
    expect(getDisplayWeekNumber.value(0)).toBe(1);
    expect(getDisplayWeekNumber.value(1)).toBe(2);
    scheduleStore.settings.startDate = new Date('05-20-2024');
    scheduleStore.settings.actualWeekNumbering = true;
    expect(getDisplayWeekNumber.value(0)).toBe(21);
    expect(getDisplayWeekNumber.value(1)).toBe(22);
  });

  it('returns short date', async () => {
    const {getShortDate} = await withSetup(useWeekDays);
    scheduleStore.settings.startDate = new Date('05-20-2024');
    expect(getShortDate.value(0, 1)).toBe('05/21');
    expect(getShortDate.value(1, 3)).toBe('05/30');
  });
});
