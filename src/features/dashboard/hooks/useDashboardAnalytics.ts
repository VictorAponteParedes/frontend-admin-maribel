import { useMemo } from 'react';
import { useSalesStore } from '@/store/useSalesStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import {
  BrandSaleShare,
  RevenueEvolutionData,
  RevenuePoint,
} from '@/features/dashboard/types/dashboard.types';

export const useDashboardAnalytics = () => {
  const sales = useSalesStore((state) => state.sales);
  const orders = useOrdersStore((state) => state.orders);

  // Compute brand sales distribution
  const brandSales = useMemo<BrandSaleShare[]>(() => {
    // Baseline distribution reflecting the monthly store metrics
    const baselineAmounts: Record<string, number> = {
      'Cool Girl Fragrance': 1650000,
      'Story of Flower': 897000,
      'Look Girl Fragrances': 552000,
      'Otras Marcas / Acc.': 345000,
    };

    // Add sales from sales store
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const brandUpper = item.brand.toUpperCase();
        if (brandUpper.includes('COOL GIRL')) {
          baselineAmounts['Cool Girl Fragrance'] += item.subtotal;
        } else if (brandUpper.includes('STORY OF FLOWER')) {
          baselineAmounts['Story of Flower'] += item.subtotal;
        } else if (brandUpper.includes('LOOK GIRL')) {
          baselineAmounts['Look Girl Fragrances'] += item.subtotal;
        } else {
          baselineAmounts['Otras Marcas / Acc.'] += item.subtotal;
        }
      });
    });

    // Add orders from orders store
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const brandUpper = item.brand.toUpperCase();
        if (brandUpper.includes('COOL GIRL')) {
          baselineAmounts['Cool Girl Fragrance'] += item.subtotal;
        } else if (brandUpper.includes('STORY OF FLOWER')) {
          baselineAmounts['Story of Flower'] += item.subtotal;
        } else if (brandUpper.includes('LOOK GIRL')) {
          baselineAmounts['Look Girl Fragrances'] += item.subtotal;
        } else {
          baselineAmounts['Otras Marcas / Acc.'] += item.subtotal;
        }
      });
    });

    const totalRevenue = Object.values(baselineAmounts).reduce(
      (acc, val) => acc + val,
      0
    );

    const brandConfigs: Record<
      string,
      { id: string; color: string }
    > = {
      'Cool Girl Fragrance': { id: 'cool-girl', color: '#880E2B' },
      'Story of Flower': { id: 'story-of-flower', color: '#A20D32' },
      'Look Girl Fragrances': { id: 'look-girl', color: '#DEC0B9' },
      'Otras Marcas / Acc.': { id: 'other-brands', color: '#D4D4D8' },
    };

    const result: BrandSaleShare[] = Object.entries(baselineAmounts).map(
      ([brand, amount]) => {
        const percentage = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
        return {
          id: brandConfigs[brand]?.id || brand,
          brand,
          amount,
          percentage,
          color: brandConfigs[brand]?.color || '#A8A29E',
        };
      }
    );

    // Sort descending by amount
    return result.sort((a, b) => b.amount - a.amount);
  }, [sales, orders]);

  // Compute Revenue evolution comparison
  const revenueEvolution = useMemo<RevenueEvolutionData>(() => {
    // Current points along the month timeline
    const basePoints: RevenuePoint[] = [
      {
        id: 'p-01',
        dayLabel: '01 Nov',
        fullDate: 'Viernes, 01 Nov',
        current: 125000,
        previous: 160000,
        changeVsAvg: '-12% vs promedio semanal',
      },
      {
        id: 'p-06',
        dayLabel: '06 Nov',
        fullDate: 'Miércoles, 06 Nov',
        current: 215000,
        previous: 185000,
        changeVsAvg: '+4% vs promedio semanal',
      },
      {
        id: 'p-11',
        dayLabel: '11 Nov',
        fullDate: 'Lunes, 11 Nov',
        current: 285000,
        previous: 245000,
        changeVsAvg: '+8% vs promedio semanal',
      },
      {
        id: 'p-16',
        dayLabel: '16 Nov',
        fullDate: 'Sábado, 16 Nov',
        current: 410000,
        previous: 320000,
        changeVsAvg: '+15% vs promedio semanal',
      },
      {
        id: 'p-21',
        dayLabel: '21 Nov (Pico)',
        fullDate: 'Sábado, 21 Nov',
        current: 485000,
        previous: 380000,
        isPeak: true,
        changeVsAvg: '+22% vs promedio semanal',
      },
      {
        id: 'p-26',
        dayLabel: '26 Nov',
        fullDate: 'Jueves, 26 Nov',
        current: 440000,
        previous: 410000,
        changeVsAvg: '+11% vs promedio semanal',
      },
      {
        id: 'p-30',
        dayLabel: '30 Nov',
        fullDate: 'Lunes, 30 Nov',
        current: 495000,
        previous: 430000,
        changeVsAvg: '+18% vs promedio semanal',
      },
    ];

    // Find peak point
    let peak = basePoints[0];
    basePoints.forEach((pt) => {
      if (pt.current > peak.current) {
        peak = pt;
      }
    });

    const topBrand = brandSales[0]?.brand || 'Cool Girl';

    return {
      currencyBadge: 'COP ($)',
      currentPeriodLabel: 'Noviembre actual',
      previousPeriodLabel: 'Mes anterior',
      points: basePoints,
      peakDay: {
        dayName: 'Sábado',
        amount: peak.current,
        topBrand: topBrand.replace(' Fragrance', ''),
      },
      lastUpdatedText: 'Actualizado hace 3 min',
    };
  }, [brandSales]);

  return {
    brandSales,
    revenueEvolution,
  };
};
