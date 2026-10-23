import type { Cita } from "../types/cita";
import { soloFecha } from "./fechas";
import type { Consulta } from "../types/consulta";

export interface CitasPorDia {
  dia: string; // "Lun", "Mar", ...
  fecha: string; // "2026-10-19"
  citas: number;
}

const NOMBRES_DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Date -> "AAAA-MM-DD" con la fecha local
const fechaATexto = (fecha: Date) => {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

// Cuenta las citas de cada día de la semana actual (lunes a domingo)
export function citasDeLaSemana(citas: Cita[]): CitasPorDia[] {
  const hoy = new Date();
  const diaSemana = hoy.getDay(); // 0 = domingo
  const desdeLunes = diaSemana === 0 ? -6 : 1 - diaSemana;

  return NOMBRES_DIAS.map((nombre, i) => {
    const fecha = fechaATexto(
      new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + desdeLunes + i),
    );
    return {
      dia: nombre,
      fecha,
      citas: citas.filter((c) => soloFecha(c.fecha) === fecha).length,
    };
  });
}

export interface ResumenSemana {
  atendidas: number;
  pendientes: number;
  total: number;
}

// Citas de la semana actual, divididas en atendidas (con consulta) y pendientes
export function resumenSemana(
  citas: Cita[],
  consultas: Consulta[],
): ResumenSemana {
  const fechasSemana = new Set(citasDeLaSemana(citas).map((d) => d.fecha));
  const citasConConsulta = new Set(consultas.map((c) => c.idCita));

  const deLaSemana = citas.filter((c) => fechasSemana.has(soloFecha(c.fecha)));
  const atendidas = deLaSemana.filter(
    (c) => c.idCita !== null && citasConConsulta.has(c.idCita),
  ).length;

  return {
    atendidas,
    pendientes: deLaSemana.length - atendidas,
    total: deLaSemana.length,
  };
}