import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import FirebaseService from '~/services/FirebaseService';

import translationAR from './locales/ar.json';
import translationEN from './locales/en.json';

// the translations
const resources = {
  ar: {
    translation: translationAR,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en', // use en if detected lng is not available
    // keySeparator: true, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    supportedLngs: Object.keys(resources),
  });
let language = i18n.language;
FirebaseService.setUserLanguagePreference(language);
export default i18n;
