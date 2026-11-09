import { useState, useEffect } from 'react';
import { WebProduct, WebCategory, WebBadge } from '../../types/webCatalog.types';
import { formatGuarani, parseGuarani } from '@/utils/formatters';

export const useEditWebProductForm = (
  product: WebProduct | null,
  onSave: (id: string, updates: Partial<WebProduct>) => Promise<boolean | void> | void,
  onClose: () => void
) => {
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWebVisible, setIsWebVisible] = useState(false);
  const [webCategory, setWebCategory] = useState<WebCategory>('Femenino');
  const [webBadge, setWebBadge] = useState<WebBadge>('Ninguno');
  const [webPrice, setWebPrice] = useState<string>('');

  useEffect(() => {
    if (product) {
      const resolvedImages =
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : product.imageUrl
          ? [product.imageUrl]
          : [];

      setImages(resolvedImages);
      setImageUrl(resolvedImages[0] || product.imageUrl || '');
      setImageId(product.imageId || undefined);
      setIsWebVisible(product.isWebVisible);
      setWebCategory(product.webCategory || 'Femenino');
      setWebBadge(product.webBadge || 'Ninguno');
      setWebPrice(product.webPrice ? formatGuarani(product.webPrice) : '');
    }
  }, [product]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseGuarani(raw);
    if (numeric === 0 && raw.replace(/\D/g, '') === '') {
      setWebPrice('');
    } else {
      setWebPrice(formatGuarani(numeric));
    }
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    setImageUrl(newImages[0] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSave(product.id, {
        imageUrl: images[0] || imageUrl,
        images,
        imageId,
        isWebVisible,
        webCategory,
        webBadge,
        webPrice: webPrice ? parseGuarani(webPrice) : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      images,
      imageUrl,
      imageId,
      isSubmitting,
      isWebVisible,
      webCategory,
      webBadge,
      webPrice,
    },
    actions: {
      setImages: handleImagesChange,
      setImageUrl,
      setIsWebVisible,
      setWebCategory,
      setWebBadge,
      handlePriceChange,
      handleSubmit,
    },
  };
};
