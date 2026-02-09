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
import enContact from './locales/en/contact.json';
import esContact from './locales/es/contact.json';
import deContact from './locales/de/contact.json';
import jaContact from './locales/ja/contact.json';
import arContact from './locales/ar/contact.json';
import enAbout from './locales/en/about.json';
import esAbout from './locales/es/about.json';
import deAbout from './locales/de/about.json';
import jaAbout from './locales/ja/about.json';
import arAbout from './locales/ar/about.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    contact: enContact,
    about: enAbout,
  },
  es: {
    common: esCommon,
    home: esHome,
    contact: esContact,
    about: esAbout,
  },
  de: {
    common: deCommon,
    home: deHome,
    contact: deContact,
    about: deAbout,
  },
  ja: {
    common: jaCommon,
    home: jaHome,
    contact: jaContact,
    about: jaAbout,
  },
  ar: {
    common: arCommon,
    home: arHome,
    contact: arContact,
    about: arAbout,
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
