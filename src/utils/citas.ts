import { formatearFecha } from "./fechas";
import type { Cita } from "../types/cita";

// Texto para mostrar una cita en un select: "Cita #3 - Paciente: Firulais (05/11/2026)"
export const etiquetaCita = (cita: Cita) =>
  `Cita #${cita.idCita} - Paciente: ${
    cita.nombreMascota ?? `Mascota ID: ${cita.idMascota}`
  } (${formatearFecha(cita.fecha)})`;
