import {createPinia, setActivePinia} from 'pinia';
import {describe, it, expect, beforeEach} from 'vitest';
import {v4 as uuidv4} from 'uuid';
import {useScheduleStore} from '@/stores/schedule';

describe('useScheduleStore', () => {
  let scheduleStore: ReturnType<typeof useScheduleStore>;

  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
    scheduleStore = useScheduleStore();
  });

  it('adds a week', () => {
    expect(scheduleStore.weeks.length).toBe(0);
    scheduleStore.addWeek();
    expect(scheduleStore.weeks.length).toBe(1);
    scheduleStore.addWeek();
    expect(scheduleStore.weeks.length).toBe(2);
  });

  it('gets target week and training', () => {
    const weekId = uuidv4();
    const trainingId = uuidv4();

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [
        {
          id: trainingId,
          weekId,
          dayIndex: 0,
          duration: 0,
          activity: '',
          description: '',
          title: '',
          intensity: 0,
          location: '',
        },
      ],
    });

    const [week, training] = scheduleStore.getTargetWeekAndTraining(weekId, trainingId);

    expect(week.id).toBe(weekId);
    expect(training?.id).toBe(trainingId);
  });

  it('leaves out training', () => {
    const weekId = uuidv4();

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [
        {
          id: uuidv4(),
          weekId,
          dayIndex: 0,
          duration: 0,
          activity: '',
          description: '',
          title: '',
          intensity: 0,
          location: '',
        },
      ],
    });

    const [week, training] = scheduleStore.getTargetWeekAndTraining(weekId);

    expect(week.id).toBe(weekId);
    expect(training).toBeUndefined();
  });

  it('deletes a week', () => {
    const weekId = uuidv4();

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [],
    });

    expect(scheduleStore.weeks.length).toBe(1);
    scheduleStore.deleteWeek(weekId);
    expect(scheduleStore.weeks.length).toBe(0);
  });

  it('copies a week', () => {
    const weekId = uuidv4();
    const trainingId = uuidv4();

    const originalTraining = {
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      intensity: 0,
      location: 'Park',
    };

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [originalTraining],
    });

    const initialWeekCount = scheduleStore.weeks.length;

    scheduleStore.copyWeek(weekId);

    expect(scheduleStore.weeks.length).toBe(initialWeekCount + 1);
    const copiedWeek = scheduleStore.weeks.find((week) => week.id !== weekId);
    expect(copiedWeek?.trainings.length).toBe(1);
    const copiedTraining = copiedWeek?.trainings[0];
    expect(copiedTraining?.id).not.toBe(trainingId);
    expect(copiedTraining?.weekId).toBe(copiedWeek?.id);
    expect(copiedTraining?.dayIndex).toBe(originalTraining.dayIndex);
    expect(copiedTraining?.activity).toBe(originalTraining.activity);
    expect(copiedTraining?.title).toBe(originalTraining.title);
    expect(copiedTraining?.description).toBe(originalTraining.description);
    expect(copiedTraining?.duration).toBe(originalTraining.duration);
    expect(copiedTraining?.intensity).toBe(originalTraining.intensity);
    expect(copiedTraining?.location).toBe(originalTraining.location);
  });

  it('adds a training', () => {
    const weekId = uuidv4();
    const trainingId = uuidv4();

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [],
    });

    const training = {
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      intensity: 0,
      location: 'Park',
    };

    scheduleStore.addOrEditTraining(training);

    const [week] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(week.trainings.length).toBe(1);
    expect(week.trainings[0]).toEqual(training);
  });

  it('edits a training', () => {
    const weekId = uuidv4();
    const trainingId = uuidv4();

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [
        {
          id: trainingId,
          weekId: weekId,
          dayIndex: 1,
          activity: 'Running',
          title: 'Morning Run',
          description: '5km run',
          duration: 30,
          intensity: 0,
          location: 'Park',
        },
      ],
    });

    const updatedTraining = {
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Evening Run',
      description: '10km run',
      duration: 60,
      intensity: 0,
      location: 'Gym',
    };

    scheduleStore.addOrEditTraining(updatedTraining);

    const [, training] = scheduleStore.getTargetWeekAndTraining(weekId, trainingId);
    expect(training).toEqual(updatedTraining);
  });

  it('deletes a training', () => {
    const weekId = uuidv4();
    const trainingId = uuidv4();
  
    const training = {
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      intensity: 0,
      location: 'Park',
    };
  
    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training],
    });
  
    scheduleStore.deleteTraining(training);
  
    const [week] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(week.trainings.length).toBe(0);
  });

  it('does not delete a training when IDs do not match', () => {
    const weekId = uuidv4();
    const trainingId = uuidv4();
  
    const training = {
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      intensity: 0,
      location: 'Park',
    };
  
    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training],
    });
  
    const nonExistentTraining = { ...training, id: uuidv4() };
    scheduleStore.deleteTraining(nonExistentTraining);
  
    const [week] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(week.trainings.length).toBe(1);
  });

  it('moves a training to a different week', () => {
    const weekId1 = uuidv4();
    const weekId2 = uuidv4();
    const trainingId = uuidv4();
  
    const training = {
      id: trainingId,
      weekId: weekId1,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      intensity: 0,
      location: 'Park',
    };
  
    scheduleStore.weeks.push(
      { id: weekId1, trainings: [training] },
      { id: weekId2, trainings: [] },
    );
  
    scheduleStore.moveTraining(training, weekId2, 2);
  
    const [week1] = scheduleStore.getTargetWeekAndTraining(weekId1);
    const [week2] = scheduleStore.getTargetWeekAndTraining(weekId2);
    expect(week1.trainings.length).toBe(0);
    expect(week2.trainings.length).toBe(1);
    expect(week2.trainings[0].dayIndex).toBe(2);
  });
  
  it('reorders trainings within a week', () => {
    const weekId = uuidv4();
    const trainingId1 = uuidv4();
    const trainingId2 = uuidv4();
  
    const training1 = {
      id: trainingId1,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      intensity: 0,
      location: 'Park',
    };
  
    const training2 = {
      id: trainingId2,
      weekId: weekId,
      dayIndex: 2,
      activity: 'Swimming',
      title: 'Afternoon Swim',
      description: '1km swim',
      duration: 45,
      intensity: 1,
      location: 'Pool',
    };
  
    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training1, training2],
    });
  
    scheduleStore.reorderTrainings(weekId, [training2, training1]);
  
    const [reordered] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(reordered.trainings[0].id).toBe(trainingId2);
    expect(reordered.trainings[1].id).toBe(trainingId1);
  });
  
  it('copies a training', () => {
    const weekId = uuidv4();
    const trainingId = uuidv4();
  
    const training = {
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      intensity: 0,
      location: 'Park',
    };
  
    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training],
    });
  
    scheduleStore.copyTraining(training, weekId, 2);
  
    const [week] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(week.trainings.length).toBe(2);
    expect(week.trainings[1].id).not.toBe(trainingId);
    expect(week.trainings[1].dayIndex).toBe(2);
  });
});
