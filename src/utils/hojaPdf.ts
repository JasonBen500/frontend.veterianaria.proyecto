import type { jsPDF as DocumentoPdf } from "jspdf";
import type { RowInput } from "jspdf-autotable";
import { cargarLibreriasPdf } from "./exportar";
import type { HojaCita } from "../types/hoja";
import { formatearFecha } from "./fechas";
import {
  ALTO_PIE,
  AZUL_SUAVE,
  BEIGE,
  BEIGE_CALIDO,
  CORAL,
  EMPRESA,
  ESLOGAN,
  GRIS,
  MARGEN as M,
  NARANJA,
  NARANJA_SUAVE,
  OSCURO,
  VERDE,
  VERDE_SUAVE,
  cargarLogo,
  dibujarPie,
  huella,
  hueso,
} from "./pdfEstilo";

const dinero = (valor: number) => `Q${Number(valor).toFixed(2)}`;

const finalDeTabla = (doc: DocumentoPdf) =>
  (doc as DocumentoPdf & { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;

// Iconos blancos para las tarjetas
function iconoPersona(doc: DocumentoPdf, x: number, y: number) {
  doc.setFillColor(255, 255, 255);
  doc.circle(x, y - 1.6, 1.7, "F");
  doc.roundedRect(x - 2.7, y + 0.4, 5.4, 3.3, 1.5, 1.5, "F");
}

function iconoCruz(doc: DocumentoPdf, x: number, y: number) {
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x - 0.95, y - 2.7, 1.9, 5.4, 0.5, 0.5, "F");
  doc.roundedRect(x - 2.7, y - 0.95, 5.4, 1.9, 0.5, 0.5, "F");
}

export async function generarHojaPdf(
  hoja: HojaCita,
  accion: "descargar" | "abrir" = "descargar",
): Promise<void> {
  // Se abre la pestaña antes de esperar la carga para que el navegador no la bloquee
  const ventana = accion === "abrir" ? window.open("", "_blank") : null;
  const { jsPDF, autoTable } = await cargarLibreriasPdf().catch((error) => {
    ventana?.close();
    throw error;
  });
  const logo = await cargarLogo();

  const doc = new jsPDF();
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();
  const margenTabla = { left: M, right: M, top: 18, bottom: ALTO_PIE + 8 };

  // ---------- Encabezado ----------
  doc.setFillColor(...BEIGE);
  doc.rect(0, 0, ancho, 46, "F");
  doc.setFillColor(...NARANJA);
  doc.rect(0, 46, ancho, 2.2, "F");

  huella(doc, 120, 14, 11, NARANJA_SUAVE);
  huella(doc, 148, 36, 9, AZUL_SUAVE);
  hueso(doc, 100, 38, 22, AZUL_SUAVE);

  if (logo) {
    const anchoLogo = 46;
    doc.addImage(logo.data, "PNG", M, 8, anchoLogo, anchoLogo * logo.proporcion);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...OSCURO);
    doc.text(EMPRESA, M, 20);
  }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...GRIS);
  doc.text(ESLOGAN, M, 36, { maxWidth: 88 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...OSCURO);
  doc.text("INFORME DE ATENCIÓN", ancho - M, 18, { align: "right" });

  const anchoPastilla = 34;
  doc.setFillColor(...OSCURO);
  doc.roundedRect(ancho - M - anchoPastilla, 22, anchoPastilla, 8, 4, 4, "F");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`CITA #${hoja.idCita}`, ancho - M - anchoPastilla / 2, 27.3, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(formatearFecha(hoja.fecha), ancho - M, 37, { align: "right" });

  // ---------- Tarjetas: dueño, mascota y médico ----------
  const yTarjetas = 56;
  const separacion = 5;
  const anchoTarjeta = (ancho - 2 * M - 2 * separacion) / 3;
  const anchoTexto = anchoTarjeta - 10;

  const tarjetas = [
    {
      titulo: "Dueño",
      color: CORAL,
      icono: (x: number, y: number) => iconoPersona(doc, x, y),
      nombre: hoja.nombreDueno ?? "-",
      detalle: hoja.telefonoDueno ? `Tel. ${hoja.telefonoDueno}` : "",
    },
    {
      titulo: "Mascota",
      color: NARANJA,
      icono: (x: number, y: number) =>
        huella(doc, x, y - 0.4, 5.5, [255, 255, 255]),
      nombre: hoja.nombreMascota ?? "-",
      detalle: hoja.especieMascota ?? "",
    },
    {
      titulo: "Médico",
      color: VERDE,
      icono: (x: number, y: number) => iconoCruz(doc, x, y),
      nombre: hoja.nombreMedico ?? "-",
      detalle: hoja.especialidadMedico ?? "",
    },
  ];

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  const lineasNombre = tarjetas.map(
    (t) => doc.splitTextToSize(t.nombre, anchoTexto) as string[],
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const lineasDetalle = tarjetas.map((t) =>
    t.detalle ? (doc.splitTextToSize(t.detalle, anchoTexto) as string[]) : [],
  );
  const altoTarjeta =
    22 +
    Math.max(...lineasNombre.map((l) => l.length)) * 4.8 +
    Math.max(...lineasDetalle.map((l) => l.length)) * 4;

  tarjetas.forEach((t, i) => {
    const x = M + i * (anchoTarjeta + separacion);
    doc.setFillColor(...BEIGE);
    doc.setDrawColor(...BEIGE_CALIDO);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, yTarjetas, anchoTarjeta, altoTarjeta, 3, 3, "FD");

    doc.setFillColor(...t.color);
    doc.circle(x + 9, yTarjetas + 9.5, 5.2, "F");
    t.icono(x + 9, yTarjetas + 9.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);
    doc.text(t.titulo.toUpperCase(), x + 17, yTarjetas + 10.5);

    doc.setFontSize(10.5);
    doc.setTextColor(...OSCURO);
    doc.text(lineasNombre[i], x + 5, yTarjetas + 21);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRIS);
    doc.text(
      lineasDetalle[i],
      x + 5,
      yTarjetas + 21 + lineasNombre[i].length * 4.8,
    );
  });

  // ---------- Títulos de sección ----------
  const tituloSeccion = (texto: string, y: number) => {
    huella(doc, M + 3, y - 1.4, 5.5, NARANJA);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...OSCURO);
    doc.text(texto, M + 9, y);
    doc.setDrawColor(...NARANJA);
    doc.setLineWidth(0.6);
    doc.line(M, y + 2.5, ancho - M, y + 2.5);
  };

  // ---------- Consulta ----------
  const yConsulta = yTarjetas + altoTarjeta + 12;
  tituloSeccion("Detalle de la consulta", yConsulta);

  autoTable(doc, {
    startY: yConsulta + 6,
    theme: "grid",
    margin: margenTabla,
    styles: {
      fontSize: 9.5,
      textColor: [60, 60, 60],
      lineColor: BEIGE_CALIDO,
      lineWidth: 0.2,
      cellPadding: 3,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 32,
        fillColor: BEIGE,
        textColor: OSCURO,
      },
    },
    body: [
      ["Motivo", hoja.motivo || "-"],
      ["Síntomas", hoja.sintomas || "-"],
      ["Diagnóstico", hoja.diagnostico || "-"],
    ],
  });

  // ---------- Tratamientos y medicamentos ----------
  let yTratamientos = finalDeTabla(doc) + 12;
  if (yTratamientos > alto - 70) {
    doc.addPage();
    yTratamientos = 26;
  }
  tituloSeccion("Tratamientos y medicamentos", yTratamientos);

  const filas: RowInput[] =
    hoja.lineas.length > 0
      ? hoja.lineas.map((l) => [
        l.tipo,
        l.descripcion,
        l.cantidad,
        dinero(l.precioUnitario),
        dinero(l.subtotal),
      ])
      : [
        [
          {
            content: "N/A - Sin tratamientos ni medicamentos registrados",
            colSpan: 5,
            styles: { halign: "center", fontStyle: "italic", textColor: GRIS },
          },
        ],
      ];

  autoTable(doc, {
    startY: yTratamientos + 6,
    theme: "striped",
    margin: margenTabla,
    head: [["Tipo", "Descripción", "Cant.", "Precio", "Subtotal"]],
    body: filas,
    styles: { fontSize: 9.5, cellPadding: 3, textColor: [60, 60, 60] },
    headStyles: {
      fillColor: OSCURO,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: BEIGE },
    columnStyles: {
      0: { fontStyle: "bold", textColor: OSCURO },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  // ---------- Total ----------
  let yTotal = finalDeTabla(doc) + 10;
  if (yTotal + 18 > alto - ALTO_PIE - 6) {
    doc.addPage();
    yTotal = 26;
  }
  const anchoTotal = 72;
  const xTotal = ancho - M - anchoTotal;

  huella(doc, M + 4, yTotal + 8, 8, VERDE_SUAVE);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(...GRIS);
  doc.text("¡Gracias por confiar en nosotros!", M + 12, yTotal + 9.5);

  doc.setFillColor(...OSCURO);
  doc.roundedRect(xTotal, yTotal, anchoTotal, 17, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NARANJA);
  doc.text("TOTAL", xTotal + 8, yTotal + 10.5);
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(dinero(hoja.total), xTotal + anchoTotal - 8, yTotal + 11, {
    align: "right",
  });

  // ---------- Pie de página en todas las hojas ----------
  dibujarPie(doc);

  if (accion === "abrir") {
    const url = String(doc.output("bloburl"));
    if (ventana) {
      ventana.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  } else {
    doc.save(`informe-cita-${hoja.idCita}.pdf`);
  }
}