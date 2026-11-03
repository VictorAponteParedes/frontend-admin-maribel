import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  PackageCheck,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { toast } from '@/store/useToastStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { formatCurrency } from '@/utils/formatters';
import {
  parseExcelProductFile,
  ParseExcelResult,
  downloadExcelProductTemplate,
} from '../utils/excelParser.utils';

export interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { bulkImport } = useInventoryStore();

  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parseResult, setParseResult] = useState<ParseExcelResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    setIsParsing(false);
    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext),
    );

    if (!hasValidExt) {
      toast.error(
        'Formato no compatible',
        'Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv).',
      );
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);

    try {
      const result = await parseExcelProductFile(selectedFile);
      setParseResult(result);

      if (result.validItems.length === 0) {
        toast.warning(
          'Archivo sin productos',
          'No se pudieron extraer productos válidos con código de barras y nombre.',
        );
      } else {
        toast.info(
          'Archivo analizado',
          `Se detectaron ${result.validItems.length} productos listos para importar.`,
        );
      }
    } catch (err: any) {
      toast.error('Error al leer Excel', err.message);
      handleReset();
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = async () => {
    if (!parseResult || parseResult.validItems.length === 0) return;

    setIsImporting(true);
    try {
      const summary = await bulkImport(parseResult.validItems);

      toast.success(
        'Carga masiva completada',
        `Se procesaron ${summary.totalProcessed} productos (${summary.inserted} creados, ${summary.updated} stock actualizado).`,
      );

      handleReset();
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Ocurrió un error al guardar los productos en la base de datos.';
      toast.error('Error de importación', message);
    } finally {
      setIsImporting(false);
    }
  };

  const items = parseResult?.validItems || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Carga Masiva de Productos y Stock
              </h3>
              <p className="text-xs text-stone-500">
                Sube una planilla Excel (.xlsx) o CSV con tu catálogo e inventario
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {!file && (
            <>
              {/* Banner con botón de descarga de plantilla modelo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-950">
                      ¿Necesitas un modelo para cargar tus datos?
                    </p>
                    <p className="text-emerald-700/80">
                      Descarga nuestra plantilla oficial con ejemplos de columnas ya ordenadas.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50 shrink-0 shadow-xs"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={downloadExcelProductTemplate}
                >
                  Descargar Plantilla (.xlsx)
                </Button>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl p-8 text-center cursor-pointer bg-stone-50/60 hover:bg-stone-50 transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-stone-200/80 flex items-center justify-center text-stone-700">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    Arrastra tu archivo Excel aquí o haz clic para seleccionarlo
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Formatos aceptados: .xlsx, .xls, .csv (hasta 10.000 filas)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </>
          )}

          {isParsing && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-stone-700 animate-spin" />
              <p className="text-sm text-stone-600 font-medium">
                Analizando y validando columnas del archivo...
              </p>
            </div>
          )}

          {file && !isParsing && parseResult && (
            <div className="space-y-4">
              {/* Barra de estado del archivo */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-stone-900 truncate max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-stone-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  Cambiar archivo
                </button>
              </div>

              {/* Métricas del archivo analizado */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider">
                      Válidos para importar
                    </p>
                    <p className="text-base font-bold text-emerald-800">
                      {items.length} productos
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center space-x-2.5">
                  <PackageCheck className="w-4 h-4 text-stone-600 shrink-0" />
                  <div>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider">
                      Stock total a ingresar
                    </p>
                    <p className="text-base font-bold text-stone-900">
                      {items.reduce((acc, it) => acc + (it.quantity || 0), 0)} u.
                    </p>
                  </div>
                </div>

                {parseResult.invalidRowsCount > 0 && (
                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-center space-x-2.5 col-span-2 sm:col-span-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider">
                        Filas omitidas
                      </p>
                      <p className="text-base font-bold text-amber-800">
                        {parseResult.invalidRowsCount}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vista previa de los datos */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>Previsualización de los primeros productos:</span>
                  <span>Mostrando {Math.min(items.length, 50)} de {items.length}</span>
                </div>

                <div className="border border-stone-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200 sticky top-0 bg-stone-50">
                      <tr>
                        <th className="px-3 py-2">Código / SKU</th>
                        <th className="px-3 py-2">Marca</th>
                        <th className="px-3 py-2">Descripción de Producto</th>
                        <th className="px-3 py-2">Medida</th>
                        <th className="px-3 py-2 text-right">Ingreso</th>
                        <th className="px-3 py-2 text-right">Precio Compra</th>
                        <th className="px-3 py-2 text-right">Precio Venta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {items.slice(0, 50).map((it, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="px-3 py-2 font-mono font-semibold text-stone-900">
                            {it.barcode}
                          </td>
                          <td className="px-3 py-2 font-medium text-stone-800">
                            {it.brandName}
                          </td>
                          <td className="px-3 py-2 text-stone-700 max-w-xs truncate">
                            {it.name}
                          </td>
                          <td className="px-3 py-2 text-stone-500">{it.size || '-'}</td>
                          <td className="px-3 py-2 text-right font-bold text-stone-900">
                            {it.quantity || 0}
                          </td>
                          <td className="px-3 py-2 text-right text-stone-500">
                            {it.costPrice ? formatCurrency(it.costPrice) : '-'}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-stone-900">
                            {it.sellingPrice ? formatCurrency(it.sellingPrice) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
          <p className="text-xs text-stone-400">
            Los precios vacíos son permitidos y se guardarán como no obligatorios.
          </p>
          <div className="flex items-center space-x-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleReset();
                onClose();
              }}
              disabled={isImporting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!file || items.length === 0 || isImporting}
              isLoading={isImporting}
              onClick={handleConfirmImport}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              {isImporting
                ? 'Importando...'
                : `Confirmar e Importar (${items.length})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
