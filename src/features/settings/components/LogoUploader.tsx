import React, { useRef } from 'react';
import { Image, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar los 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onLogoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
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
          <img
            src={currentLogoUrl || '/logo-maribel.png'}
            alt="Logo de la tienda"
            className="max-w-full max-h-full object-contain"
          />
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
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-3.5 h-3.5 text-maribel-700" />}
              className="w-full py-2.5 font-bold text-stone-800"
            >
              <span>Subir nuevo logotipo</span>
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
