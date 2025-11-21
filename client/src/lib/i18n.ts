import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Auto-detect language from browser, with French preference
const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  const saved = localStorage.getItem('language');
  if (saved) return saved;
  
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('ha')) return 'ha';
  if (browserLang.startsWith('yo')) return 'yo';
  if (browserLang.startsWith('ig')) return 'ig';
  
  return 'en';
};

const initialLanguage = getInitialLanguage();

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
  }
});

export default i18n;
