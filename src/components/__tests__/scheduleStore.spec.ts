import {createPinia, setActivePinia} from 'pinia';
import {describe, it, expect, beforeEach} from 'vitest';
import {v4 as uuidv4} from 'uuid';
import {useScheduleStore} from '@/stores/schedule';
import {getEmptyTraining} from '@/utils';
import {Intensity} from '@/types';

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
        getEmptyTraining({
          id: trainingId,
          weekId,
        }),
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
        getEmptyTraining({
          weekId,
        }),
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

    const originalTraining = getEmptyTraining({
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      location: 'Park',
      completed: true,
      rating: 3,
    });

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
    expect(copiedTraining?.completed).toBe(false);
    expect(copiedTraining?.rating).toBeNull();
  });

  it('adds a training', () => {
    const weekId = uuidv4();

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [],
    });

    const training = getEmptyTraining({
      weekId: weekId,
      activity: 'Running',
      title: 'Morning Run',
      description: '5km run',
      duration: 30,
      location: 'Park',
    });

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
        getEmptyTraining({
          id: trainingId,
          weekId: weekId,
          dayIndex: 1,
          activity: 'running',
          title: 'Morning Run',
          description: '5km run',
          duration: 30,
          location: 'Park',
        }),
      ],
    });

    const updatedTraining = getEmptyTraining({
      id: trainingId,
      weekId: weekId,
      dayIndex: 1,
      activity: 'sprint',
      title: 'Evening Run',
      description: '1km run',
      duration: 10,
      intensity: Intensity.HEAVY,
      location: 'Track',
    });

    scheduleStore.addOrEditTraining(updatedTraining);

    const [, training] = scheduleStore.getTargetWeekAndTraining(weekId, trainingId);
    expect(training).toEqual(updatedTraining);
  });

  it('deletes a training', () => {
    const weekId = uuidv4();

    const training = getEmptyTraining({
      weekId: weekId,
    });

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

    const training = getEmptyTraining({
      weekId: weekId,
    });

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training],
    });

    const nonExistentTraining = {...training, id: uuidv4()};
    scheduleStore.deleteTraining(nonExistentTraining);

    const [week] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(week.trainings.length).toBe(1);
  });

  it('moves a training to a different week', () => {
    const weekId1 = uuidv4();
    const weekId2 = uuidv4();

    const training = getEmptyTraining({
      weekId: weekId1,
      completed: true,
    });

    scheduleStore.weeks.push({id: weekId1, trainings: [training]}, {id: weekId2, trainings: []});

    scheduleStore.moveTraining(training, weekId2, 2);

    const [week1] = scheduleStore.getTargetWeekAndTraining(weekId1);
    const [week2] = scheduleStore.getTargetWeekAndTraining(weekId2);
    expect(week1.trainings.length).toBe(0);
    expect(week2.trainings.length).toBe(1);
    expect(week2.trainings[0].dayIndex).toBe(2);
  });

  it('reorders trainings within a week', () => {
    const weekId = uuidv4();

    const training1 = getEmptyTraining({
      weekId: weekId,
    });

    const training2 = getEmptyTraining({
      weekId: weekId,
    });

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training1, training2],
    });

    scheduleStore.reorderTrainings(weekId, [training2, training1]);

    const [reordered] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(reordered.trainings[0].id).toBe(training2.id);
    expect(reordered.trainings[1].id).toBe(training1.id);
  });

  it('copies a training', () => {
    const weekId = uuidv4();

    const training = getEmptyTraining({
      weekId: weekId,
      completed: true,
      rating: 3,
    });

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training],
    });

    scheduleStore.copyTraining(training, weekId, 2);

    const [week] = scheduleStore.getTargetWeekAndTraining(weekId);
    expect(week.trainings.length).toBe(2);
    expect(week.trainings[1].id).not.toBe(training.id);
    expect(week.trainings[1].dayIndex).toBe(2);
    expect(week.trainings[1].completed).toBe(false);
    expect(week.trainings[1].rating).toBeNull();
  });

  it('toggles the completed property', () => {
    const weekId = uuidv4();

    const training = getEmptyTraining({
      weekId: weekId,
    });

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training],
    });

    expect(training.completed).toBe(false);
    scheduleStore.toggleCompletion(training);
    expect(training.completed).toBe(true);
    scheduleStore.toggleCompletion(training);
    expect(training.completed).toBe(false);
  });

  it('updates the rating property', () => {
    const weekId = uuidv4();

    const training = getEmptyTraining({
      weekId: weekId,
    });

    scheduleStore.weeks.push({
      id: weekId,
      trainings: [training],
    });

    expect(training.rating).toBeNull();
    scheduleStore.updateRating(training, 1);
    expect(training.rating).toBe(1);
    scheduleStore.updateRating(training, 1);
    expect(training.rating).toBeNull();
    scheduleStore.updateRating(training, 5);
    expect(training.rating).toBe(5);
  });
});
