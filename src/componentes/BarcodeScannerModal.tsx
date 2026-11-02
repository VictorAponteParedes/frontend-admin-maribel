import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeResult } from 'html5-qrcode';
import { Camera, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string, decodedResult: Html5QrcodeResult) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStoppingRef = useRef<boolean>(false);
  const scannerContainerId = 'html5-barcode-scanner-reader';

  // Sonido suave de confirmación al escanear (Web Audio API)
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 1200;
      gain.gain.value = 0.15;
      osc.start();
      setTimeout(() => {
        try {
          osc.stop();
          audioCtx.close();
        } catch {
          // No-op
        }
      }, 120);
    } catch {
      // Ignorar si el navegador bloquea audio sin interacción previa
    }
  };

  // Detención segura del escáner liberando recursos
  const safeStopScanner = async (scanner: Html5Qrcode | null) => {
    if (!scanner) return;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
      scanner.clear();
    } catch {
      // Evitar que errores como AbortError de HTML5 Video ensucien la consola
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setScannedCode(null);
      setCameraError(null);
      isStoppingRef.current = false;
      return;
    }

    let isMounted = true;
    isStoppingRef.current = false;
    setIsInitializing(true);
    setCameraError(null);
    setScannedCode(null);

    const startScanner = async () => {
      try {
        if (scannerRef.current) {
          await safeStopScanner(scannerRef.current);
        }

        if (!isMounted) return;

        const formatsToSupport = [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
        ];

        const html5QrCode = new Html5Qrcode(scannerContainerId, {
          formatsToSupport,
          verbose: false,
        });
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 280, height: 160 },
            aspectRatio: 1.3333,
          },
          async (decodedText: string, result: Html5QrcodeResult) => {
            if (!isMounted || isStoppingRef.current) return;
            isStoppingRef.current = true;

            console.log('====================================');
            console.log('📌 [Lector de Código de Barras] ¡Lectura Exitosa!');
            console.log('• Código / Texto Decodificado:', decodedText);
            console.log('• Formato Detectado:', result.result.format?.formatName ?? 'Desconocido');
            console.log('• Objeto Completo de Lectura:', result);
            console.log('====================================');

            playBeep();
            setScannedCode(decodedText);

            // Detener la cámara primero de forma limpia
            await safeStopScanner(html5QrCode);

            if (isMounted) {
              onScan(decodedText, result);
              setTimeout(() => {
                onClose();
              }, 300);
            }
          },
          () => {
            // Frame continuo sin lectura (silencioso)
          }
        );

        if (isMounted) {
          setIsInitializing(false);
        }
      } catch (err) {
        if (!isMounted) return;
        setIsInitializing(false);
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo acceder a la cámara. Por favor verifica los permisos en el navegador.';
        setCameraError(message);
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      isMounted = false;
      isStoppingRef.current = true;
      clearTimeout(timer);
      if (scannerRef.current) {
        safeStopScanner(scannerRef.current);
      }
    };
  }, [isOpen, onClose, onScan]);

  const handleStopAndClose = async () => {
    isStoppingRef.current = true;
    await safeStopScanner(scannerRef.current);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-stone-200 overflow-hidden relative">
        {/* Encabezado */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-maribel-700">
              <Camera className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Escanear Código de Barras
              </h3>
              <p className="text-[11px] text-stone-500">
                Apunta la cámara al código de la caja o producto
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStopAndClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            title="Cerrar cámara"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visor de Cámara */}
        <div className="p-5 space-y-4">
          <div className="relative w-full aspect-4/3 bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
            {/* Contenedor renderizado por html5-qrcode */}
            <div
              id={scannerContainerId}
              className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
            />

            {/* Spinner de inicialización */}
            {isInitializing && !cameraError && (
              <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center space-y-2.5 text-white z-10">
                <RefreshCw className="w-7 h-7 text-maribel-400 animate-spin" />
                <span className="text-xs font-medium text-stone-300">
                  Solicitando permiso y activando cámara...
                </span>
              </div>
            )}

            {/* Pantalla de error si la cámara es denegada */}
            {cameraError && (
              <div className="absolute inset-0 bg-stone-900/95 flex flex-col items-center justify-center p-6 text-center text-white z-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-rose-300">
                    No se pudo abrir la cámara
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Asegúrate de permitir el acceso a la cámara en los permisos de tu navegador.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStopAndClose}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-medium rounded-xl text-stone-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* Pantalla de éxito momentánea */}
            {scannedCode && (
              <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-4 text-center text-white z-20 space-y-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                <span className="text-sm font-bold text-emerald-200">¡Código Detectado!</span>
                <span className="text-xs font-mono bg-stone-900/60 px-3 py-1 rounded-lg text-white border border-emerald-500/30">
                  {scannedCode}
                </span>
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs font-medium text-stone-600">
              Centra el código de barras dentro del marco
            </p>
            <p className="text-[11px] text-stone-400">
              Compatible con códigos EAN-13, UPC, Code 128 y QR. Al escanearlo se autocompletará el campo.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={handleStopAndClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
