import React, { useState } from 'react';
import { Upload, Loader2, X, Star, Plus } from 'lucide-react';
import { resolveImageUrl, filesService } from '@/services/files.service';
import { toast } from '@/store/useToastStore';

export interface CreateComboImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  imageUrl?: string;
  onImageUrlChange?: (url: string) => void;
  maxImages?: number;
}

export const CreateComboImageUploader: React.FC<CreateComboImageUploaderProps> = ({
  images = [],
  onImagesChange,
  imageUrl,
  onImageUrlChange,
  maxImages = 4,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');

  // Sincronizar lista efectiva de imágenes
  const effectiveImages =
    images.length > 0
      ? images
      : imageUrl?.trim()
      ? [imageUrl.trim()]
      : [];

  const updateImages = (newList: string[]) => {
    onImagesChange(newList);
    if (onImageUrlChange) {
      onImageUrlChange(newList[0] || '');
    }
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = maxImages - effectiveImages.length;
    if (availableSlots <= 0) {
      toast.warning('Límite alcanzado', `Máximo ${maxImages} imágenes por combo.`);
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of filesToUpload) {
        const res = await filesService.uploadFile(file, `Combo: ${file.name}`);
        if (res?.url) {
          uploadedUrls.push(res.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const nextList = [...effectiveImages, ...uploadedUrls];
        updateImages(nextList);
        toast.success(
          'Fotos subidas',
          `Se cargaron ${uploadedUrls.length} imagen(es) con éxito.`
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al subir una o más imágenes.';
      toast.error('Error al subir', message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = urlInput.trim();
    if (!clean) return;

    if (effectiveImages.length >= maxImages) {
      toast.warning('Límite alcanzado', `Máximo ${maxImages} imágenes por combo.`);
      return;
    }

    const nextList = [...effectiveImages, clean];
    updateImages(nextList);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const nextList = effectiveImages.filter((_, idx) => idx !== indexToRemove);
    updateImages(nextList);
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    const target = effectiveImages[indexToPrimary];
    const rest = effectiveImages.filter((_, idx) => idx !== indexToPrimary);
    const nextList = [target, ...rest];
    updateImages(nextList);
  };

  return (
    <div className="bg-stone-50/60 border border-stone-200/90 rounded-2xl p-5 space-y-3.5">
      {/* Encabezado con contador */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
            Fotos del Estuche / Set
          </label>
          <span className="text-[11px] font-bold text-maribel-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
            {effectiveImages.length} de {maxImages}
          </span>
        </div>
        <span className="text-[10px] text-stone-400">
          La primera foto seleccionada se mostrará como portada
        </span>
      </div>

      {/* Cuadrícula de fotos */}
      <div className="grid grid-cols-4 gap-2.5">
        {effectiveImages.map((imgUrl, index) => {
          const resolved = resolveImageUrl(imgUrl);
          const isPrimary = index === 0;

          return (
            <div
              key={`${imgUrl}-${index}`}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-white transition-all shadow-xs ${
                isPrimary
                  ? 'border-maribel-700 ring-2 ring-maribel-700/20'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <img
                src={resolved}
                alt={`Estuche combo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Badge de Portada */}
              {isPrimary && (
                <div className="absolute top-1 left-1 bg-maribel-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Portada</span>
                </div>
              )}

              {/* Botón para establecer como portada si no lo es */}
              {!isPrimary && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  title="Establecer como portada"
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-maribel-700 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star className="w-3 h-3" />
                </button>
              )}

              {/* Botón para eliminar foto */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                title="Eliminar foto"
                className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Slot para añadir más fotos */}
        {effectiveImages.length < maxImages && (
          <label
            className={`aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-maribel-600 bg-white hover:bg-stone-50 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-maribel-700 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5 text-stone-400 mb-0.5" />
                <span className="text-[10px] font-medium text-stone-500">
                  + Foto
                </span>
                <span className="text-[9px] text-stone-400">
                  Foto {effectiveImages.length + 1}
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              onChange={handleMultipleFilesUpload}
              className="sr-only"
            />
          </label>
        )}
      </div>

      {/* Acciones de carga de fotos */}
      <div className="space-y-2 pt-1">
        {/* Botón principal de carga de archivo múltiple a ancho completo */}
        <label
          className={`w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 hover:border-maribel-700/50 shadow-2xs transition-all ${
            isUploading || effectiveImages.length >= maxImages
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-maribel-700" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-stone-500" />
          )}
          <span>
            {isUploading
              ? 'Subiendo fotos...'
              : 'Subir fotos desde el equipo (múltiples)'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={isUploading || effectiveImages.length >= maxImages}
            onChange={handleMultipleFilesUpload}
            className="sr-only"
          />
        </label>

        {/* Input para agregar URL manual a ancho completo con botón Agregar visible */}
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl(e);
              }
            }}
            placeholder="O pegar URL de imagen..."
            disabled={effectiveImages.length >= maxImages}
            className="flex-1 min-w-0 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-maribel-700 focus:ring-1 focus:ring-maribel-700/20 shadow-2xs disabled:bg-stone-100"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim() || effectiveImages.length >= maxImages}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>
      </div>

      <p className="text-[11px] text-stone-400">
        Sube hasta {maxImages} fotografías del estuche, empaque de regalo y botellas para que los clientes puedan deslizar la galería en la tienda online.
      </p>
    </div>
  );
};
