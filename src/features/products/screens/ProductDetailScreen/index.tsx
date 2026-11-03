import React from 'react';
import { useProductDetail } from '../../hooks/useProductDetail';
import { ProductDetailNotFound } from '../../components/ProductDetailNotFound';
import { ProductDetailHeaderNav } from '../../components/ProductDetailHeaderNav';
import { ProductDetailHero } from '../../components/ProductDetailHero';
import { ProductDetailFinancialCards } from '../../components/ProductDetailFinancialCards';
import { ProductDetailStockBalance } from '../../components/ProductDetailStockBalance';
import { ProductDetailEntriesTable } from '../../components/ProductDetailEntriesTable';

export const ProductDetailScreen: React.FC = () => {
  const { product, metrics, productEntries, actions } = useProductDetail();

  if (!product) {
    return <ProductDetailNotFound onBack={actions.handleBackToInventory} />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <ProductDetailHeaderNav
        onBack={actions.handleBackToInventory}
        onRecordEntry={actions.handleRecordEntry}
      />

      <ProductDetailHero product={product} />

      <ProductDetailFinancialCards product={product} metrics={metrics} />

      <ProductDetailStockBalance product={product} metrics={metrics} />

      <ProductDetailEntriesTable entries={productEntries} />
    </div>
  );
};
