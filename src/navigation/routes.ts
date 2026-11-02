export const RoutesView = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SALES: '/sales',
  SALE_DETAIL: '/sales/:id',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  CUSTOMERS: '/customers',
  USERS: '/users',
  SETTINGS: '/settings',

  // Dynamic route helpers
  saleDetail: (id: string | number) => `/sales/${id}`,
  productDetail: (id: string | number) => `/products/${id}`,
  orderDetail: (id: string | number) => `/orders/${id}`,
} as const;
