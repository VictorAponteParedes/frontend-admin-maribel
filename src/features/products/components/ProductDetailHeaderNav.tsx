import React from 'react';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

export interface ProductDetailHeaderNavProps {
  onBack: () => void;
  onRecordEntry: () => void;
}

export const ProductDetailHeaderNav: React.FC<ProductDetailHeaderNavProps> = ({
  onBack,
  onRecordEntry,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={onBack}
        className="w-fit"
      >
        {t('detail.backButton')}
      </Button>

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          leftIcon={<PackagePlus className="w-4 h-4" />}
          onClick={onRecordEntry}
        >
          {t('detail.recordEntry')}
        </Button>
      </div>
    </div>
  );
};
