import {computed, nextTick, ref} from 'vue';
import {describe, it, expect} from 'vitest';
import {required, between} from '@vuelidate/validators';
import useValidatedRef from '@/hooks/validatedRef';

describe('validatedRef', () => {
  it('initializes values', () => {
    const rules = computed(() => ({
      name: {
        required,
      },
    }));

    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', rules);

    expect(name.value).toBe('Tim');
    expect(nameErrors.value).toEqual([]);
  });

  it('updates original value', () => {
    const rules = computed(() => ({
      name: {
        required,
      },
    }));

    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', rules);
    name.value = 'Tom';
    expect(testData.value.name).toBe('Tom');
    expect(nameErrors.value).toEqual([]);
  });

  it('updates cloned value', async () => {
    const rules = computed(() => ({
      name: {
        required,
      },
    }));

    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', rules);
    testData.value.name = 'Tom';
    await nextTick();
    expect(name.value).toBe('Tom');
    expect(nameErrors.value).toEqual([]);
  });

  it('works with multiple properties', () => {
    const rules = computed(() => ({
      name: {
        required,
      },
      age: {between: between(0, 100)},
    }));

    const testData = ref({name: 'Tim', age: 27});
    const [name, nameErrors] = useValidatedRef(testData, 'name', rules);
    const [age, ageErrors] = useValidatedRef(testData, 'age', rules);
    name.value = 'Tom';
    expect(testData.value.name).toBe('Tom');
    expect(nameErrors.value).toEqual([]);
    expect(testData.value.age).toBe(27);
    age.value = 20;
    expect(testData.value.age).toBe(20);
    expect(ageErrors.value).toEqual([]);
    expect(testData.value.name).toBe('Tom');
  });

  it('does not update original value with erroneus data', () => {
    const rules = computed(() => ({
      name: {
        required,
      },
    }));

    const testData = ref({name: 'Tim'});
    const [name, nameErrors] = useValidatedRef(testData, 'name', rules);
    name.value = '';
    expect(testData.value.name).toBe('Tim');
    expect(nameErrors.value.length).toBe(1);
    name.value = 'Tom';
    expect(testData.value.name).toBe('Tom');
    expect(nameErrors.value).toEqual([]);
  });

  it('updates errors when rules change', async () => {
    const noRetirees = ref(false);
    const rules = computed(() => ({
      age: {between: noRetirees.value ? between(0, 65) : between(0, 100)},
    }));

    const testData = ref({age: 16});
    const [age, ageErrors] = useValidatedRef(testData, 'age', rules);
    expect(ageErrors.value).toEqual([]);
    noRetirees.value = true;
    age.value = 89;
    await nextTick();
    expect(ageErrors.value.length).toBe(1);
  });
});
