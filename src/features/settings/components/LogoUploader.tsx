import React, { useRef, useState } from 'react';
import { Image, Upload, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { filesService, resolveImageUrl } from '@/services/files.service';
import { toast } from '@/store/useToastStore';

export interface LogoUploaderProps {
  currentLogoUrl: string;
  onLogoChange: (url: string) => void;
  onResetDefault: () => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl,
  onLogoChange,
  onResetDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Archivo muy grande', 'La imagen no debe superar los 2MB');
      return;
    }

    try {
      setIsUploading(true);
      const uploaded = await filesService.uploadFile(file, 'Logotipo de la Tienda Web');
      onLogoChange(uploaded.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el logotipo al servidor';
      toast.error('Error de subida', msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-rose-50 rounded-lg text-maribel-700">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Logotipo de la Tienda Web
            </h4>
            <p className="text-[11px] text-stone-500">
              Imagen de cabecera y pie de página de la tienda del cliente
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={isUploading}
          onClick={onResetDefault}
          leftIcon={<RotateCcw className="w-3 h-3" />}
          title="Restablecer logo predeterminado"
        >
          <span>Restablecer</span>
        </Button>
      </div>

      {/* Preview Box & Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Visual Box */}
        <div className="relative w-28 h-28 rounded-2xl border-2 border-rose-200 bg-rose-50/40 flex items-center justify-center p-3 shadow-2xs">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center text-maribel-700">
              <Loader2 className="w-6 h-6 animate-spin mb-1" />
              <span className="text-[10px] font-semibold">Subiendo...</span>
            </div>
          ) : (
            <img
              src={resolveImageUrl(currentLogoUrl) || '/logo-maribel.png'}
              alt="Logo de la tienda"
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center space-x-2 text-xs text-stone-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Visible en la barra de navegación y en el footer de la web</span>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              leftIcon={
                isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-maribel-700" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-maribel-700" />
                )
              }
              className="w-full py-2.5 font-bold text-stone-800"
            >
              <span>{isUploading ? 'Subiendo imagen...' : 'Subir nuevo logotipo'}</span>
            </Button>
            <span className="text-[10px] text-stone-400 block text-center mt-1.5">
              PNG transparente, SVG o JPG (512x512px recomendado, máx. 2MB)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
