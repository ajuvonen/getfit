import {createPinia, setActivePinia} from 'pinia';
import {describe, it, expect, beforeEach} from 'vitest';
import {vi} from 'vitest';
import {v4 as uuid} from 'uuid';
import {useAppStateStore} from '@/stores/appState';
import type {LocalizedActivity, Training} from '@/types';

describe('appStateStore', () => {
  let store: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
    store = useAppStateStore();
  });

  it('opens confirm dialog', () => {
    const confirmAction = vi.fn();
    store.openConfirmDialog('Are you sure?', confirmAction);

    expect(store.confirmDialogOpen).toBe(true);
    expect(store.confirmText).toBe('Are you sure?');
    expect(store.confirmAction).toBe(confirmAction);
  });

  it('opens new training dialog', () => {
    const weekId = uuid();
    const dayIndex = 0;
    const activity: LocalizedActivity = {value: 'running', title: 'Running', icon: 'mdi-run'}
    store.openNewTrainingDialog(weekId, dayIndex, [activity]);

    expect(store.trainingDialogOpen).toBe(true);
    expect(store.trainingData).toMatchObject({
      activity: 'running',
      weekId,
      dayIndex,
    });
  });

  it('opens edit training dialog', () => {
    const training: Training = {
      id: uuid(),
      weekId: uuid(),
      dayIndex: 0,
      activity: 'running',
      title: 'test',
      description: 'test',
      duration: 1,
      intensity: 1,
      location: 'test',
      completed: false,
      rating: 1,
    };
    store.openEditTrainingDialog(training);
    expect(store.trainingDialogOpen).toBe(true);
    expect(store.trainingData).toEqual(training);
  });

  it('toggles show description', () => {
    const trainingId = uuid();
    store.toggleShowDescription(trainingId);
    expect(store.openDescriptions).toEqual([trainingId]);
    store.toggleShowDescription(trainingId);
    expect(store.openDescriptions).toEqual([]);
  });
});