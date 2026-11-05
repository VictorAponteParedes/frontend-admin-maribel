import { create } from 'zustand';
import { WebProduct, WebCombo, ComboItemSelection } from '../types/webCatalog.types';
import { toast } from '@/store/useToastStore';

interface WebCatalogState {
  products: WebProduct[];
  combos: WebCombo[];
  toggleProductVisibility: (id: string) => void;
  updateProduct: (id: string, updates: Partial<WebProduct>) => void;
  toggleComboActive: (id: string) => void;
  createCombo: (data: {
    title: string;
    kicker: string;
    description: string;
    price: number;
    imageUrl: string;
    items: ComboItemSelection[];
    isActive: boolean;
  }) => void;
  deleteCombo: (id: string) => void;
}

const INITIAL_WEB_PRODUCTS: WebProduct[] = [
  {
    id: 'prod-cool-girl',
    barcode: '779812345001',
    name: 'Cool Girl Velvet Pour Femme',
    brand: 'Carolina H.',
    size: '85 ml',
    costPrice: 95000,
    sellingPrice: 165000,
    webPrice: 155000,
    stockQuantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80',
    isWebVisible: true,
    webCategory: 'Femenino',
    webBadge: 'Más Vendido',
  },
  {
    id: 'prod-story-of-flower',
    barcode: '779812345002',
    name: 'Story of Flower Vaporisateur',
    brand: 'Maison Florale',
    size: '50 ml',
    costPrice: 70000,
    sellingPrice: 120000,
    stockQuantity: 9,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80',
    isWebVisible: true,
    webCategory: 'Femenino',
    webBadge: 'Favorito',
  },
  {
    id: 'prod-sauvage',
    barcode: '779812345003',
    name: 'Sauvage Eau de Parfum',
    brand: 'Dior Luxe',
    size: '100 ml',
    costPrice: 110000,
    sellingPrice: 180000,
    webPrice: 180000,
    stockQuantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=80',
    isWebVisible: true,
    webCategory: 'Masculino',
    webBadge: 'Más Vendido',
  },
  {
    id: 'prod-khamrah',
    barcode: '779812345004',
    name: 'Khamrah Qahwa Imperial',
    brand: 'Lattafa Perfumes',
    size: '100 ml',
    costPrice: 120000,
    sellingPrice: 195000,
    stockQuantity: 14,
    imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=500&q=80',
    isWebVisible: true,
    webCategory: 'Árabe',
    webBadge: 'Tendencia',
  },
  {
    id: 'prod-baccarat',
    barcode: '779812345005',
    name: 'Rouge Ambré 540 Sillage',
    brand: 'Maison Chic',
    size: '70 ml',
    costPrice: 130000,
    sellingPrice: 210000,
    stockQuantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=500&q=80',
    isWebVisible: true,
    webCategory: 'Unisex',
    webBadge: 'Exclusivo',
  },
  {
    id: 'prod-bleu-chanel',
    barcode: '779812345006',
    name: 'Bleu de Chanel Parfum Homme',
    brand: 'Chanel Homme',
    size: '100 ml',
    costPrice: 125000,
    sellingPrice: 195000,
    stockQuantity: 11,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80',
    isWebVisible: false,
    webCategory: 'Masculino',
    webBadge: 'Ninguno',
  },
  {
    id: 'prod-la-vie-belle',
    barcode: '779812345007',
    name: 'La Vie Est Belle Lumière',
    brand: 'Lancôme Paris',
    size: '100 ml',
    costPrice: 115000,
    sellingPrice: 195000,
    stockQuantity: 7,
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=500&q=80',
    isWebVisible: false,
    webCategory: 'Femenino',
    webBadge: 'Ninguno',
  },
];

const INITIAL_WEB_COMBOS: WebCombo[] = [
  {
    id: 'combo-duo-sensualite',
    title: 'Duo Sensualité',
    kicker: '★ FAVORITO BOUTIQUE',
    description: 'Incluye: Cool Girl EdP 85ml + Mystical Zanzibara 30ml + Mini estuche rígido con listón de terciopelo.',
    fragranceCountLabel: '2 Fragancias',
    items: [
      {
        productId: 'prod-cool-girl',
        productName: 'Cool Girl Velvet Pour Femme',
        brand: 'Carolina H.',
        quantity: 1,
        originalPrice: 165000,
      },
      {
        productId: 'prod-story-of-flower',
        productName: 'Story of Flower Luxe',
        brand: 'Maison Florale',
        quantity: 1,
        originalPrice: 140000,
      },
    ],
    originalPrice: 305000,
    price: 250000,
    savingsAmount: 55000,
    discountBadge: 'Ahorrás Gs. 55.000',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'combo-pack-romance',
    title: 'Pack Romance Florale',
    kicker: '♥ BOUQUET FLORAL',
    description: 'Incluye: Sweet Cherry 85ml + Tartan Silk 30ml + Loción corporal iluminadora perfumada.',
    fragranceCountLabel: '3 Piezas',
    items: [
      {
        productId: 'prod-cool-girl',
        productName: 'Sweet Cherry EdP',
        brand: 'Tom Chic',
        quantity: 1,
        originalPrice: 180000,
      },
      {
        productId: 'prod-story-of-flower',
        productName: 'Tartan Silk Vaporisateur',
        brand: 'Maison Florale',
        quantity: 1,
        originalPrice: 135000,
      },
    ],
    originalPrice: 315000,
    price: 270000,
    savingsAmount: 45000,
    discountBadge: 'Ahorrás Gs. 45.000',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    isActive: true,
    createdAt: '2026-11-02',
  },
];

export const useWebCatalogStore = create<WebCatalogState>((set) => ({
  products: INITIAL_WEB_PRODUCTS,
  combos: INITIAL_WEB_COMBOS,

  toggleProductVisibility: (id) => {
    set((state) => {
      const target = state.products.find((p) => p.id === id);
      const nextVisible = !target?.isWebVisible;

      if (target) {
        if (nextVisible) {
          toast.success(
            'Producto Publicado',
            `"${target.name}" ahora es visible en la tienda web.`
          );
        } else {
          toast.info(
            'Producto Ocultado',
            `"${target.name}" ya no se mostrará en la tienda web.`
          );
        }
      }

      return {
        products: state.products.map((p) =>
          p.id === id ? { ...p, isWebVisible: nextVisible } : p
        ),
      };
    });
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
    toast.success('Producto Actualizado', 'Los cambios se guardaron en la ficha web.');
  },

  toggleComboActive: (id) => {
    set((state) => {
      const target = state.combos.find((c) => c.id === id);
      const nextActive = !target?.isActive;

      if (target) {
        if (nextActive) {
          toast.success('Combo Activado', `"${target.title}" publicado en la web.`);
        } else {
          toast.info('Combo Pausado', `"${target.title}" ha sido pausado temporalmente.`);
        }
      }

      return {
        combos: state.combos.map((c) =>
          c.id === id ? { ...c, isActive: nextActive } : c
        ),
      };
    });
  },

  createCombo: (data) => {
    const originalPrice = data.items.reduce(
      (sum, item) => sum + item.originalPrice * item.quantity,
      0
    );
    const savingsAmount = Math.max(0, originalPrice - data.price);
    const count = data.items.reduce((sum, item) => sum + item.quantity, 0);

    const newCombo: WebCombo = {
      id: `combo-${Date.now()}`,
      title: data.title,
      kicker: data.kicker || '★ SET EXCLUSIVO',
      description: data.description,
      fragranceCountLabel: `${count} ${count === 1 ? 'Pieza' : 'Piezas'}`,
      items: data.items,
      originalPrice,
      price: data.price,
      savingsAmount,
      discountBadge: savingsAmount > 0
        ? `Ahorrás Gs. ${new Intl.NumberFormat('es-PY').format(savingsAmount)}`
        : 'Precio Especial',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
      isActive: data.isActive,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      combos: [newCombo, ...state.combos],
    }));

    toast.success('Combo Creado', `"${newCombo.title}" se agregó al catálogo web con éxito.`);
  },

  deleteCombo: (id) => {
    set((state) => ({
      combos: state.combos.filter((c) => c.id !== id),
    }));
    toast.info('Combo Eliminado', 'El combo ha sido eliminado del catálogo.');
  },
}));
