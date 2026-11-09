import { httpClient } from '@/lib/httpClient';
import { WebCombo, ComboItemSelection } from '../types/webCatalog.types';

export interface BackendComboItem {
  id: string;
  comboId: string;
  productId: string;
  quantity: number;
  unitPrice: number | string;
  product?: {
    id: string;
    name: string;
    brand?: { id: string; name: string } | string;
    barcode?: string;
    sellingPrice?: number | string;
    webPrice?: number | string;
  };
}

export interface BackendCombo {
  id: string;
  title: string;
  kicker?: string | null;
  description?: string | null;
  price: number | string;
  originalPrice: number | string;
  savingsAmount: number | string;
  imageId?: string | null;
  imageUrl?: string | null;
  images?: string[] | null;
  image?: { id: string; url: string } | null;
  isActive: boolean;
  items?: BackendComboItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateComboPayload {
  title: string;
  kicker?: string;
  description?: string;
  price: number;
  imageId?: string;
  imageUrl?: string;
  images?: string[];
  isActive?: boolean;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateComboPayload {
  title?: string;
  kicker?: string;
  description?: string;
  price?: number;
  imageId?: string;
  imageUrl?: string;
  images?: string[];
  isActive?: boolean;
  items?: {
    productId: string;
    quantity: number;
  }[];
}

export function mapBackendComboToWebCombo(raw: BackendCombo): WebCombo {
  const price = Number(raw.price || 0);
  const originalPrice = Number(raw.originalPrice || 0);
  const savingsAmount = Number(raw.savingsAmount || 0);
  const items = (raw.items || []).map((item): ComboItemSelection => {
    let brandName = 'Maribel Perfum';
    if (typeof item.product?.brand === 'object' && item.product?.brand !== null) {
      brandName = item.product.brand.name;
    } else if (typeof item.product?.brand === 'string') {
      brandName = item.product.brand;
    }

    return {
      productId: item.productId,
      productName: item.product?.name || 'Fragancia',
      brand: brandName,
      quantity: Number(item.quantity || 1),
      originalPrice: Number(item.unitPrice || 0),
    };
  });

  const totalFragrances = items.reduce((sum, i) => sum + i.quantity, 0);
  const discountPercent =
    originalPrice > 0 && savingsAmount > 0
      ? Math.round((savingsAmount / originalPrice) * 100)
      : 0;

  const resolvedImage =
    raw.image?.url ||
    raw.imageUrl ||
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80';

  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : [resolvedImage];

  return {
    id: raw.id,
    title: raw.title,
    kicker: raw.kicker || '★ FAVORITO BOUTIQUE',
    description: raw.description || '',
    fragranceCountLabel:
      totalFragrances === 1
        ? '1 fragancia de lujo'
        : `${totalFragrances} fragancias de lujo`,
    items,
    originalPrice,
    price,
    savingsAmount,
    discountBadge: discountPercent > 0 ? `-${discountPercent}%` : 'PROMO',
    imageUrl: resolvedImage,
    images,
    isActive: raw.isActive,
    createdAt: raw.createdAt,
  };
}

export const combosService = {
  fetchCombos: async (activeOnly = false): Promise<WebCombo[]> => {
    const response = await httpClient.get('/combos', {
      params: activeOnly ? { activeOnly: 'true' } : undefined,
    });
    const items: BackendCombo[] = response.data.data || [];
    return items.map(mapBackendComboToWebCombo);
  },

  getComboById: async (id: string): Promise<WebCombo> => {
    const response = await httpClient.get(`/combos/${id}`);
    return mapBackendComboToWebCombo(response.data.data);
  },

  createCombo: async (payload: CreateComboPayload): Promise<WebCombo> => {
    const response = await httpClient.post('/combos', payload);
    return mapBackendComboToWebCombo(response.data.data);
  },

  updateCombo: async (
    id: string,
    payload: UpdateComboPayload
  ): Promise<WebCombo> => {
    const response = await httpClient.patch(`/combos/${id}`, payload);
    return mapBackendComboToWebCombo(response.data.data);
  },

  toggleComboActive: async (id: string): Promise<WebCombo> => {
    const response = await httpClient.patch(`/combos/${id}/toggle`);
    return mapBackendComboToWebCombo(response.data.data);
  },

  deleteCombo: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    const response = await httpClient.delete(`/combos/${id}`);
    return response.data.data;
  },
};
