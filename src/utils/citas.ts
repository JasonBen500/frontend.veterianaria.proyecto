import { formatearFecha } from "./fechas";
import type { Cita } from "../types/cita";

// Texto para mostrar una cita en un select: "Firulais · 5 nov 2026 · Vacuna"
export const etiquetaCita = (cita: Cita) =>
  [
    cita.nombreMascota ?? "Mascota sin nombre",
    formatearFecha(cita.fecha),
    cita.motivo,
  ]
    .filter(Boolean)
    .join(" · ");
