import {createI18n} from 'vue-i18n';
import en from './en.json';

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  allowComposition: true,
  messages: {
    en,
  },
});
