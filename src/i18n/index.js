import { store } from '../store/index.js';
import en from './en.js';
import tr from './tr.js';

const translations = {
  en,
  tr,
};

export function translate(key, overrideLang) {
  const lang = overrideLang || store.getState().localization.currentLang;
  return translations[lang]?.[key] || key;
}
