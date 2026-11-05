import React from 'react';
import { Upload } from 'lucide-react';

interface EditWebProductImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditWebProductImageUploader: React.FC<EditWebProductImageUploaderProps> = ({
  imageUrl,
  onImageUrlChange,
  onFileUpload,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
        Imagen del Frasco / Perfume
      </label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 relative group">
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] text-center p-1">
              Sin foto
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>Subir imagen desde equipo</span>
            <input
              type="file"
              accept="image/*"
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
