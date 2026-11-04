import { httpClient } from '@/lib/httpClient';
import { Customer, CustomerFormData } from '../types/customer.types';

export interface CustomersResponseData {
  items: Customer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CustomerQueryParams {
  search?: string;
  code?: number;
  name?: string;
  phone?: string;
  registrationDate?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const customersService = {
  fetchCustomers: async (
    params?: CustomerQueryParams,
  ): Promise<CustomersResponseData> => {
    const cleanParams: Record<string, string | number> = {};

    if (params?.search?.trim()) cleanParams.search = params.search.trim();
    if (params?.code !== undefined && !isNaN(params.code)) cleanParams.code = params.code;
    if (params?.name?.trim()) cleanParams.name = params.name.trim();
    if (params?.phone?.trim()) cleanParams.phone = params.phone.trim();
    if (params?.registrationDate?.trim()) cleanParams.registrationDate = params.registrationDate.trim();
    if (params?.startDate?.trim()) cleanParams.startDate = params.startDate.trim();
    if (params?.endDate?.trim()) cleanParams.endDate = params.endDate.trim();
    if (params?.page) cleanParams.page = params.page;
    cleanParams.limit = params?.limit ?? 50;

    const response = await httpClient.get('/customers', {
      params: cleanParams,
    });

    const data: CustomersResponseData = response.data.data;
    return data;
  },

  createCustomer: async (formData: CustomerFormData): Promise<Customer> => {
    const response = await httpClient.post('/customers', {
      name: formData.name,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      gpsUrl: formData.gpsUrl || undefined,
    });

    return response.data.data;
  },

  updateCustomer: async (
    id: string,
    formData: Partial<CustomerFormData>,
  ): Promise<Customer> => {
    const response = await httpClient.patch(`/customers/${id}`, formData);
    return response.data.data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await httpClient.delete(`/customers/${id}`);
  },
};
