import {createI18n} from 'vue-i18n';
import type {LocalizationKey} from '@/types';
import en from './en.json';
import fi from './fi.json';

type MessageSchema = typeof en;

export default createI18n<[MessageSchema], LocalizationKey>({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  allowComposition: true,
  messages: {
    en,
    fi,
  },
});
