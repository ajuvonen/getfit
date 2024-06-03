import {computed, nextTick, ref} from 'vue';
import {describe, it, expect} from 'vitest';
import type {Rule} from 'async-validator';
import useValidatedRef from '@/hooks/validatedRef';

describe('validatedRef', () => {
  it('initializes values', () => {
    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', {
      required: true,
    });

    expect(name.value).toBe('Tim');
    expect(nameErrors.value).toEqual([]);
  });

  it('updates original value', async () => {
    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', {
      required: true,
    });
    name.value = 'Tom';
    await nextTick();
    expect(testData.value.name).toBe('Tom');
    expect(nameErrors.value).toEqual([]);
  });

  it('updates cloned value', async () => {
    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', {
      required: true,
    });
    testData.value.name = 'Tom';
    await nextTick();
    expect(name.value).toBe('Tom');
    expect(nameErrors.value).toEqual([]);
  });

  it('does not update original value with erroneus data', async () => {
    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', {
      required: true,
      message: 'TEST ERROR',
    });
    name.value = '';
    await nextTick();
    expect(testData.value.name).toBe('Tim');
    expect(nameErrors.value).toEqual(['TEST ERROR']);
    name.value = 'Tom';
    await nextTick();
    expect(testData.value.name).toBe('Tom');
    expect(nameErrors.value).toEqual([]);
  });

  it('updates errors when rules change', async () => {
    const noRetirees = ref(false);
    const rules = computed(
      () =>
        ({
          type: 'integer',
          min: 0,
          max: noRetirees.value ? 65 : 100,
          message: 'TEST ERROR',
        }) as Rule,
    );

    const testData = ref({age: 16});
    const [age, ageErrors] = useValidatedRef(testData, 'age', rules);
    expect(ageErrors.value).toEqual([]);
    noRetirees.value = true;
    age.value = 89;
    await nextTick();
    expect(ageErrors.value).toEqual(['TEST ERROR']);
  });
});
