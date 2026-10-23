import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { HojaCita } from "../types/hoja";
import { formatearFecha } from "./fechas";

const EMPRESA = "Firolaiv";
const COLOR_PRINCIPAL: [number, number, number] = [42, 47, 99]; // marca-oscuro (#2A2F63)

const dinero = (valor: number) => `Q${Number(valor).toFixed(2)}`;

const finalDeTabla = (doc: jsPDF) =>
  (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

export function generarHojaPdf(
  hoja: HojaCita,
  accion: "descargar" | "abrir" = "descargar",
) {
  const doc = new jsPDF();
  const ancho = doc.internal.pageSize.getWidth();

  // Encabezado
  doc.setFontSize(20);
  doc.setTextColor(...COLOR_PRINCIPAL);
  doc.text(EMPRESA, 14, 20);
  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text("Informe de atención", 14, 28);
  doc.setFontSize(10);
  doc.text(`Cita #${hoja.idCita}`, ancho - 14, 20, { align: "right" });
  doc.text(formatearFecha(hoja.fecha), ancho - 14, 28, { align: "right" });

  // Datos generales
  autoTable(doc, {
    startY: 36,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 } },
    body: [
      [
        "Dueño",
        `${hoja.nombreDueno ?? "-"}${hoja.telefonoDueno ? ` · ${hoja.telefonoDueno}` : ""}`,
      ],
      [
        "Mascota",
        `${hoja.nombreMascota ?? "-"}${hoja.especieMascota ? ` (${hoja.especieMascota})` : ""}`,
      ],
      [
        "Médico",
        `${hoja.nombreMedico ?? "-"}${hoja.especialidadMedico ? ` · ${hoja.especialidadMedico}` : ""}`,
      ],
      ["Motivo", hoja.motivo],
      ["Síntomas", hoja.sintomas || "-"],
      ["Diagnóstico", hoja.diagnostico || "-"],
    ],
  });

  // Tratamientos y medicamentos
  autoTable(doc, {
    startY: finalDeTabla(doc) + 8,
    head: [["Tipo", "Descripción", "Cant.", "Precio", "Subtotal"]],
    body:
      hoja.lineas.length > 0
        ? hoja.lineas.map((l) => [
            l.tipo,
            l.descripcion,
            l.cantidad,
            dinero(l.precioUnitario),
            dinero(l.subtotal),
          ])
        : [["", "Sin tratamientos ni medicamentos registrados", "", "", ""]],
    headStyles: { fillColor: COLOR_PRINCIPAL },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  // Total
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_PRINCIPAL);
  doc.text(`Total: ${dinero(hoja.total)}`, ancho - 14, finalDeTabla(doc) + 10, {
    align: "right",
  });

  if (accion === "abrir") {
    window.open(String(doc.output("bloburl")), "_blank");
  } else {
    doc.save(`informe-cita-${hoja.idCita}.pdf`);
  }
}