import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

export interface StockEntryModalFooterProps {
  quantity: number;
  isSubmitting: boolean;
  isDisabled: boolean;
  onClose: () => void;
}

export const StockEntryModalFooter: React.FC<StockEntryModalFooterProps> = ({
  quantity,
  isSubmitting,
  isDisabled,
  onClose,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="pt-2 flex items-center justify-end space-x-3">
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={onClose}
      >
        {t('common.cancel')}
      </Button>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={isDisabled || isSubmitting}
        isLoading={isSubmitting}
        leftIcon={<Check className="w-4 h-4 stroke-[2.5]" />}
      >
        {t('entry.confirmEntry', { count: quantity })}
      </Button>
    </div>
  );
};
