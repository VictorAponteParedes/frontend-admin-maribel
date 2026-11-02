import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEs from './es/common.json';
import navEs from './es/nav.json';
import dashboardEs from './es/dashboard.json';
import salesEs from './es/sales.json';
import inventoryEs from './es/inventory.json';
import customersEs from './es/customers.json';
import ordersEs from './es/orders.json';

import commonEn from './en/common.json';
import navEn from './en/nav.json';
import dashboardEn from './en/dashboard.json';
import salesEn from './en/sales.json';
import inventoryEn from './en/inventory.json';
import customersEn from './en/customers.json';
import ordersEn from './en/orders.json';

import { APP_STORAGE_KEYS } from '@/config/constants';

export const defaultNS = 'translation';

const esTranslation = {
  common: commonEs,
  nav: navEs,
  dashboard: dashboardEs,
  sales: salesEs,
  inventory: inventoryEs,
  customers: customersEs,
  orders: ordersEs,
};

const enTranslation = {
  common: commonEn,
  nav: navEn,
  dashboard: dashboardEn,
  sales: salesEn,
  inventory: inventoryEn,
  customers: customersEn,
  orders: ordersEn,
};

export const resources = {
  es: {
    translation: esTranslation,
    common: commonEs,
    nav: navEs,
    dashboard: dashboardEs,
    sales: salesEs,
    inventory: inventoryEs,
    customers: customersEs,
    orders: ordersEs,
  },
  en: {
    translation: enTranslation,
    common: commonEn,
    nav: navEn,
    dashboard: dashboardEn,
    sales: salesEn,
    inventory: inventoryEn,
    customers: customersEn,
    orders: ordersEn,
  },
} as const;

const savedLanguage =
  typeof window !== 'undefined'
    ? (localStorage.getItem(APP_STORAGE_KEYS.LANGUAGE) as 'es' | 'en') || 'es'
    : 'es';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'es',
  defaultNS: 'translation',
  fallbackNS: ['translation', 'common', 'nav', 'dashboard', 'sales', 'inventory', 'customers', 'orders'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
