export const RoutesView = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SALES: '/sales',
  SALE_DETAIL: '/sales/:id',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  STOCK_ENTRY: '/products/stock-entry',
  WEB_CATALOG: '/web-catalog',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  CUSTOMERS: '/customers',
  USERS: '/users',
  SETTINGS: '/settings',
  SETTINGS_STORE: '/settings/store',
  SETTINGS_INVENTORY: '/settings/inventory',
  SETTINGS_WHATSAPP: '/settings/whatsapp',

  // Dynamic route helpers
  saleDetail: (id: string | number) => `/sales/${id}`,
  productDetail: (id: string | number) => `/products/${id}`,
  orderDetail: (id: string | number) => `/orders/${id}`,
} as const;
