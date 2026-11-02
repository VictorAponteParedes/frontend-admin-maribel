import React from 'react';
import { Globe } from 'lucide-react';
import { useAppConfigStore } from '@/store/useAppConfigStore';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, action }) => {
  const { language, changeLanguage } = useAppConfigStore();

  const toggleLanguage = () => {
    changeLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-stone-500 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-600 hover:bg-stone-50"
          title="Switch language"
        >
          <Globe className="w-3.5 h-3.5 text-stone-400" />
          <span className="uppercase">{language}</span>
        </button>

        {action}
      </div>
    </header>
  );
};
