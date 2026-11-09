import React from 'react';
import { BarcodeScannerModal } from '@/componentes';
import { useStockEntryForm } from '../../hooks/useStockEntryForm';
import { StockEntryHeader } from '../../components/StockEntryHeader';
import { StockEntryProductDataCard } from '../../components/StockEntryProductDataCard';
import { StockEntryPricingCard } from '../../components/StockEntryPricingCard';
import { StockEntrySummaryCard } from '../../components/StockEntrySummaryCard';

export const StockEntryScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    isSubmitting,
    isFormValid,
    metrics,
    watchedQuantity,
    imageUrl,
    imageId,
    images,
    scanner,
    actions,
  } = useStockEntryForm();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <StockEntryHeader onBack={actions.handleReturn} />

      <form
        onSubmit={handleSubmit(actions.onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <StockEntryProductDataCard
            control={control}
            existingProduct={metrics.existingProduct}
            imageUrl={imageUrl}
            imageId={imageId}
            images={images}
            onImageChange={actions.handleImageChange}
            onOpenScanner={scanner.openScanner}
            onBarcodeChange={actions.handleBarcodeChange}
          />

          <StockEntryPricingCard
            control={control}
            quantity={watchedQuantity}
            unitProfit={metrics.unitProfit}
            marginPercent={metrics.marginPercent}
            onQuickAddQty={actions.handleQuickAddQty}
            onIncrementQty={actions.handleIncrementQty}
            onDecrementQty={actions.handleDecrementQty}
          />
        </div>

        <StockEntrySummaryCard
          metrics={metrics}
          quantity={watchedQuantity}
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          onCancel={actions.handleReturn}
        />
      </form>

      <BarcodeScannerModal
        isOpen={scanner.isOpen}
        onClose={scanner.closeScanner}
        onScan={scanner.handleScanned}
      />
    </div>
  );
};
