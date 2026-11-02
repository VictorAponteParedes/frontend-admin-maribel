import React, { useRef } from 'react';
import { Image, Upload, RotateCcw, Sparkles } from 'lucide-react';

export interface LogoUploaderProps {
  currentLogoUrl: string;
  isMonochromeMode: boolean;
  onToggleMonochrome: (isMonochrome: boolean) => void;
  onLogoChange: (url: string) => void;
  onResetDefault: () => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl,
  isMonochromeMode,
  onToggleMonochrome,
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
              Logotipo de la Tienda
            </h4>
            <p className="text-[11px] text-stone-500">
              Personaliza el isotipo para comprobantes y pantalla
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetDefault}
          className="text-[11px] text-stone-500 hover:text-stone-700 flex items-center space-x-1 font-medium transition-colors cursor-pointer"
          title="Restablecer logo predeterminado"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restablecer</span>
        </button>
      </div>

      {/* Preview Box & Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Visual Box */}
        <div
          className={`relative w-28 h-28 rounded-2xl border-2 flex items-center justify-center p-3 transition-all ${
            isMonochromeMode
              ? 'bg-stone-100 border-stone-400'
              : 'bg-rose-50/40 border-rose-200'
          }`}
        >
          <img
            src={currentLogoUrl || '/logo-maribel.png'}
            alt="Logo de la tienda"
            className={`max-w-full max-h-full object-contain transition-all ${
              isMonochromeMode ? 'grayscale contrast-200' : ''
            }`}
          />
          {isMonochromeMode && (
            <span className="absolute bottom-1 right-1 bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
              B/N
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2.5 w-full">
          <div>
            <span className="text-xs font-semibold text-stone-800 block mb-1.5">
              Variante de visualización
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleMonochrome(false)}
                className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  !isMonochromeMode
                    ? 'bg-rose-50/80 border-maribel-600 text-maribel-800 shadow-2xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-maribel-600" />
                <span>Color Oficial</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleMonochrome(true)}
                className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isMonochromeMode
                    ? 'bg-stone-800 border-stone-900 text-white shadow-2xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>B/N (Térmico)</span>
              </button>
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir nuevo logo</span>
            </button>
            <span className="text-[10px] text-stone-400 block text-center mt-1">
              PNG, JPG o SVG (Recomendado 512x512px, máx. 2MB)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
