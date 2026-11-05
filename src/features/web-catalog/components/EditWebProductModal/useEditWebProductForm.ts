import { useState, useEffect } from 'react';
import { WebProduct, WebCategory, WebBadge } from '../../types/webCatalog.types';
import { filesService } from '@/services/files.service';
import { formatGuarani, parseGuarani } from '@/utils/formatters';
import { toast } from '@/store/useToastStore';

export const useEditWebProductForm = (
  product: WebProduct | null,
  onSave: (id: string, updates: Partial<WebProduct>) => Promise<boolean | void> | void,
  onClose: () => void
) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState<string | undefined>(undefined);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWebVisible, setIsWebVisible] = useState(false);
  const [webCategory, setWebCategory] = useState<WebCategory>('Femenino');
  const [webBadge, setWebBadge] = useState<WebBadge>('Ninguno');
  const [webPrice, setWebPrice] = useState<string>('');

  useEffect(() => {
    if (product) {
      setImageUrl(product.imageUrl || '');
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vista previa inmediata con blob URL local
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);

    try {
      setIsUploadingImage(true);
      const uploaded = await filesService.uploadFile(
        file,
        `Producto: ${product?.name || 'Perfume'}`
      );
      setImageId(uploaded.id);
      setImageUrl(uploaded.url);
      toast.success('Foto subida', 'La imagen del perfume se cargó exitosamente.');
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
    if (!product || isSubmitting || isUploadingImage) return;

    try {
      setIsSubmitting(true);
      await onSave(product.id, {
        imageUrl,
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
      imageUrl,
      imageId,
      isUploadingImage,
      isSubmitting,
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
      handleImageUpload,
      handleSubmit,
    },
  };
};
