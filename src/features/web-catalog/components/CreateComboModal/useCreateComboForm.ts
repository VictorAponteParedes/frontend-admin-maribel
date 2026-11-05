import { useState } from 'react';
import { useWebCatalogStore } from '../../store/useWebCatalogStore';
import { ComboItemSelection } from '../../types/webCatalog.types';
import { formatGuarani, parseGuarani } from '@/utils/formatters';

export const useCreateComboForm = (onClose: () => void) => {
  const products = useWebCatalogStore((state) => state.products);
  const createCombo = useWebCatalogStore((state) => state.createCombo);

  const [title, setTitle] = useState('');
  const [kicker, setKicker] = useState('★ FAVORITO BOUTIQUE');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedItems, setSelectedItems] = useState<ComboItemSelection[]>([]);
  const [promoPrice, setPromoPrice] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [searchProduct, setSearchProduct] = useState('');

  // Cálculo en tiempo real de la suma de precios individuales
  const normalSum = selectedItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );

  const numericPromoPrice = parseGuarani(promoPrice);
  const calculatedSavings =
    numericPromoPrice > 0 ? Math.max(0, normalSum - numericPromoPrice) : 0;
  const discountPercent =
    normalSum > 0 && calculatedSavings > 0 && numericPromoPrice > 0
      ? Math.round((calculatedSavings / normalSum) * 100)
      : 0;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseGuarani(raw);
    if (numeric === 0 && raw.replace(/\D/g, '') === '') {
      setPromoPrice('');
    } else {
      setPromoPrice(formatGuarani(numeric));
    }
  };

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const existing = selectedItems.find((i) => i.productId === productId);
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          productId: prod.id,
          productName: prod.name,
          brand: prod.brand,
          originalPrice: prod.webPrice || prod.sellingPrice,
          quantity: 1,
        },
      ]);
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    const existing = selectedItems.find((i) => i.productId === productId);
    if (!existing) return;
    if (existing.quantity > 1) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      handleRemoveItem(productId);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.productId !== productId));
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setImageUrl(simulatedUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || selectedItems.length === 0 || numericPromoPrice <= 0) {
      return;
    }

    createCombo({
      title: title.trim(),
      kicker: kicker.trim() || 'EDICIÓN ESPECIAL',
      description:
        description.trim() ||
        `Incluye: ${selectedItems.map((i) => `${i.productName} (x${i.quantity})`).join(' + ')} en estuche rígido con dedicatoria.`,
      price: numericPromoPrice,
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
      items: selectedItems,
      isActive,
    });

    onClose();
  };

  const filteredStock = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return {
    state: {
      title,
      kicker,
      description,
      imageUrl,
      selectedItems,
      promoPrice,
      isActive,
      searchProduct,
      normalSum,
      numericPromoPrice,
      calculatedSavings,
      discountPercent,
      filteredStock,
    },
    actions: {
      setTitle,
      setKicker,
      setDescription,
      setImageUrl,
      setIsActive,
      setSearchProduct,
      handlePriceChange,
      handleAddItem,
      handleDecreaseQuantity,
      handleRemoveItem,
      handleSimulateUpload,
      handleSubmit,
    },
  };
};
