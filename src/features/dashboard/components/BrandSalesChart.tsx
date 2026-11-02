import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { BrandSaleShare } from '@/features/dashboard/types/dashboard.types';

export interface BrandSalesChartProps {
  data: BrandSaleShare[];
}

export const BrandSalesChart: React.FC<BrandSalesChartProps> = ({ data }) => {
  const topBrand = data[0] || {
    id: 'cool-girl',
    brand: 'Cool Girl Fragrance',
    percentage: 48,
    amount: 1650000,
    color: '#880E2B',
  };

  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);

  const selectedItem = data.find((d) => d.id === activeBrandId) || topBrand;

  // Donut geometry
  const size = 200;
  const center = size / 2;
  const radius = 68;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const formatCompactAmount = (amount: number): string => {
    if (amount >= 1000000) {
      const inMillions = (amount / 1000000).toFixed(2).replace(/\.00$/, '');
      return `$ ${inMillions}M`;
    }
    if (amount >= 1000) {
      return `$ ${Math.round(amount / 1000)}K`;
    }
    return `$ ${amount.toLocaleString('es-CO')}`;
  };

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const segments = data.map((item) => {
    const strokeDash = (item.percentage / 100) * circumference;
    const strokeOffset = (accumulatedPercent / 100) * circumference;
    accumulatedPercent += item.percentage;

    return {
      ...item,
      strokeDash,
      strokeOffset,
    };
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-sm flex flex-col justify-between h-full transition-all duration-200">
      {/* Top Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight font-sans">
            Ventas por Marca
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Participación en facturación mensual
          </p>
        </div>
        <button
          type="button"
          aria-label="Opciones"
          className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Donut Chart Graphic */}
      <div className="relative flex items-center justify-center my-3">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="select-none"
        >
          <g transform={`rotate(-90 ${center} ${center})`}>
            {segments.map((seg) => {
              const isSelected = selectedItem.id === seg.id;
              const gap = 3; // Gap between slices
              const visibleDash = Math.max(0, seg.strokeDash - gap);

              return (
                <circle
                  key={seg.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${visibleDash} ${circumference - visibleDash}`}
                  strokeDashoffset={-seg.strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveBrandId(seg.id)}
                  onMouseLeave={() => setActiveBrandId(null)}
                />
              );
            })}
          </g>
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase mb-0.5">
            {activeBrandId ? 'PARTICIPACIÓN' : 'TOP VENTAS'}
          </span>
          <span className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
            {selectedItem.percentage}%
          </span>
          <span className="text-xs font-semibold text-[#880E2B] mt-1 line-clamp-1 max-w-[100px]">
            {selectedItem.brand.replace(' Fragrance', '').replace(' Fragrances', '')}
          </span>
        </div>
      </div>

      {/* Legend Rows */}
      <div className="space-y-3 mt-4 pt-3 border-t border-neutral-100">
        {data.map((item) => {
          const isSelected = selectedItem.id === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveBrandId(item.id)}
              onMouseLeave={() => setActiveBrandId(null)}
              className={`flex items-center justify-between py-1 px-2 rounded-xl cursor-pointer transition-colors ${
                isSelected ? 'bg-neutral-50' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-neutral-700 truncate">
                  {item.brand}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-neutral-900">
                  {item.percentage}%
                </span>
                <span className="text-xs text-neutral-400 font-normal">
                  ({formatCompactAmount(item.amount)})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
