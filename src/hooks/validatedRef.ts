import {
  computed,
  watch,
  ref,
  type Ref,
  type WritableComputedRef,
  type ComputedRef,
} from 'vue';
import {useVuelidate, type ValidationRule} from '@vuelidate/core';
import {clone} from 'ramda';
import {getValidationErrors} from '@/utils';

export default function useValidatedRef<T>(
  original: Ref<T>,
  key: keyof T,
  rules: ComputedRef<{
    [P in keyof T]?: {
      [rule: string]: ValidationRule | undefined;
    } | undefined;
  }>,
): [WritableComputedRef<T[keyof T]>, ComputedRef<string[]>] {
  const internal = ref(clone(original.value)) as Ref<T>;
  const $v = useVuelidate(rules, internal);
  watch(
    () => original.value[key],
    (newValue) => {
      if (internal.value[key] !== newValue) {
        internal.value[key] = newValue;
      }
    },
  );
  return [
    computed({
      get() {
        return internal.value[key];
      },
      set(value: T[typeof key]) {
        internal.value[key] = value;
        $v.value[key].$touch();
        if (!$v.value[key].$error) {
          original.value[key] = value;
        }
      },
    }),
    computed(() => getValidationErrors($v.value[key].$errors)),
  ];
}
