import React from 'react';
import { BarcodeScannerModal } from '@/componentes';
import { useStockEntryModal } from '../../hooks/useStockEntryModal';
import { StockEntryModalHeader } from './StockEntryModalHeader';
import { StockEntryModalProductSelector } from './StockEntryModalProductSelector';
import { StockEntryModalProductCard } from './StockEntryModalProductCard';
import { StockEntryModalPricing } from './StockEntryModalPricing';
import { StockEntryModalProjection } from './StockEntryModalProjection';
import { StockEntryModalFooter } from './StockEntryModalFooter';

export const StockEntryModal: React.FC = () => {
  const {
    isOpen,
    control,
    handleSubmit,
    isSubmitting,
    selectedProduct,
    catalogProducts,
    metrics,
    scanner,
    actions,
  } = useStockEntryModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-stone-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <StockEntryModalHeader
          batchNumber={metrics.watchedBatchNumber}
          onClose={actions.onClose}
        />

        <form onSubmit={handleSubmit(actions.onSubmit)} className="p-6 space-y-5">
          <StockEntryModalProductSelector
            control={control}
            selectedProduct={selectedProduct}
            catalogProducts={catalogProducts}
            onOpenScanner={scanner.openScanner}
            onSelectQuickProduct={actions.handleSelectQuickProduct}
          />

          <StockEntryModalProductCard product={selectedProduct} />

          <StockEntryModalPricing
            control={control}
            quantity={metrics.watchedQuantity}
            unitCost={metrics.watchedUnitCost}
            estimatedMargin={metrics.estimatedMargin}
            selectedProduct={selectedProduct}
            onQuickAddQty={actions.handleQuickAddQty}
            onIncrementQty={actions.handleIncrementQty}
            onDecrementQty={actions.handleDecrementQty}
          />

          <StockEntryModalProjection
            existingStock={metrics.existingStock}
            quantity={metrics.watchedQuantity}
            projectedStock={metrics.projectedStock}
            totalCost={metrics.totalCost}
          />

          <StockEntryModalFooter
            quantity={metrics.watchedQuantity}
            isSubmitting={isSubmitting}
            isDisabled={!selectedProduct || metrics.watchedQuantity <= 0}
            onClose={actions.onClose}
          />
        </form>
      </div>

      <BarcodeScannerModal
        isOpen={scanner.isOpen}
        onClose={scanner.closeScanner}
        onScan={scanner.handleScanned}
      />
    </div>
  );
};
