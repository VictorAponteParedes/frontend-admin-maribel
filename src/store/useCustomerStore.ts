import { create } from 'zustand';
import { Customer, CustomerFormData } from '@/features/customers/types/customer.types';
import { customersService, CustomerQueryParams } from '@/features/customers/services/customers.service';

export interface CustomerState {
  customers: Customer[];
  totalItems: number;
  isLoading: boolean;
  fetchCustomers: (params?: CustomerQueryParams) => Promise<void>;
  addCustomer: (data: CustomerFormData) => Promise<Customer>;
  getByCode: (code: number) => Customer | undefined;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  totalItems: 0,
  isLoading: false,

  fetchCustomers: async (params?: CustomerQueryParams) => {
    set({ isLoading: true });
    try {
      const data = await customersService.fetchCustomers(params);
      set({
        customers: data.items || [],
        totalItems: data.meta?.total ?? (data.items ? data.items.length : 0),
      });
    } catch {
      // Si el backend no responde, mantiene el estado actual
    } finally {
      set({ isLoading: false });
    }
  },

  addCustomer: async (data: CustomerFormData) => {
    try {
      await customersService.createCustomer(data);
      const refreshed = await customersService.fetchCustomers();
      if (refreshed?.items && refreshed.items.length > 0) {
        set({ customers: refreshed.items, totalItems: refreshed.meta.total });
        return refreshed.items[0];
      }
    } catch {
      // Fallback local si el backend está desconectado
    }

    const { customers, totalItems } = get();
    const nextCode = customers.length > 0 ? Math.max(...customers.map((c) => c.code)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];

    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      code: nextCode,
      registrationDate: today,
      name: data.name,
      phone: data.phone || 'Sin teléfono',
      address: data.address || 'Sin dirección',
      gpsUrl: data.gpsUrl,
    };

    set({ customers: [newCustomer, ...customers], totalItems: totalItems + 1 });
    return newCustomer;
  },

  getByCode: (code: number) => {
    return get().customers.find((c) => c.code === code);
  },
}));
