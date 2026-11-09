import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { filesService, resolveImageUrl } from '@/services/files.service';
import { toast } from '@/store/useToastStore';

export interface ProductImageUploaderProps {
  imageUrl?: string | null;
  imageId?: string | null;
  onImageChange: (data: { imageUrl: string; imageId?: string }) => void;
  label?: string;
  className?: string;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  imageUrl = '',
  imageId,
  onImageChange,
  label = 'Imagen del Producto',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl || '');

  // Mantener preview sincronizado si imageUrl cambia externamente
  React.useEffect(() => {
    setPreviewUrl(imageUrl || '');
  }, [imageUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vista previa inmediata con blob URL local
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      setIsUploading(true);
      const uploaded = await filesService.uploadFile(file, `Perfume: ${file.name}`);
      setPreviewUrl(uploaded.url);
      onImageChange({
        imageUrl: uploaded.url,
        imageId: uploaded.id,
      });
      toast.success('Imagen subida', 'La foto del perfume se subió correctamente.');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al subir la imagen al servidor.';
      toast.error('Error al subir imagen', message);
      setPreviewUrl(imageUrl || '');
    } finally {
      setIsUploading(false);
      // Limpiar input file para permitir seleccionar el mismo archivo si se desea
      e.target.value = '';
    }
  };

  const handleUrlChange = (value: string) => {
    setPreviewUrl(value);
    onImageChange({
      imageUrl: value,
      imageId: value ? imageId || undefined : undefined,
    });
  };

  const handleClearImage = () => {
    setPreviewUrl('');
    onImageChange({ imageUrl: '', imageId: undefined });
  };

  const currentDisplayUrl = previewUrl ? resolveImageUrl(previewUrl) : '';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-stone-700">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4">
        {/* Preview Box */}
        <div className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 relative group">
          {isUploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-maribel-700 bg-rose-50/50">
              <Loader2 className="w-5 h-5 animate-spin mb-1" />
              <span className="text-[9px] font-semibold">Subiendo...</span>
            </div>
          ) : currentDisplayUrl ? (
            <>
              <img
                src={currentDisplayUrl}
                alt="Vista previa del producto"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={handleClearImage}
                title="Quitar imagen"
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-[10px] text-center p-1">
              <ImageIcon className="w-6 h-6 text-stone-300 mb-0.5" />
              <span>Sin foto</span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <label
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 transition-colors ${
              isUploading
                ? 'opacity-50 cursor-not-allowed bg-stone-50'
                : 'hover:bg-stone-50 cursor-pointer bg-white'
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-maribel-700" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-stone-500" />
            )}
            <span>{isUploading ? 'Procesando archivo...' : 'Subir imagen desde equipo'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>

          <input
            type="text"
            value={previewUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="O pega una URL de imagen..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 outline-none focus:bg-white focus:border-maribel-700 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
