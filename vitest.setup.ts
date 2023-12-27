import {DOMWrapper, VueWrapper, config} from '@vue/test-utils';
import {createVuetify} from 'vuetify';
import i18n from '@/i18n';
import {createTestingPinia} from '@pinia/testing';

config.global.plugins = [createTestingPinia(), createVuetify(), i18n];

const dataTestIdPlugin = (wrapper: VueWrapper) => ({
  findByTestId: (testId: string) => {
    const element = wrapper.element.querySelector(`[data-test-id='${testId}']`);
    return new DOMWrapper(element);
  },
});

config.plugins.VueWrapper.install(dataTestIdPlugin);
