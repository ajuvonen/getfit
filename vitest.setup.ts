import {DOMWrapper, VueWrapper, config} from '@vue/test-utils';
import {vi} from 'vitest';
import {createVuetify} from 'vuetify';
import {createTestingPinia} from '@pinia/testing';
import resizeObserver from 'resize-observer-polyfill';
import i18n from '@/i18n';

config.global.plugins = [createTestingPinia(), createVuetify(), i18n];
vi.stubGlobal('ResizeObserver', resizeObserver);

const dataTestIdPlugin = (wrapper: VueWrapper) => ({
  findByTestId: (testId: string) => {
    const element = wrapper.element.querySelector(`[data-test-id='${testId}']`);
    return new DOMWrapper(element);
  },
});

config.plugins.VueWrapper.install(dataTestIdPlugin);
