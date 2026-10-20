import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatearFecha, hoyTexto } from "./fechas";

// Una columna del reporte
export interface ColumnaExportacion<T> {
  encabezado: string;
  llavePropiedad: keyof T;
  // Opcional: transforma el valor antes de exportarlo (fechas, estados, etc.)
  formato?: (valor: unknown, fila: T) => string | number;
}

// Configuración visual del reporte
export interface ConfiguracionReporte {
  tituloPrincipal: string;
  nombreEmpresa?: string; // si no se envía, usa EMPRESA_POR_DEFECTO
  fecha?: string; // "dd/mm/aaaa"; si no se envía, usa la de hoy
  nombreArchivo?: string;
  accionPdf?: "descargar" | "abrir";
  logo?: string;
}

const EMPRESA_POR_DEFECTO = "Firolaiv";
const COLOR_PRINCIPAL: [number, number, number] = [39, 45, 77]; // marca-oscuro (#272d4d)
const COLOR_FILA_ALTERNA: [number, number, number] = [245, 245, 245];

// Formato listo para columnas de fecha: "2026-10-20T00:00..." -> "20 oct 2026"
export const textoFecha = (valor: unknown) =>
  typeof valor === "string" && valor.length >= 10 ? formatearFecha(valor) : "";

// "2026-10-15" -> "15/10/2026"
const fechaDeHoy = () => {
  const [anio, mes, dia] = hoyTexto().split("-");
  return `${dia}/${mes}/${anio}`;
};

// Valor final de una celda: aplica el formato de la columna o uno por defecto
function obtenerValor<T>(
  fila: T,
  columna: ColumnaExportacion<T>,
): string | number {
  const bruto = fila[columna.llavePropiedad];
  if (columna.formato) return columna.formato(bruto, fila);
  if (bruto === null || bruto === undefined) return "";
  if (typeof bruto === "number" || typeof bruto === "string") return bruto;
  if (typeof bruto === "boolean") return bruto ? "Sí" : "No";
  return String(bruto);
}

function armarFilas<T>(
  columnas: ColumnaExportacion<T>[],
  datos: T[],
): (string | number)[][] {
  return datos.map((fila) => columnas.map((col) => obtenerValor(fila, col)));
}

/**
 * EXPORTAR A PDF
 */
export function exportarTablaPDF<T>(
  config: ConfiguracionReporte,
  columnas: ColumnaExportacion<T>[],
  datos: T[],
): void {
  const doc = new jsPDF();
  const anchoPagina = doc.internal.pageSize.getWidth();
  const accion = config.accionPdf ?? "descargar";
  const nombreArchivo = config.nombreArchivo ?? "reporte";

  let posicionXTexto = 14;

  if (config.logo) {
    // Parámetros: imagen, formato, X, Y, Ancho, Alto
    // Usamos 'PNG' (funciona para PNGs transparentes y JPEGs en jsPDF)
    doc.addImage(config.logo, 'PNG', 14, 10, 20, 20);
    
    // Desplazamos el texto a la derecha (14 inicial + 20 ancho logo + 5 de margen = 39)
    posicionXTexto = 39; 
  }

  // Encabezado: empresa, título y fecha
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR_PRINCIPAL);
 doc.text(config.nombreEmpresa ?? EMPRESA_POR_DEFECTO, posicionXTexto, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(config.tituloPrincipal, posicionXTexto, 25);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Fecha de emisión: ${config.fecha ?? fechaDeHoy()}`,
    anchoPagina - 14,
    18,
    { align: "right" },
  );

  // Línea separadora (siempre se dibuja)
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 32, anchoPagina - 14, 26);

  if (datos.length === 0) {
    doc.setFontSize(10);
    doc.text("No hay registros para mostrar.", 14, 42);
  } else {
    autoTable(doc, {
      head: [columnas.map((col) => col.encabezado)],
      body: armarFilas(columnas, datos),
      startY: 36,
      styles: { fontSize: 9 },
      headStyles: { fillColor: COLOR_PRINCIPAL, textColor: 255 },
      alternateRowStyles: { fillColor: COLOR_FILA_ALTERNA },
    });
  }

  if (accion === "descargar") {
    doc.save(`${nombreArchivo}.pdf`);
  } else {
    const url = URL.createObjectURL(doc.output("blob"));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

/**
 * EXPORTAR A EXCEL
 */
export function exportarTablaExcel<T>(
  config: ConfiguracionReporte,
  columnas: ColumnaExportacion<T>[],
  datos: T[],
): void {
  const nombreArchivo = config.nombreArchivo ?? "reporte";
  const empresa = config.nombreEmpresa ?? EMPRESA_POR_DEFECTO;
  const encabezados = columnas.map((col) => col.encabezado);
  const filas = armarFilas(columnas, datos);

  // Fila 1: título, fila 2: en blanco, fila 3: encabezados, luego los datos
  // (así, aunque no haya registros, el archivo conserva sus encabezados)
  const hoja = XLSX.utils.aoa_to_sheet([
    [`${empresa} - ${config.tituloPrincipal}`],
    [],
    encabezados,
    ...filas,
  ]);

  // Ancho de cada columna según su contenido más largo (máximo 40)
  hoja["!cols"] = encabezados.map((encabezado, i) => {
    const largo = filas.reduce(
      (max, fila) => Math.max(max, String(fila[i]).length),
      encabezado.length,
    );
    return { wch: Math.min(40, largo + 2) };
  });

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Datos");
  XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
}