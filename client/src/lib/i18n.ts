import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../locales/en.json';
import haTranslations from '../locales/ha.json';
import yoTranslations from '../locales/yo.json';
import igTranslations from '../locales/ig.json';

const resources = {
  en: { translation: enTranslations },
  ha: { translation: haTranslations },
  yo: { translation: yoTranslations },
  ig: { translation: igTranslations },
};

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
