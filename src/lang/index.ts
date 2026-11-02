import es from '@/lang/es.json';
import en from '@/lang/en.json';

export type Language = 'es' | 'en';

type TranslationRecord = Record<string, unknown>;

const dictionaries: Record<Language, TranslationRecord> = { es, en };

let currentLanguage: Language = 'es';

export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
};

export const getLanguage = (): Language => currentLanguage;

/**
 * Access nested dictionary keys like t('dashboard.title')
 */
export const t = (path: string): string => {
  const dictionary = dictionaries[currentLanguage] ?? dictionaries.es;
  const keys = path.split('.');

  let current: unknown = dictionary;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as TranslationRecord)[key];
    } else {
      return path;
    }
  }

  return typeof current === 'string' ? current : path;
};
