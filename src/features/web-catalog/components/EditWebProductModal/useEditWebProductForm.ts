import { useState, useEffect } from 'react';
import { WebProduct, WebCategory, WebBadge } from '../../types/webCatalog.types';
import { formatGuarani, parseGuarani } from '@/utils/formatters';

export const useEditWebProductForm = (
  product: WebProduct | null,
  onSave: (id: string, updates: Partial<WebProduct>) => void,
  onClose: () => void
) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isWebVisible, setIsWebVisible] = useState(false);
  const [webCategory, setWebCategory] = useState<WebCategory>('Femenino');
  const [webBadge, setWebBadge] = useState<WebBadge>('Ninguno');
  const [webPrice, setWebPrice] = useState<string>('');

  useEffect(() => {
    if (product) {
      setImageUrl(product.imageUrl || '');
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

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    onSave(product.id, {
      imageUrl,
      isWebVisible,
      webCategory,
      webBadge,
      webPrice: webPrice ? parseGuarani(webPrice) : undefined,
    });
    onClose();
  };

  return {
    state: {
      imageUrl,
      isWebVisible,
      webCategory,
      webBadge,
      webPrice,
    },
    actions: {
      setImageUrl,
      setIsWebVisible,
      setWebCategory,
      setWebBadge,
      handlePriceChange,
      handleSimulateUpload,
      handleSubmit,
    },
  };
};
