import {computed, watch, type Ref, type WritableComputedRef, type ComputedRef, ref} from 'vue';
import {useVuelidate, type ValidationRule} from '@vuelidate/core';
import {getValidationErrors} from '@/utils';

export default function useValidatedRef<T, K extends keyof T>(
  original: Ref<T>,
  key: K,
  rules: ComputedRef<{
    [P in K]: {
      [rule: string]: ValidationRule | undefined;
    } | undefined;
  }>,
): [WritableComputedRef<T[K]>, ComputedRef<string[]>] {
  const internal = ref(original.value[key]) as Ref<T[K]>;
  const narrowedRules = computed(() => ({[key]: rules.value[key]}));
  const $v = useVuelidate(narrowedRules, {[key]: internal});
  watch(
    () => original.value[key],
    (newValue) => {
      if (internal.value !== newValue) {
        internal.value = newValue;
      }
    },
  );
  return [
    computed({
      get() {
        return internal.value;
      },
      set(value: T[K]) {
        internal.value = value;
        $v.value.$touch();
        if (!$v.value.$error) {
          original.value[key] = value;
        }
      },
    }),
    computed(() => getValidationErrors($v.value.$errors)),
  ];
}
