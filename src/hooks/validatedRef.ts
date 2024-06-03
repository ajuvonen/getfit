import {computed, watch, ref, nextTick, unref} from 'vue';
import {useAsyncValidator} from '@vueuse/integrations/useAsyncValidator';
import type {Ref, WritableComputedRef, ComputedRef, MaybeRefOrGetter} from 'vue';
import type {Rules, Rule} from 'async-validator';
import {getValidationErrors} from '@/utils';

export default function useValidatedRef<T, K extends keyof T>(
  original: Ref<T>,
  key: K,
  rules: MaybeRefOrGetter<Rule>,
): [WritableComputedRef<T[K]>, ComputedRef<string[]>] {
  const internal = ref({[key]: original.value[key]}) as Ref<Record<K, T[K]>>;
  const computedRules = computed(() => ({[key]: unref(rules)}) as Rules);
  const {pass, errorFields} = useAsyncValidator(internal, computedRules, {
    validateOption: {
      suppressWarning: true,
    },
  });

  watch(
    () => original.value[key],
    (newValue) => {
      if (internal.value !== newValue) {
        internal.value[key] = newValue;
      }
    },
  );
  return [
    computed({
      get() {
        return internal.value[key];
      },
      async set(value: T[K]) {
        internal.value[key] = value;
        await nextTick();
        if (pass.value) {
          original.value[key] = value;
        }
      },
    }),
    computed(() => getValidationErrors(errorFields, key as string)),
  ];
}
