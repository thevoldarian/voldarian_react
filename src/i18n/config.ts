import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import locale files
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';
import deCommon from './locales/de/common.json';
import jaCommon from './locales/ja/common.json';
import arCommon from './locales/ar/common.json';
import enHome from './locales/en/home.json';
import esHome from './locales/es/home.json';
import deHome from './locales/de/home.json';
import jaHome from './locales/ja/home.json';
import arHome from './locales/ar/home.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
  },
  es: {
    common: esCommon,
    home: esHome,
  },
  de: {
    common: deCommon,
    home: deHome,
  },
  ja: {
    common: jaCommon,
    home: jaHome,
  },
  ar: {
    common: arCommon,
    home: arHome,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;
