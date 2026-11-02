import i18n from './i18n';
export { useTranslation } from 'react-i18next';
export { default as i18n } from './i18n';

export type Language = 'es' | 'en';

export const setLanguage = (lang: Language): void => {
  i18n.changeLanguage(lang);
};

export const getLanguage = (): Language => {
  return (i18n.language as Language) || 'es';
};

export const t = (key: string, options?: Record<string, unknown>): string => {
  return i18n.t(key, options);
};

export default i18n;
