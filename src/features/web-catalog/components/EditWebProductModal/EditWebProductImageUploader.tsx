import React from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { resolveImageUrl } from '@/services/files.service';

interface EditWebProductImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
}

export const EditWebProductImageUploader: React.FC<EditWebProductImageUploaderProps> = ({
  imageUrl,
  onImageUrlChange,
  onFileUpload,
  isUploading = false,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
        Imagen del Frasco / Perfume
      </label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 relative group">
          {isUploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-maribel-700 bg-rose-50/50">
              <Loader2 className="w-5 h-5 animate-spin mb-1" />
              <span className="text-[9px] font-semibold">Subiendo...</span>
            </div>
          ) : imageUrl ? (
            <img
              src={resolveImageUrl(imageUrl)}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-[10px] text-center p-1">
              <ImageIcon className="w-5 h-5 text-stone-300 mb-0.5" />
              <span>Sin foto</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <label
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 transition-colors ${
              isUploading
                ? 'opacity-50 cursor-not-allowed bg-stone-50'
                : 'hover:bg-stone-50 cursor-pointer'
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
              onChange={onFileUpload}
              className="sr-only"
            />
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="O pega una URL de imagen..."
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 outline-none focus:bg-white focus:border-maribel-700"
          />
        </div>
      </div>
    </div>
  );
};
