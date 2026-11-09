export enum Permission {
  // Métricas y Dashboard
  DASHBOARD_VIEW = 'dashboard:view',

  // Productos e Inventario
  PRODUCTS_VIEW = 'products:view',
  PRODUCTS_CREATE = 'products:create',
  PRODUCTS_UPDATE = 'products:update',
  PRODUCTS_DELETE = 'products:delete',

  // Categorías y Marcas
  CATEGORIES_MANAGE = 'categories:manage',

  // Combos
  COMBOS_VIEW = 'combos:view',
  COMBOS_MANAGE = 'combos:manage',

  // Ventas (POS)
  SALES_VIEW = 'sales:view',
  SALES_CREATE = 'sales:create',
  SALES_CANCEL = 'sales:cancel',

  // Pedidos / Envíos
  ORDERS_VIEW = 'orders:view',
  ORDERS_UPDATE = 'orders:update',
  ORDERS_DELETE = 'orders:delete',

  // Clientes
  CUSTOMERS_VIEW = 'customers:view',
  CUSTOMERS_MANAGE = 'customers:manage',

  // Configuración Web & Tienda
  SETTINGS_VIEW = 'settings:view',
  SETTINGS_UPDATE = 'settings:update',

  // Gestión de Usuarios y Roles
  USERS_VIEW = 'users:view',
  USERS_MANAGE = 'users:manage',

  // Archivos
  FILES_UPLOAD = 'files:upload',
}
