import { create } from 'zustand';
import { Customer, CustomerFormData } from '@/features/customers/types/customer.types';

export interface CustomerState {
  customers: Customer[];
  addCustomer: (data: CustomerFormData) => Customer;
  getByCode: (code: number) => Customer | undefined;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    code: 1,
    registrationDate: '2026-10-31',
    name: 'Pablo Ariel Melgarejo Servian',
    phone: '0986 314 630',
    address: 'Pedro Juan Caballero',
  },
  {
    id: 'c-2',
    code: 2,
    registrationDate: '2026-10-31',
    name: 'Cliente casual',
    phone: 'Sin teléfono',
    address: 'Mostrador / Venta directa',
  },
  {
    id: 'c-3',
    code: 3,
    registrationDate: '2026-10-31',
    name: 'Marlene Roman',
    phone: '0982 653 625',
    address: 'Profesor Luis Migone Battilana',
  },
  {
    id: 'c-4',
    code: 4,
    registrationDate: '2026-10-31',
    name: 'Kevin Mendoza',
    phone: '0985 549 093',
    address: 'Ypané',
    gpsUrl: 'https://maps.google.com/?q=Ypane',
  },
  {
    id: 'c-5',
    code: 5,
    registrationDate: '2026-10-31',
    name: 'Lisandra Barreto',
    phone: '0976 484 464',
    address: 'Concepción',
  },
  {
    id: 'c-6',
    code: 6,
    registrationDate: '2026-10-31',
    name: 'Micaela',
    phone: '0975 611 730',
    address: 'Ayolas',
  },
  {
    id: 'c-7',
    code: 7,
    registrationDate: '2026-10-31',
    name: 'Claudia Centurion',
    phone: '0991 552 447',
    address: 'Coronel Oviedo',
  },
  {
    id: 'c-8',
    code: 8,
    registrationDate: '2026-10-31',
    name: 'Elsa Marilu Noguera Cristaldo',
    phone: '0981 740 221',
    address: 'Villeta',
  },
  {
    id: 'c-9',
    code: 9,
    registrationDate: '2026-10-31',
    name: 'Gervacia Florentina Alen Pelozo',
    phone: '0983 358 032',
    address: 'San Juan Bautista Misiones',
  },
  {
    id: 'c-10',
    code: 10,
    registrationDate: '2026-10-31',
    name: 'Silvina Pucheta',
    phone: '0987 191 423',
    address: 'Fuerte Olimpo',
  },
  {
    id: 'c-11',
    code: 11,
    registrationDate: '2026-10-31',
    name: 'Librada Cañete Rodas',
    phone: '0984 097 712',
    address: 'Concepción',
  },
  {
    id: 'c-12',
    code: 12,
    registrationDate: '2026-10-31',
    name: 'Edith',
    phone: '0981 232 117',
    address: 'Ypané',
  },
  {
    id: 'c-13',
    code: 13,
    registrationDate: '2026-10-31',
    name: 'Gabina Ullon',
    phone: '0985 298 541',
    address: 'Asunción',
  },
  {
    id: 'c-14',
    code: 14,
    registrationDate: '2026-10-31',
    name: 'Lourdes Martinez',
    phone: '0981 601 339',
    address: 'San Lorenzo',
  },
  {
    id: 'c-15',
    code: 15,
    registrationDate: '2026-10-31',
    name: 'Sabri Meza',
    phone: '0986 445 890',
    address: 'Loma Pytã Barrio San Blas',
  },
  {
    id: 'c-16',
    code: 16,
    registrationDate: '2026-10-31',
    name: 'Soledad Rojas',
    phone: '0972 532 842',
    address: 'María Auxiliadora',
  },
  {
    id: 'c-17',
    code: 17,
    registrationDate: '2026-10-31',
    name: 'Hugo Vera Portillo',
    phone: '0982 089 887',
    address: 'Natalio',
  },
  {
    id: 'c-18',
    code: 18,
    registrationDate: '2026-10-31',
    name: 'Liz Caballero',
    phone: '0982 719 342',
    address: 'Concepción',
  },
  {
    id: 'c-19',
    code: 19,
    registrationDate: '2026-10-31',
    name: 'Marilia Britez',
    phone: '0994 258 137',
    address: 'Central',
  },
  {
    id: 'c-20',
    code: 20,
    registrationDate: '2026-10-31',
    name: 'Gloria Loly',
    phone: '0984 257 627',
    address: 'Central',
  },
];

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: INITIAL_CUSTOMERS,

  addCustomer: (data: CustomerFormData) => {
    const { customers } = get();
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

    set({ customers: [newCustomer, ...customers] });
    return newCustomer;
  },

  getByCode: (code: number) => {
    return get().customers.find((c) => c.code === code);
  },
}));
