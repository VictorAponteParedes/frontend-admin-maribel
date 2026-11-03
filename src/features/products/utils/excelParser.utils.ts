import * as XLSX from 'xlsx';
import { BulkImportProductItem } from '../types/product.types';

export interface ParseExcelResult {
  validItems: BulkImportProductItem[];
  invalidRowsCount: number;
  errors: string[];
}

export const parseExcelProductFile = async (
  file: File,
): Promise<ParseExcelResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          return resolve({
            validItems: [],
            invalidRowsCount: 0,
            errors: ['El archivo Excel está vacío o no contiene hojas de cálculo.'],
          });
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
        });

        if (rawRows.length === 0) {
          return resolve({
            validItems: [],
            invalidRowsCount: 0,
            errors: ['No se encontraron filas con datos en la primera hoja.'],
          });
        }

        const validItems: BulkImportProductItem[] = [];
        const errors: string[] = [];
        let invalidRowsCount = 0;

        rawRows.forEach((row, index) => {
          const rowNumber = index + 2; // Considerando fila 1 como encabezados

          // Buscar campos mediante coincidencia de nombres normalizados (alineados con la tabla del sistema)
          const barcode = findCellValue(row, ['codigosku', 'codigo / sku', 'codigo/sku', 'codigo', 'código', 'sku', 'barcode', 'cod', 'ean', 'upc']);
          const brand = findCellValue(row, ['marca', 'brand', 'fabricante']) || 'Genérica';
          const name = findCellValue(row, [
            'descripcion de producto',
            'descripcion del producto',
            'descripcióndeproducto',
            'descripcion',
            'descripción',
            'fragancia',
            'producto',
            'nombre',
            'name',
          ]);
          const size = findCellValue(row, ['medida', 'tamaño', 'tamano', 'size', 'ml', 'volumen']) || '100 ml';
          const category = findCellValue(row, ['categoria', 'categoría', 'category', 'genero', 'género']);

          const rawCostPrice = findCellValue(row, ['precio compra', 'preciocompra', 'precio_compra', 'compra', 'costo', 'precio costo', 'unit_cost']);
          const rawSellingPrice = findCellValue(row, ['precio venta', 'precioventa', 'precio_venta', 'venta', 'precio', 'pvp', 'price']);
          const rawQuantity = findCellValue(row, ['ingreso', 'cantidad ingreso', 'stock', 'cantidad', 'cant', 'unidades', 'saldo stock', 'qty']);
          const receptionDate = findCellValue(row, ['fecha recep.', 'fecha recep', 'fecharecep', 'fecha recepcion', 'fecha recepción', 'fecha', 'date']);

          // Validar campos indispensables: barcode y nombre
          if (!barcode || !name) {
            invalidRowsCount++;
            errors.push(
              `Fila ${rowNumber}: Falta código de barras o nombre del producto.`,
            );
            return;
          }

          const costPrice = rawCostPrice ? parseNumeric(rawCostPrice) : undefined;
          const sellingPrice = rawSellingPrice ? parseNumeric(rawSellingPrice) : undefined;
          const quantity = rawQuantity ? Math.max(0, parseInt(String(rawQuantity), 10) || 0) : 0;
          const formattedDate = normalizeToIsoDate(receptionDate);

          validItems.push({
            barcode: String(barcode).trim(),
            name: String(name).trim(),
            brandName: String(brand).trim(),
            size: String(size).trim(),
            category: category ? String(category).trim() : undefined,
            costPrice,
            sellingPrice,
            quantity,
            receptionDate: formattedDate,
          });
        });

        resolve({
          validItems,
          invalidRowsCount,
          errors,
        });
      } catch (err: any) {
        reject(
          new Error(
            err.message || 'Error al procesar el archivo Excel. Verifica su formato.',
          ),
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Error de lectura del archivo en el navegador.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

function findCellValue(
  row: Record<string, any>,
  matchKeys: string[],
): any {
  const rowKeys = Object.keys(row);

  for (const match of matchKeys) {
    const foundKey = rowKeys.find((key) => {
      const normalized = key.toLowerCase().trim().replace(/[\s_-]+/g, '');
      const search = match.toLowerCase().trim().replace(/[\s_-]+/g, '');
      return normalized === search || normalized.includes(search);
    });

    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
      return row[foundKey];
    }
  }

  return undefined;
}

function parseNumeric(val: any): number | undefined {
  if (typeof val === 'number') return isNaN(val) ? undefined : val;
  const clean = String(val)
    .replace(/[^\d.-]/g, '')
    .trim();
  const num = parseFloat(clean);
  return isNaN(num) ? undefined : num;
}

function normalizeToIsoDate(val: any): string | undefined {
  if (!val) return undefined;

  // Si es un objeto Date
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.toISOString().split('T')[0];
  }

  // Si es número (número de serie de fecha de Excel)
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  const str = String(val).trim();
  if (!str) return undefined;

  // Si ya es formato ISO YYYY-MM-DD
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(str)) {
    const parts = str.split(/[-/]/);
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].substring(0, 2).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Si es formato latino DD/MM/YYYY o DD-MM-YYYY
  const parts = str.split(/[-/]/);
  if (parts.length === 3) {
    const day = parts[0].trim().padStart(2, '0');
    const month = parts[1].trim().padStart(2, '0');
    let year = parts[2].trim();
    if (year.length === 2) year = `20${year}`;
    if (year.length === 4) {
      const iso = `${year}-${month}-${day}`;
      const parsed = new Date(iso);
      if (!isNaN(parsed.getTime())) {
        return iso;
      }
    }
  }

  // Intento con Date.parse
  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp).toISOString().split('T')[0];
  }

  return undefined;
}

export const downloadExcelProductTemplate = () => {
  const sampleData = [
    {
      'CODIGO / SKU': '6972011068673',
      'MARCA': 'COOL GIRL',
      'DESCRIPCION DE PRODUCTO': "IT'S SO GOOD TO BE BAD",
      'MEDIDA': '85 ml / 2.9 fl oz',
      'FECHA RECEP.': '31/10/2026',
      'PRECIO COMPRA': 120000,
      'PRECIO VENTA': 185000,
      'INGRESO': 12,
    },
    {
      'CODIGO / SKU': '6936664302591',
      'MARCA': 'COOL GIRL',
      'DESCRIPCION DE PRODUCTO': 'VELVET FATALE - EAU DE PARFUM NATURAL SPRAY',
      'MEDIDA': '85 ml / 2.9 fl oz',
      'FECHA RECEP.': '31/10/2026',
      'PRECIO COMPRA': 130000,
      'PRECIO VENTA': 195000,
      'INGRESO': 12,
    },
    {
      'CODIGO / SKU': '6936664330587',
      'MARCA': 'COOL GIRL',
      'DESCRIPCION DE PRODUCTO': "Very - IT'S SO GOOD TO BE BAD - EAU DE PARFUM",
      'MEDIDA': '85 ml / 2.9 fl oz',
      'FECHA RECEP.': '01/11/2026',
      'PRECIO COMPRA': 125000,
      'PRECIO VENTA': 190000,
      'INGRESO': 12,
    },
    {
      'CODIGO / SKU': '6936664330655',
      'MARCA': 'COOL GIRL',
      'DESCRIPCION DE PRODUCTO': 'IT\'S SO GOOD TO BE BAD - EAU DE PARFUM NATU',
      'MEDIDA': '85 ml / 2.9 fl oz',
      'FECHA RECEP.': '01/11/2026',
      'PRECIO COMPRA': 120000,
      'PRECIO VENTA': 185000,
      'INGRESO': 12,
    },
    {
      'CODIGO / SKU': '6936664300856',
      'MARCA': 'STORY OF FLOWER',
      'DESCRIPCION DE PRODUCTO': 'PERFUME eau de toilette',
      'MEDIDA': '50 ml / 1.7 FL. OZ.',
      'FECHA RECEP.': '28/10/2026',
      'PRECIO COMPRA': 75000,
      'PRECIO VENTA': 120000,
      'INGRESO': 25,
    },
    {
      'CODIGO / SKU': '7701234567890',
      'MARCA': 'GIORGIO ARMANI',
      'DESCRIPCION DE PRODUCTO': 'ACQUA DI GIO - EAU DE TOILETTE',
      'MEDIDA': '100 ml / 3.4 fl oz',
      'FECHA RECEP.': '03/11/2026',
      'PRECIO COMPRA': '', // Opcional (puede quedar vacío)
      'PRECIO VENTA': '',  // Opcional (puede quedar vacío)
      'INGRESO': 10,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // Ancho óptimo de columnas idénticas a la vista
  worksheet['!cols'] = [
    { wch: 18 }, // CODIGO / SKU
    { wch: 20 }, // MARCA
    { wch: 50 }, // DESCRIPCION DE PRODUCTO
    { wch: 22 }, // MEDIDA
    { wch: 16 }, // FECHA RECEP.
    { wch: 16 }, // PRECIO COMPRA
    { wch: 16 }, // PRECIO VENTA
    { wch: 12 }, // INGRESO
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
  XLSX.writeFile(workbook, 'plantilla_inventario_maribel.xlsx');
};
