import { useState, useEffect } from 'react';
import { useWebCatalogStore } from '../../store/useWebCatalogStore';
import { ComboItemSelection } from '../../types/webCatalog.types';
import { filesService } from '@/services/files.service';
import { formatGuarani, parseGuarani } from '@/utils/formatters';
import { toast } from '@/store/useToastStore';

export const useCreateComboForm = (onClose: () => void) => {
  const products = useWebCatalogStore((state) => state.products);
  const fetchProducts = useWebCatalogStore((state) => state.fetchProducts);
  const createCombo = useWebCatalogStore((state) => state.createCombo);

  const [title, setTitle] = useState('');
  const [kicker, setKicker] = useState('★ FAVORITO BOUTIQUE');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState<string | undefined>(undefined);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ComboItemSelection[]>([]);
  const [promoPrice, setPromoPrice] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [searchProduct, setSearchProduct] = useState('');

  // Asegurar que los productos estén cargados
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar previsualización instantánea
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);

    try {
      setIsUploadingImage(true);
      const uploaded = await filesService.uploadFile(file, `Combo: ${title || 'Set Promocional'}`);
      setImageId(uploaded.id);
      setImageUrl(uploaded.url);
      toast.success('Imagen subida', 'La foto del estuche se cargó exitosamente.');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al subir la imagen al servidor.';
      toast.error('Error al subir imagen', message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || selectedItems.length === 0 || numericPromoPrice <= 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createCombo({
        title: title.trim(),
        kicker: kicker.trim() || '★ FAVORITO BOUTIQUE',
        description:
          description.trim() ||
          `Incluye: ${selectedItems.map((i) => `${i.productName} (x${i.quantity})`).join(' + ')} en estuche rígido con dedicatoria.`,
        price: numericPromoPrice,
        imageId,
        imageUrl: imageUrl.trim() || undefined,
        items: selectedItems,
        isActive,
      });

      if (created) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
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
      imageId,
      isUploadingImage,
      isSubmitting,
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
      handleImageUpload,
      handleSubmit,
    },
  };
};
