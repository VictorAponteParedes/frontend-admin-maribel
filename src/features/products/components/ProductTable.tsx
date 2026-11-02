import React from 'react';
import { Product } from '@/features/products/types/product.types';
import { Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';

export interface ProductTableProps {
  products: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-100">
          <tr>
            <th className="px-5 py-3">{t('products.name')}</th>
            <th className="px-5 py-3">{t('products.brand')}</th>
            <th className="px-5 py-3">{t('products.category')}</th>
            <th className="px-5 py-3">{t('products.price')}</th>
            <th className="px-5 py-3">{t('products.stock')}</th>
            <th className="px-5 py-3">{t('common.status')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
              <td className="px-5 py-3.5 font-medium text-stone-800">
                {product.name}
              </td>
              <td className="px-5 py-3.5 text-stone-500">{product.brand}</td>
              <td className="px-5 py-3.5 text-stone-500">{product.category}</td>
              <td className="px-5 py-3.5 font-semibold text-stone-800">
                {formatCurrency(product.price)}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full font-semibold ${
                    product.stock <= 3
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {product.stock} {t('products.units')}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <Badge variant={product.isActive ? 'success' : 'neutral'}>
                  {product.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
