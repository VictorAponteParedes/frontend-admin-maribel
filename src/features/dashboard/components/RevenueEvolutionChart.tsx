import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { RevenueEvolutionData, RevenuePoint } from '@/features/dashboard/types/dashboard.types';

export interface RevenueEvolutionChartProps {
  data: RevenueEvolutionData;
}

export const RevenueEvolutionChart: React.FC<RevenueEvolutionChartProps> = ({ data }) => {
  const { points, peakDay, currencyBadge, currentPeriodLabel, previousPeriodLabel, lastUpdatedText } = data;

  // Find index of the peak or default to 4 (pico)
  const defaultHoverIndex = points.findIndex((p) => p.isPeak);
  const [hoveredIndex, setHoveredIndex] = useState<number>(defaultHoverIndex >= 0 ? defaultHoverIndex : 4);

  // SVG Coordinate mapping
  const width = 760;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const bottomY = height - paddingBottom;

  const maxVal = 500000;
  const yTicks = [500000, 375000, 250000, 125000, 0];

  const getX = (index: number) => {
    return paddingLeft + (index / (points.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const ratio = Math.min(1, Math.max(0, val / maxVal));
    return bottomY - ratio * chartHeight;
  };

  // Coordinates for curves
  const currentPts = points.map((p, idx) => ({ x: getX(idx), y: getY(p.current) }));
  const prevPts = points.map((p, idx) => ({ x: getX(idx), y: getY(p.previous) }));

  // Helper to build smooth S-curve cubic bezier
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const mx = (p0.x + p1.x) / 2;
      path += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const currentLinePath = buildSmoothPath(currentPts);
  const prevLinePath = buildSmoothPath(prevPts);
  const currentAreaPath = `${currentLinePath} L ${currentPts[currentPts.length - 1].x} ${bottomY} L ${currentPts[0].x} ${bottomY} Z`;

  const formatCurrency = (val: number) => {
    return `$ ${val.toLocaleString('es-CO')}`;
  };

  const activePoint: RevenuePoint = points[hoveredIndex] || points[defaultHoverIndex];
  const activeCoord = currentPts[hoveredIndex] || currentPts[defaultHoverIndex];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-sm flex flex-col justify-between transition-all duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight font-sans">
              Evolución de Ingresos & Ventas
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff1f2] text-[#880E2B] border border-[#fecdd3]">
              {currencyBadge}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Comparativa del período actual vs. período anterior
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#880E2B] inline-block shadow-sm" />
            <span className="font-medium text-neutral-700">{currentPeriodLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 border-b-2 border-dashed border-neutral-400 inline-block" />
            <span className="font-medium text-neutral-400">{previousPeriodLabel}</span>
          </div>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="relative w-full overflow-hidden select-none">
        {/* Active Tooltip Popover */}
        {activePoint && activeCoord && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-200 ease-out -translate-x-1/2"
            style={{
              left: `${(activeCoord.x / width) * 100}%`,
              top: `${Math.max(10, activeCoord.y - 75)}px`,
            }}
          >
            <div className="bg-[#18181b] text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-neutral-800 text-left min-w-[170px]">
              <p className="text-[11px] font-medium text-neutral-300">
                {activePoint.fullDate}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#e11d48]" />
                <span className="text-sm font-bold tracking-tight text-white">
                  {formatCurrency(activePoint.current)}
                </span>
              </div>
              {activePoint.changeVsAvg && (
                <div className="mt-1">
                  <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    {activePoint.changeVsAvg}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SVG Curve & Grids */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="burgundyAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#880E2B" stopOpacity="0.28" />
              <stop offset="45%" stopColor="#880E2B" stopOpacity="0.12" />
              <stop offset="90%" stopColor="#880E2B" stopOpacity="0.01" />
              <stop offset="100%" stopColor="#880E2B" stopOpacity="0.0" />
            </linearGradient>

            <filter id="dotGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#880E2B" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Horizontal Grid lines and Y-Axis Labels */}
          {yTicks.map((val) => {
            const y = getY(val);
            const label = val === 0 ? '$ 0' : `$ ${val / 1000}k`;
            return (
              <g key={val}>
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-neutral-400 text-[11px] font-medium"
                >
                  {label}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f1f2"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Area under current month */}
          <path
            d={currentAreaPath}
            fill="url(#burgundyAreaGrad)"
            className="transition-all duration-300"
          />

          {/* Previous Month Dashed Line */}
          <path
            d={prevLinePath}
            fill="none"
            stroke="#C4A4A9"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="transition-all duration-300"
          />

          {/* Current Month Solid Burgundy Curve */}
          <path
            d={currentLinePath}
            fill="none"
            stroke="#880E2B"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Interactive vertical guide line & dots */}
          {currentPts.map((pt, idx) => {
            const isHovered = idx === hoveredIndex;
            const isPeak = points[idx].isPeak;
            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(idx)}>
                {/* Transparent wider target for hover */}
                <rect
                  x={pt.x - 20}
                  y={paddingTop}
                  width="40"
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Vertical guide on hovered */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={bottomY}
                    stroke="#880E2B"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    strokeOpacity="0.4"
                  />
                )}

                {/* Point circle */}
                {(isHovered || isPeak) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4.5}
                    fill={isHovered ? '#880E2B' : '#ffffff'}
                    stroke="#880E2B"
                    strokeWidth={isHovered ? 3 : 2}
                    filter={isHovered ? 'url(#dotGlow)' : undefined}
                    className="transition-all duration-150"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between items-center px-2 pt-2 text-xs">
          {points.map((pt, idx) => {
            const isPeak = pt.isPeak;
            const isHovered = idx === hoveredIndex;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => setHoveredIndex(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`text-center focus:outline-none transition-colors ${
                  isPeak
                    ? 'font-bold text-[#880E2B]'
                    : isHovered
                    ? 'font-semibold text-neutral-800'
                    : 'text-neutral-400 font-medium'
                }`}
              >
                {pt.dayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Note and Timestamp */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-neutral-600">
          <TrendingUp className="w-4 h-4 text-[#880E2B] shrink-0" />
          <span>
            Mejor día del ciclo:{' '}
            <strong className="text-neutral-900 font-semibold">
              {peakDay.dayName} ({formatCurrency(peakDay.amount)})
            </strong>{' '}
            impulsado por fragancias {peakDay.topBrand}.
          </span>
        </div>
        <span className="text-neutral-400 text-xs">
          {lastUpdatedText}
        </span>
      </div>
    </div>
  );
};
