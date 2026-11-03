import React from 'react';
import { Receipt, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

interface SalesTabsHeaderProps {
  activeTab: 'summary' | 'detailed';
  onTabChange: (tab: 'summary' | 'detailed') => void;
  summaryCount: number;
  detailedCount: number;
}

export const SalesTabsHeader: React.FC<SalesTabsHeaderProps> = ({
  activeTab,
  onTabChange,
  summaryCount,
  detailedCount,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="px-5 pt-4 pb-0 border-b border-stone-200 flex items-center justify-between flex-wrap gap-3 bg-stone-50/50">
      <div className="flex space-x-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onTabChange('summary')}
          leftIcon={<Receipt className="w-4 h-4" />}
          className={`py-2.5 px-4 font-semibold rounded-b-none rounded-t-xl border-b-2 transition-all ${
            activeTab === 'summary'
              ? 'border-maribel-700 !text-maribel-800 !bg-white shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>{t('tabs.summary', { count: summaryCount })}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onTabChange('detailed')}
          leftIcon={<ListOrdered className="w-4 h-4" />}
          className={`py-2.5 px-4 font-semibold rounded-b-none rounded-t-xl border-b-2 transition-all ${
            activeTab === 'detailed'
              ? 'border-maribel-700 !text-maribel-800 !bg-white shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>{t('tabs.detailed', { count: detailedCount })}</span>
        </Button>
      </div>

      <span className="text-[11px] text-stone-400 pb-2">
        {activeTab === 'summary' ? t('tabs.summaryHint') : t('tabs.detailedHint')}
      </span>
    </div>
  );
};
