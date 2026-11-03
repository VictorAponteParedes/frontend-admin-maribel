import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Minus, Plus, DollarSign, ShoppingCart } from 'lucide-react';
import { AppInput, ControlledInput, DatePickerInput, Button } from '@/components/ui';
import { formatCurrency, formatGuarani, parseGuarani } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { StockEntryFormValues } from '../types/stockEntry.types';

export interface StockEntryPricingCardProps {
  control: Control<StockEntryFormValues>;
  quantity: number;
  unitProfit: number;
  marginPercent: number;
  onQuickAddQty: (qty: number) => void;
  onIncrementQty: () => void;
  onDecrementQty: () => void;
}

export const StockEntryPricingCard: React.FC<StockEntryPricingCardProps> = ({
  control,
  quantity,
  unitProfit,
  marginPercent,
  onQuickAddQty,
  onIncrementQty,
  onDecrementQty,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  const {
    field: quantityField,
  } = useController({
    name: 'quantity',
    control,
    rules: { min: { value: 1, message: t('entry.errors.quantityPositive') } },
  });

  const {
    field: costPriceField,
    fieldState: { error: costPriceError },
  } = useController({
    name: 'costPrice',
    control,
    rules: { min: { value: 1, message: t('entry.errors.costPositive') } },
  });

  const {
    field: sellingPriceField,
    fieldState: { error: sellingPriceError },
  } = useController({
    name: 'sellingPrice',
    control,
    rules: { min: { value: 1, message: t('entry.errors.salePositive') } },
  });

  const {
    field: dateField,
    fieldState: { error: dateError },
  } = useController({
    name: 'receptionDate',
    control,
  });

  const currentCost = Number(costPriceField.value) || 0;
  const currentSale = Number(sellingPriceField.value) || 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
      <h3 className="font-serif font-bold text-stone-900 text-sm pb-2 border-b border-stone-100">
        {t('entry.quantitiesPricesTitle')}
      </h3>

      {/* Selector de cantidad con stepper y botones rápidos */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-stone-800">
            {t('entry.qtyToEnter')}
          </label>
          <span className="text-[11px] text-stone-400">{t('entry.standardPack')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:ring-2 focus-within:ring-maribel-600/20 focus-within:border-maribel-600 focus-within:bg-white transition-all">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDecrementQty}
              disabled={Number(quantityField.value) <= 1}
              className="rounded-none px-4 py-2.5 text-stone-500 hover:text-stone-900"
            >
              <Minus className="w-4 h-4" />
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
              className="rounded-none px-4 py-2.5 text-stone-500 hover:text-stone-900"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant={quantity === 6 ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => onQuickAddQty(6)}
              className={quantity === 6 ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold' : ''}
            >
              +6
            </Button>
            <Button
              type="button"
              variant={quantity === 12 ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => onQuickAddQty(12)}
              className={quantity === 12 ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold' : ''}
            >
              {t('entry.boxTag')}
            </Button>
            <Button
              type="button"
              variant={quantity === 24 ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => onQuickAddQty(24)}
              className={quantity === 24 ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold' : ''}
            >
              {t('entry.masterTag')}
            </Button>
          </div>
        </div>
      </div>

      {/* Fila Financiera: Precio Compra vs Precio Venta vs Ganancia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Precio Compra */}
        <div>
          <label className="text-xs font-semibold text-stone-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <span>{t('entry.purchasePriceLabel')}</span>
              <span className="text-rose-500">*</span>
            </span>
            <DollarSign className="w-3.5 h-3.5 text-stone-400" />
          </label>
          <AppInput
            prefixText="Gs."
            value={currentCost > 0 ? formatGuarani(currentCost) : ''}
            onChange={(e) => costPriceField.onChange(parseGuarani(e.target.value))}
            placeholder="0"
            error={costPriceError?.message}
            className="font-semibold text-sm"
          />
          <p className="text-[11px] text-stone-400 mt-1">{t('entry.purchasePriceDesc')}</p>
        </div>

        {/* Precio Venta */}
        <div>
          <label className="text-xs font-semibold text-stone-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <span>{t('entry.sellingPriceLabel')}</span>
              <span className="text-rose-500">*</span>
            </span>
            <ShoppingCart className="w-3.5 h-3.5 text-maribel-700" />
          </label>
          <AppInput
            prefixText="Gs."
            value={currentSale > 0 ? formatGuarani(currentSale) : ''}
            onChange={(e) => sellingPriceField.onChange(parseGuarani(e.target.value))}
            placeholder="0"
            error={sellingPriceError?.message}
            className="font-bold text-sm"
          />
          <p className="text-[11px] text-stone-400 mt-1">{t('entry.sellingPriceDesc')}</p>
        </div>

        {/* Ganancia Unitaria calculada */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                {t('entry.profitPerUnit')}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ~{marginPercent}%
              </span>
            </div>
            <p className="text-lg font-bold font-serif text-emerald-800 mt-1">
              +{formatCurrency(unitProfit)}
            </p>
          </div>
          <p className="text-[10px] text-emerald-700/80 font-medium">
            {currentCost > 0 && currentSale > 0
              ? t('entry.gainPerBottle', { profit: formatCurrency(unitProfit) })
              : t('entry.enterPurchaseSale')}
          </p>
        </div>
      </div>

      {/* Fecha de Recepción y Lote */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <DatePickerInput
            label={t('entry.receptionDate')}
            value={dateField.value || ''}
            onChange={dateField.onChange}
            error={dateError?.message}
          />
        </div>

        <div>
          <ControlledInput
            name="batchNumber"
            control={control}
            label={t('entry.batchNumber')}
            placeholder="LOT-2026-FRAG-B42"
            className="font-mono uppercase"
          />
        </div>
      </div>
    </div>
  );
};
