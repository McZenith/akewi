import en from './locales/en.json';

export type TranslationKeys = typeof en;
export type CommonKeys = keyof typeof en.common;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof en;
    };
  }
}
