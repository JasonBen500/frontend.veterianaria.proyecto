// jspdf y xlsx pesan bastante: se cargan solo cuando alguien exporta
import { formatearFecha, hoyTexto } from "./fechas";
import {
  ALTO_PIE,
  AZUL_SUAVE,
  BEIGE,
  BEIGE_CALIDO,
  EMPRESA,
  ESLOGAN,
  GRIS,
  MARGEN,
  NARANJA,
  NARANJA_SUAVE,
  OSCURO,
  cargarLogo,
  dibujarPie,
  huella,
  hueso,
} from "./pdfEstilo";

// Carga jspdf y su plugin de tablas solo cuando se necesitan
export async function cargarLibreriasPdf() {
  const [pdf, tabla] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  return { jsPDF: pdf.default, autoTable: tabla.default };
}

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
export async function exportarTablaPDF<T>(
  config: ConfiguracionReporte,
  columnas: ColumnaExportacion<T>[],
  datos: T[],
): Promise<void> {
  const accion = config.accionPdf ?? "descargar";
  const nombreArchivo = config.nombreArchivo ?? "reporte";

  // Se abre la pestaña antes de esperar la carga para que el navegador no la bloquee
  const ventana = accion === "abrir" ? window.open("", "_blank") : null;
  const { jsPDF, autoTable } = await cargarLibreriasPdf().catch((error) => {
    ventana?.close();
    throw error;
  });
  const logo = config.logo ? null : await cargarLogo();

  const doc = new jsPDF();
  const ancho = doc.internal.pageSize.getWidth();

  // ---------- Encabezado ----------
  doc.setFillColor(...BEIGE);
  doc.rect(0, 0, ancho, 36, "F");
  doc.setFillColor(...NARANJA);
  doc.rect(0, 36, ancho, 2.2, "F");

  huella(doc, 112, 12, 10, NARANJA_SUAVE);
  huella(doc, 132, 28, 8, AZUL_SUAVE);
  hueso(doc, 86, 28, 18, AZUL_SUAVE);

  let xEslogan = MARGEN;
  let yEslogan = 29.5;
  if (config.logo) {
    // Logo enviado por quien llama (cuadrado)
    doc.addImage(config.logo, "PNG", MARGEN, 8, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...OSCURO);
    doc.text(config.nombreEmpresa ?? EMPRESA, MARGEN + 24, 16);
    xEslogan = MARGEN + 24;
    yEslogan = 22;
  } else if (logo) {
    doc.addImage(logo.data, "PNG", MARGEN, 6, 36, 36 * logo.proporcion);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...OSCURO);
    doc.text(config.nombreEmpresa ?? EMPRESA, MARGEN, 18);
    yEslogan = 26;
  }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...GRIS);
  doc.text(ESLOGAN, xEslogan, yEslogan);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...OSCURO);
  doc.text(config.tituloPrincipal, ancho - MARGEN, 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(
    `Fecha de emisión: ${config.fecha ?? fechaDeHoy()}`,
    ancho - MARGEN,
    22,
    { align: "right" },
  );

  const anchoPastilla = 34;
  doc.setFillColor(...OSCURO);
  doc.roundedRect(
    ancho - MARGEN - anchoPastilla,
    25,
    anchoPastilla,
    7,
    3.5,
    3.5,
    "F",
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${datos.length} ${datos.length === 1 ? "registro" : "registros"}`,
    ancho - MARGEN - anchoPastilla / 2,
    29.8,
    { align: "center" },
  );

  // ---------- Contenido ----------
  if (datos.length === 0) {
    doc.setFillColor(...BEIGE);
    doc.setDrawColor(...BEIGE_CALIDO);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGEN, 48, ancho - 2 * MARGEN, 22, 3, 3, "FD");
    huella(doc, MARGEN + 12, 57, 9, NARANJA);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...GRIS);
    doc.text("No hay registros para mostrar.", MARGEN + 24, 60);
  } else {
    autoTable(doc, {
      head: [columnas.map((col) => col.encabezado)],
      body: armarFilas(columnas, datos),
      startY: 46,
      theme: "striped",
      margin: { left: MARGEN, right: MARGEN, top: 18, bottom: ALTO_PIE + 8 },
      styles: { fontSize: 9, cellPadding: 2.8, textColor: [60, 60, 60] },
      headStyles: {
        fillColor: OSCURO,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: BEIGE },
    });
  }

  dibujarPie(doc);

  if (accion === "descargar") {
    doc.save(`${nombreArchivo}.pdf`);
  } else {
    const url = URL.createObjectURL(doc.output("blob"));
    if (ventana) {
      ventana.location.href = url;
    } else {
      window.open(url, "_blank");
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

/**
 * EXPORTAR A EXCEL
 */
export async function exportarTablaExcel<T>(
  config: ConfiguracionReporte,
  columnas: ColumnaExportacion<T>[],
  datos: T[],
): Promise<void> {
  const XLSX = await import("xlsx");
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