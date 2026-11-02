import { create } from 'zustand';
import { Language, setLanguage } from '@/lang';
import { APP_STORAGE_KEYS } from '@/config/constants';

type ThemeMode = 'light' | 'dark';

interface AppConfigState {
  theme: ThemeMode;
  language: Language;
  setTheme: (theme: ThemeMode) => void;
  changeLanguage: (lang: Language) => void;
}

export const useAppConfigStore = create<AppConfigState>((set) => ({
  theme: 'light',
  language:
    typeof window !== 'undefined'
      ? ((localStorage.getItem(APP_STORAGE_KEYS.LANGUAGE) as Language) || 'es')
      : 'es',
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem(APP_STORAGE_KEYS.THEME, theme);
    set({ theme });
  },
  changeLanguage: (language: Language) => {
    localStorage.setItem(APP_STORAGE_KEYS.LANGUAGE, language);
    setLanguage(language);
    set({ language });
  },
}));
