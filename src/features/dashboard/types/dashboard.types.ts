export interface DashboardMetric {
  id: string;
  titleKey: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface RevenuePoint {
  id: string;
  dayLabel: string;
  fullDate: string;
  current: number;
  previous: number;
  isPeak?: boolean;
  changeVsAvg?: string;
}

export interface BrandSaleShare {
  id: string;
  brand: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface RevenueEvolutionData {
  currencyBadge: string;
  currentPeriodLabel: string;
  previousPeriodLabel: string;
  points: RevenuePoint[];
  peakDay: {
    dayName: string;
    amount: number;
    topBrand: string;
  };
  lastUpdatedText: string;
}
