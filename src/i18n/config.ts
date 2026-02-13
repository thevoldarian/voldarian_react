import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import locale files
import enCommon from './locales/en/common.json';
import enErrors from './locales/en/errors.json';
import enHome from './locales/en/home.json';
import enContact from './locales/en/contact.json';
import enAbout from './locales/en/about.json';
import enProjects from './locales/en/projects.json';
import enGithubDashboard from './locales/en/githubDashboard.json';
import enDataTable from './locales/en/dataTable.json';
import enCryptoDashboard from './locales/en/cryptoDashboard.json';

import esCommon from './locales/es/common.json';
import esErrors from './locales/es/errors.json';
import esHome from './locales/es/home.json';
import esContact from './locales/es/contact.json';
import esAbout from './locales/es/about.json';
import esProjects from './locales/es/projects.json';
import esGithubDashboard from './locales/es/githubDashboard.json';
import esDataTable from './locales/es/dataTable.json';
import esCryptoDashboard from './locales/es/cryptoDashboard.json';

import deCommon from './locales/de/common.json';
import deErrors from './locales/de/errors.json';
import deHome from './locales/de/home.json';
import deContact from './locales/de/contact.json';
import deAbout from './locales/de/about.json';
import deProjects from './locales/de/projects.json';
import deGithubDashboard from './locales/de/githubDashboard.json';
import deDataTable from './locales/de/dataTable.json';
import deCryptoDashboard from './locales/de/cryptoDashboard.json';

import jaCommon from './locales/ja/common.json';
import jaErrors from './locales/ja/errors.json';
import jaHome from './locales/ja/home.json';
import jaContact from './locales/ja/contact.json';
import jaAbout from './locales/ja/about.json';
import jaProjects from './locales/ja/projects.json';
import jaGithubDashboard from './locales/ja/githubDashboard.json';
import jaDataTable from './locales/ja/dataTable.json';
import jaCryptoDashboard from './locales/ja/cryptoDashboard.json';

import arCommon from './locales/ar/common.json';
import arErrors from './locales/ar/errors.json';
import arHome from './locales/ar/home.json';
import arContact from './locales/ar/contact.json';
import arAbout from './locales/ar/about.json';
import arProjects from './locales/ar/projects.json';
import arGithubDashboard from './locales/ar/githubDashboard.json';
import arDataTable from './locales/ar/dataTable.json';
import arCryptoDashboard from './locales/ar/cryptoDashboard.json';

const resources = {
  en: {
    common: enCommon,
    errors: enErrors,
    home: enHome,
    contact: enContact,
    about: enAbout,
    projects: enProjects,
    githubDashboard: enGithubDashboard,
    dataTable: enDataTable,
    cryptoDashboard: enCryptoDashboard,
  },
  es: {
    common: esCommon,
    errors: esErrors,
    home: esHome,
    contact: esContact,
    about: esAbout,
    projects: esProjects,
    githubDashboard: esGithubDashboard,
    dataTable: esDataTable,
    cryptoDashboard: esCryptoDashboard,
  },
  de: {
    common: deCommon,
    errors: deErrors,
    home: deHome,
    contact: deContact,
    about: deAbout,
    projects: deProjects,
    githubDashboard: deGithubDashboard,
    dataTable: deDataTable,
    cryptoDashboard: deCryptoDashboard,
  },
  ja: {
    common: jaCommon,
    errors: jaErrors,
    home: jaHome,
    contact: jaContact,
    about: jaAbout,
    projects: jaProjects,
    githubDashboard: jaGithubDashboard,
    dataTable: jaDataTable,
    cryptoDashboard: jaCryptoDashboard,
  },
  ar: {
    common: arCommon,
    errors: arErrors,
    home: arHome,
    contact: arContact,
    about: arAbout,
    projects: arProjects,
    githubDashboard: arGithubDashboard,
    dataTable: arDataTable,
    cryptoDashboard: arCryptoDashboard,
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
