import React, { useState } from 'react';
import {
  ShieldAlert,
  Shield,
  UserCheck,
  Check,
  X,
  ShoppingBag,
  Package,
  Truck,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  Layers,
} from 'lucide-react';
import type { UserRole } from '@/store/useAuthStore';

interface RoleCapability {
  module: string;
  icon: React.ComponentType<{ className?: string }>;
  actions: Array<{
    name: string;
    description: string;
    admin: boolean;
    manager: boolean;
    staff: boolean;
  }>;
}

export const RolesMatrixView: React.FC = () => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole | 'ALL'>('ALL');

  const rolesInfo: Record<
    UserRole,
    {
      title: string;
      subtitle: string;
      icon: React.ComponentType<{ className?: string }>;
      color: string;
      badgeBg: string;
      badgeText: string;
      description: string;
      idealFor: string;
    }
  > = {
    ADMIN: {
      title: 'Super Administrador',
      subtitle: 'Acceso Total & Control Absoluto',
      icon: ShieldAlert,
      color: 'border-purple-300 bg-purple-50/40 text-purple-900',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      description:
        'Tiene privilegios irrestrictos sobre todos los módulos. Es el único perfil autorizado para gestionar usuarios, cambiar configuraciones críticas del sistema y eliminar registros históricos.',
      idealFor: 'Dueños del negocio, gerentes generales o socios principales.',
    },
    MANAGER: {
      title: 'Encargado de Tienda',
      subtitle: 'Gestión Operativa & Control de Stock',
      icon: Shield,
      color: 'border-blue-300 bg-blue-50/40 text-blue-900',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      description:
        'Supervisa la operación diaria: administra productos, ajusta existencias, crea combos y promociones, atiende devoluciones o anulación de ventas y consulta reportes operativos.',
      idealFor: 'Supervisores de sucursal, encargados de almacén o jefes de tienda.',
    },
    STAFF: {
      title: 'Vendedor / Cajero',
      subtitle: 'Atención al Cliente & Punto de Venta (POS)',
      icon: UserCheck,
      color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      description:
        'Enfocado en la venta rápida en mostrador: realiza cobros en el POS, registra clientes y da seguimiento a pedidos. Tiene bloqueado el acceso a costos, configuraciones del negocio y eliminación de datos.',
      idealFor: 'Cajeros, vendedores de mostrador y personal de atención.',
    },
  };

  const capabilities: RoleCapability[] = [
    {
      module: 'Ventas & Facturación (POS)',
      icon: ShoppingBag,
      actions: [
        {
          name: 'Registrar ventas en caja (POS)',
          description: 'Escanear productos, aplicar descuentos y cobrar a clientes.',
          admin: true,
          manager: true,
          staff: true,
        },
        {
          name: 'Consultar historial de ventas',
          description: 'Revisar ventas completadas del día y fechas pasadas.',
          admin: true,
          manager: true,
          staff: true,
        },
        {
          name: 'Anular o reembolsar ventas',
          description: 'Cancelar una venta ya registrada y devolver stock a inventario.',
          admin: true,
          manager: true,
          staff: false,
        },
      ],
    },
    {
      module: 'Productos, Precios & Inventario',
      icon: Package,
      actions: [
        {
          name: 'Consultar catálogo y stock disponible',
          description: 'Buscar fragancias, verificar disponibilidad y precios de venta.',
          admin: true,
          manager: true,
          staff: true,
        },
        {
          name: 'Crear nuevos productos y fragancias',
          description: 'Dar de alta perfumes, códigos de barra y detalles.',
          admin: true,
          manager: true,
          staff: false,
        },
        {
          name: 'Ajustar existencias (Entradas de stock)',
          description: 'Ingresar mercadería recibida de proveedores y lotes.',
          admin: true,
          manager: true,
          staff: false,
        },
        {
          name: 'Eliminar productos definitivamente',
          description: 'Dar de baja registros del catálogo general.',
          admin: true,
          manager: false,
          staff: false,
        },
      ],
    },
    {
      module: 'Promociones & Catálogo Web',
      icon: Layers,
      actions: [
        {
          name: 'Crear y editar Combos/Kits de regalo',
          description: 'Armar paquetes especiales de fragancias con precio promocional.',
          admin: true,
          manager: true,
          staff: false,
        },
        {
          name: 'Eliminar combos promocionales',
          description: 'Dar de baja permanentemente sets o combos del sistema.',
          admin: true,
          manager: false,
          staff: false,
        },
        {
          name: 'Administrar Categorías y Marcas',
          description: 'Estructurar el menú del catálogo y clasificaciones.',
          admin: true,
          manager: true,
          staff: false,
        },
      ],
    },
    {
      module: 'Pedidos & Envíos (E-commerce)',
      icon: Truck,
      actions: [
        {
          name: 'Ver pedidos recibidos de la web',
          description: 'Listado de compras online pendientes de empaque.',
          admin: true,
          manager: true,
          staff: true,
        },
        {
          name: 'Actualizar estado del pedido (o marcar cancelado)',
          description: 'Marcar como Empacado, En camino, Entregado o Cancelado.',
          admin: true,
          manager: true,
          staff: true,
        },
        {
          name: 'Eliminar pedido de la base de datos',
          description: 'Borrado permanente del registro de la orden.',
          admin: true,
          manager: false,
          staff: false,
        },
      ],
    },
    {
      module: 'Clientes (CRM & WhatsApp)',
      icon: Users,
      actions: [
        {
          name: 'Consultar base de clientes',
          description: 'Buscar datos de contacto, historial y ubicación GPS.',
          admin: true,
          manager: true,
          staff: true,
        },
        {
          name: 'Crear y actualizar fichas de clientes',
          description: 'Registrar nuevos clientes en caja y editar su teléfono.',
          admin: true,
          manager: true,
          staff: true,
        },
      ],
    },
    {
      module: 'Métricas & Dashboard',
      icon: BarChart3,
      actions: [
        {
          name: 'Ver Dashboard operativo del día',
          description: 'Ventas del día, pedidos pendientes y alertas de existencias.',
          admin: true,
          manager: true,
          staff: true,
        },
        {
          name: 'Ver balances financieros y facturación total',
          description: 'Gráficos de ingresos mensuales y evolución comercial.',
          admin: true,
          manager: true,
          staff: false,
        },
      ],
    },
    {
      module: 'Configuración de la Tienda Web',
      icon: Settings,
      actions: [
        {
          name: 'Modificar datos del negocio & WhatsApp',
          description: 'Cambiar número de WhatsApp flotante, horarios y dirección.',
          admin: true,
          manager: false,
          staff: false,
        },
        {
          name: 'Gestionar banners y campañas de la web',
          description: 'Activar promociones destacadas en la tienda online.',
          admin: true,
          manager: false,
          staff: false,
        },
      ],
    },
    {
      module: 'Equipo, Seguridad & Usuarios',
      icon: ShieldCheck,
      actions: [
        {
          name: 'Registrar nuevos colaboradores',
          description: 'Crear cuentas para empleados y cajeros.',
          admin: true,
          manager: false,
          staff: false,
        },
        {
          name: 'Asignar o cambiar roles de acceso',
          description: 'Definir si un usuario es Admin, Encargado o Vendedor.',
          admin: true,
          manager: false,
          staff: false,
        },
        {
          name: 'Suspender cuentas o restablecer contraseñas',
          description: 'Bloquear accesos de inmediato y reasignar claves.',
          admin: true,
          manager: false,
          staff: false,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tarjetas Informativas de los 3 Roles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['ADMIN', 'MANAGER', 'STAFF'] as UserRole[]).map((roleKey) => {
          const role = rolesInfo[roleKey];
          const Icon = role.icon;
          const isSelected = selectedRoleTab === roleKey;

          return (
            <div
              key={roleKey}
              onClick={() =>
                setSelectedRoleTab(selectedRoleTab === roleKey ? 'ALL' : roleKey)
              }
              className={`rounded-3xl p-5 border cursor-pointer transition-all ${
                isSelected
                  ? role.color + ' ring-2 ring-maribel-600 shadow-sm'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-2xl ${
                    isSelected ? 'bg-white shadow-2xs' : role.badgeBg
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? 'text-stone-900' : role.badgeText
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${role.badgeBg} ${role.badgeText}`}
                >
                  {role.title}
                </span>
              </div>

              <h3 className="font-serif font-bold text-stone-900 text-base">
                {role.title}
              </h3>
              <p className="text-xs text-maribel-700 font-semibold mb-2">
                {role.subtitle}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {role.description}
              </p>

              <div className="pt-3 border-t border-stone-200/60">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Ideal para:
                </span>
                <span className="text-xs text-stone-700 font-medium">
                  {role.idealFor}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla Comparativa de Capacidades */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-50/50">
          <div>
            <h2 className="font-serif font-bold text-stone-900 text-lg">
              Matriz Comparativa de Permisos
            </h2>
            <p className="text-xs text-stone-500">
              Detalle exacto de lo que cada colaborador puede ver y ejecutar según su rol.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-200/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedRoleTab('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleTab === 'ALL'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Comparar Todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleTab('ADMIN')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleTab === 'ADMIN'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleTab('MANAGER')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleTab === 'MANAGER'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Encargado
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleTab('STAFF')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRoleTab === 'STAFF'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Staff
            </button>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {capabilities.map((cap) => {
            const ModuleIcon = cap.icon;

            return (
              <div key={cap.module} className="p-5 sm:p-6 space-y-4">
                {/* Cabecera del Módulo */}
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                    <ModuleIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    {cap.module}
                  </h3>
                </div>

                {/* Acciones */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-100">
                        <th className="pb-2 font-semibold">Acción / Capacidad</th>
                        {(selectedRoleTab === 'ALL' || selectedRoleTab === 'ADMIN') && (
                          <th className="pb-2 text-center w-28 text-purple-700 font-bold">
                            Super Admin
                          </th>
                        )}
                        {(selectedRoleTab === 'ALL' || selectedRoleTab === 'MANAGER') && (
                          <th className="pb-2 text-center w-28 text-blue-700 font-bold">
                            Encargado
                          </th>
                        )}
                        {(selectedRoleTab === 'ALL' || selectedRoleTab === 'STAFF') && (
                          <th className="pb-2 text-center w-28 text-emerald-700 font-bold">
                            Staff / Cajero
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {cap.actions.map((act) => (
                        <tr
                          key={act.name}
                          className="hover:bg-stone-50/60 transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <span className="font-semibold text-stone-900 block text-xs">
                              {act.name}
                            </span>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              {act.description}
                            </span>
                          </td>

                          {(selectedRoleTab === 'ALL' || selectedRoleTab === 'ADMIN') && (
                            <td className="py-3 text-center">
                              {act.admin ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700">
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-stone-400">
                                  <X className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </td>
                          )}

                          {(selectedRoleTab === 'ALL' || selectedRoleTab === 'MANAGER') && (
                            <td className="py-3 text-center">
                              {act.manager ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700">
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-stone-400">
                                  <X className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </td>
                          )}

                          {(selectedRoleTab === 'ALL' || selectedRoleTab === 'STAFF') && (
                            <td className="py-3 text-center">
                              {act.staff ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-stone-400">
                                  <X className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
