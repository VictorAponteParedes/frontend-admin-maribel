import React, { useState } from 'react';
import { Upload, Loader2, X, Star, Plus } from 'lucide-react';
import { resolveImageUrl, filesService } from '@/services/files.service';
import { toast } from '@/store/useToastStore';

interface EditWebProductImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const EditWebProductImageUploader: React.FC<EditWebProductImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 4,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      toast.warning('Límite alcanzado', `Máximo ${maxImages} imágenes por producto.`);
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of filesToUpload) {
        const res = await filesService.uploadFile(file, `Producto: ${file.name}`);
        if (res?.url) {
          uploadedUrls.push(res.url);
        }
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
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
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;

    if (images.length >= maxImages) {
      toast.warning('Límite alcanzado', `Máximo ${maxImages} imágenes por producto.`);
      return;
    }

    onImagesChange([...images, cleanUrl]);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(updated);
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    const selected = images[indexToPrimary];
    const rest = images.filter((_, idx) => idx !== indexToPrimary);
    onImagesChange([selected, ...rest]);
    toast.info('Foto principal actualizada', 'La imagen seleccionada ahora es la portada.');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">
          Galería de Fotos del Perfume ({images.length}/{maxImages})
        </label>
        <span className="text-[11px] text-stone-400">
          La primera foto es la principal
        </span>
      </div>

      {/* Grid de Fotos Cargadas */}
      <div className="grid grid-cols-4 gap-2.5">
        {images.map((imgUrl, index) => {
          const isPrimary = index === 0;
          return (
            <div
              key={`${imgUrl}-${index}`}
              className={`relative aspect-square rounded-xl bg-stone-100 border overflow-hidden group transition-all ${
                isPrimary
                  ? 'border-maribel-700 ring-2 ring-maribel-700/20 shadow-xs'
                  : 'border-stone-200'
              }`}
            >
              <img
                src={resolveImageUrl(imgUrl)}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Badge Principal */}
              {isPrimary ? (
                <span className="absolute bottom-1 left-1 bg-maribel-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 pointer-events-none">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Portada</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  title="Establecer como foto principal"
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/90 text-white text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 cursor-pointer"
                >
                  <Star className="w-2.5 h-2.5" />
                  <span>Principal</span>
                </button>
              )}

              {/* Botón Eliminar */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                title="Quitar foto"
                className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Slot para agregar más fotos si no ha llegado al límite */}
        {images.length < maxImages && (
          <label
            className={`aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-maribel-700 flex flex-col items-center justify-center p-2 text-center transition-colors cursor-pointer bg-stone-50/50 hover:bg-rose-50/20 ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-maribel-700 mb-1" />
            ) : (
              <Plus className="w-5 h-5 text-stone-400 group-hover:text-maribel-700 mb-1" />
            )}
            <span className="text-[10px] font-bold text-stone-600 leading-tight">
              {isUploading ? 'Subiendo...' : '+ Foto'}
            </span>
            <span className="text-[9px] text-stone-400">
              {images.length === 0 ? 'Portada' : `Foto ${images.length + 1}`}
            </span>
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

      {/* Controles para Subida y URL */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <label
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 transition-colors bg-white shadow-2xs ${
            isUploading || images.length >= maxImages
              ? 'opacity-50 cursor-not-allowed bg-stone-100'
              : 'hover:bg-stone-50 cursor-pointer'
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-maribel-700" />
          ) : (
            <Upload className="w-4 h-4 text-stone-500" />
          )}
          <span>{isUploading ? 'Cargando fotos...' : 'Subir fotos desde equipo (múltiples)'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={isUploading || images.length >= maxImages}
            onChange={handleMultipleFilesUpload}
            className="sr-only"
          />
        </label>

        {/* Input de URL manual */}
        <div className="flex-1 w-full flex items-center gap-1.5">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="O pegar URL de imagen..."
            disabled={images.length >= maxImages}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:bg-white focus:border-maribel-700 transition-colors disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim() || images.length >= maxImages}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
