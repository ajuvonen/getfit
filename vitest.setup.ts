import {vi} from 'vitest';
import {VueWrapper, config} from '@vue/test-utils';
import {createVuetify} from 'vuetify';
import i18n from '@/i18n';
import {createTestingPinia} from '@pinia/testing';

config.global.plugins = [createTestingPinia(), createVuetify(), i18n];

const dataTestIdPlugin = (wrapper: VueWrapper) => ({
  findByTestId: (testId: string) => wrapper.find(`[data-test-id='${testId}']`),
});

config.plugins.VueWrapper.install(dataTestIdPlugin);

vi.mock('vue3-mq', () => ({
  useMq: () => ({
    current: 'lg',
  }),
}));
