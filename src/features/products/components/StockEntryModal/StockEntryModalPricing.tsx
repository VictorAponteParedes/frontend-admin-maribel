import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Minus, Plus } from 'lucide-react';
import { AppInput, DatePickerInput, Button } from '@/components/ui';
import { formatCurrency, formatGuarani, parseGuarani } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { Product } from '../../types/product.types';
import { StockEntryModalFormValues } from '../../hooks/useStockEntryModal';

export interface StockEntryModalPricingProps {
  control: Control<StockEntryModalFormValues>;
  quantity: number;
  unitCost: number;
  estimatedMargin: number;
  selectedProduct?: Product;
  onQuickAddQty: (qty: number) => void;
  onIncrementQty: () => void;
  onDecrementQty: () => void;
}

export const StockEntryModalPricing: React.FC<StockEntryModalPricingProps> = ({
  control,
  quantity,
  unitCost,
  estimatedMargin,
  selectedProduct,
  onQuickAddQty,
  onIncrementQty,
  onDecrementQty,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  const { field: quantityField } = useController({
    name: 'quantity',
    control,
    rules: { min: { value: 1, message: t('entry.errors.quantityPositive') } },
  });

  const { field: unitCostField, fieldState: { error: costError } } = useController({
    name: 'unitCost',
    control,
    rules: { min: { value: 1, message: t('entry.errors.costPositive') } },
  });

  const { field: dateField } = useController({
    name: 'date',
    control,
  });

  return (
    <div className="space-y-4">
      {/* Fila: Cantidad recibida + Costo unitario (Gs.) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cantidad recibida */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-stone-800">
              {t('entry.qtyToEnter')}
            </label>
            <span className="text-[11px] text-stone-400">{t('entry.standardPack')}</span>
          </div>

          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:ring-2 focus-within:ring-maribel-600/20 focus-within:border-maribel-600 focus-within:bg-white transition-all">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDecrementQty}
              disabled={Number(quantityField.value) <= 1}
              className="rounded-none px-3.5 py-2.5 text-stone-500 hover:text-stone-900"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>

            <AppInput
              type="number"
              min={1}
              value={quantityField.value || 1}
              onChange={(e) => quantityField.onChange(Math.max(1, Number(e.target.value)))}
              className="w-full text-center py-2 text-sm font-bold text-stone-900 bg-transparent border-0 focus:ring-0 shadow-none"
              containerClassName="flex-1"
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onIncrementQty}
              className="rounded-none px-3.5 py-2.5 text-stone-500 hover:text-stone-900"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Botones de incremento rápido */}
          <div className="flex items-center space-x-1.5 mt-2">
            <Button
              type="button"
              variant={quantity === 6 ? 'outline' : 'secondary'}
              size="xs"
              onClick={() => onQuickAddQty(6)}
              className={quantity === 6 ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold' : ''}
            >
              +6
            </Button>
            <Button
              type="button"
              variant={quantity === 12 ? 'outline' : 'secondary'}
              size="xs"
              onClick={() => onQuickAddQty(12)}
              className={quantity === 12 ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold' : ''}
            >
              {t('entry.boxTag')}
            </Button>
            <Button
              type="button"
              variant={quantity === 24 ? 'outline' : 'secondary'}
              size="xs"
              onClick={() => onQuickAddQty(24)}
              className={quantity === 24 ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold' : ''}
            >
              {t('entry.masterTag')}
            </Button>
          </div>
        </div>

        {/* Costo unitario en Guaraníes (Gs.) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-stone-800">
              {t('entry.purchasePriceLabel')}
            </label>
            {estimatedMargin > 0 && (
              <span className="text-[11px] font-semibold text-maribel-700">
                {t('detail.marginTag', { margin: estimatedMargin })}
              </span>
            )}
          </div>

          <AppInput
            type="text"
            prefixText="Gs."
            value={unitCost > 0 ? formatGuarani(unitCost) : ''}
            onChange={(e) => unitCostField.onChange(parseGuarani(e.target.value))}
            placeholder="0"
            error={costError?.message}
            className="font-semibold text-sm"
          />

          {selectedProduct && (
            <p className="text-[11px] text-stone-400 mt-1.5">
              {t('entry.sellingPriceDesc')}:{' '}
              <strong className="text-stone-700 font-semibold">
                {formatCurrency(selectedProduct.price)}
              </strong>
            </p>
          )}
        </div>
      </div>

      {/* Fecha de recepción */}
      <div>
        <DatePickerInput
          label={t('entry.receptionDate')}
          value={dateField.value || ''}
          onChange={dateField.onChange}
          placeholder="DD/MM/AAAA"
        />
      </div>
    </div>
  );
};
