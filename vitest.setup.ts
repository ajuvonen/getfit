import {DOMWrapper, VueWrapper, config} from '@vue/test-utils';
import {afterEach, beforeEach, vi} from 'vitest';
import {createTestingPinia} from '@pinia/testing';
import resizeObserver from 'resize-observer-polyfill';
import i18n from '@/i18n';
import router from '@/router';
import vuetifyPlugin from '@/vuetify';

config.global.plugins = [createTestingPinia(), vuetifyPlugin, i18n, router];
vi.stubGlobal('ResizeObserver', resizeObserver);

const dataTestIdPlugin = (wrapper: VueWrapper) => ({
  findByTestId: (testId: string) => {
    const element = wrapper.element.querySelector(`[data-test-id='${testId}']`);
    return new DOMWrapper(element);
  },
});

beforeEach(() => {
  // Clear local storage so state is fresh for each test
  localStorage.clear();
});

afterEach(() => {
  config.global.plugins[0] = createTestingPinia();
});

config.plugins.VueWrapper.install(dataTestIdPlugin);
