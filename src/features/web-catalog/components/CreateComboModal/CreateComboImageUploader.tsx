import React from 'react';
import { Gift, Upload, Loader2 } from 'lucide-react';
import { resolveImageUrl } from '@/services/files.service';

interface CreateComboImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
}

export const CreateComboImageUploader: React.FC<CreateComboImageUploaderProps> = ({
  imageUrl,
  onImageUrlChange,
  onFileUpload,
  isUploading = false,
}) => {
  return (
    <div className="bg-stone-50/60 border border-stone-200/90 rounded-2xl p-5 space-y-3">
      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
        Foto de la Caja / Estuche de Regalo
      </label>

      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-2xl bg-white border border-stone-200 overflow-hidden flex-shrink-0 shadow-xs relative">
          {isUploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-maribel-700 bg-rose-50/50">
              <Loader2 className="w-6 h-6 animate-spin mb-1" />
              <span className="text-[10px] font-semibold">Subiendo...</span>
            </div>
          ) : imageUrl ? (
            <img
              src={resolveImageUrl(imageUrl)}
              alt="Estuche"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Si la imagen falla al cargar, mostrar fallback visual
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-[11px] text-center p-2">
              <Gift className="w-6 h-6 text-stone-300 mb-1" />
              <span>Foto del Set</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2.5">
          <label className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-xs ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-maribel-700" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-stone-500" />
            )}
            <span>{isUploading ? 'Procesando archivo...' : 'Subir foto de la caja'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={onFileUpload}
              className="sr-only"
            />
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="O pega URL de foto del estuche..."
            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:border-maribel-700 shadow-xs"
          />
        </div>
      </div>
      <p className="text-[11px] text-stone-400">
        Sube una fotografía de las fragancias presentadas en la caja con su lazo para enamorar en la tienda online.
      </p>
    </div>
  );
};
