import {createI18n} from 'vue-i18n';
import type {Locale} from '@/types';
import en from './en.json';
import fi from './fi.json';

type MessageSchema = typeof en;

export default createI18n<[MessageSchema], Locale>({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  allowComposition: true,
  messages: {
    en,
    fi,
  },
});
