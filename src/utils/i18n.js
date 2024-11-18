import en from "../locales/en.js";
import tr from "../locales/tr.js";

const translations = {
  en,
  tr,
};

let currentLang = "en";

export function setLanguage(lang) {
  currentLang = lang;
  document.dispatchEvent(new CustomEvent("language-changed"));
}

export function translate(key) {
  return translations[currentLang][key] || key;
}
