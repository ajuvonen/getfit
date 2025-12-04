import {config, mount} from '@vue/test-utils';
import {beforeEach, vi} from 'vitest';
import {createTestingPinia} from '@pinia/testing';
import resizeObserver from 'resize-observer-polyfill';
import i18n from './src/i18n';
import router from './src/router';
import vuetifyPlugin from './src/vuetify';

import '@vuepic/vue-datepicker/dist/main.css';
import '@/styles/app.css';

const visualViewportMock = new EventTarget();
vi.stubGlobal('visualViewport', visualViewportMock);

config.global.plugins = [vuetifyPlugin, i18n, router];
vi.stubGlobal('ResizeObserver', resizeObserver);

const dataTestIdPlugin = (wrapper: ReturnType<typeof mount>) => ({
  findByTestId: (testId: string) => wrapper.find(`[data-test-id='${testId}']`),
});

config.plugins.VueWrapper.install(dataTestIdPlugin);

beforeEach(() => {
  // Clear local storage so state is fresh for each test
  localStorage.clear();
  config.global.plugins[3] = createTestingPinia();
});
