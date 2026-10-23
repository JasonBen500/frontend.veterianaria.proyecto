import type { DatosInicio } from "../hooks/useDatosInicio";

export interface Contadores {
  duenos: number;
  mascotas: number;
  citasAtendidas: number;
  citasPendientes: number;
}

export function calcularContadores({
  citas,
  consultas,
  duenos,
  mascotas,
}: DatosInicio): Contadores {

  const citasConConsulta = new Set(consultas.map((c) => c.idCita));
  const atendidas = citas.filter(
    (c) => c.idCita !== null && citasConConsulta.has(c.idCita),
  ).length;

  return {
    duenos: duenos.length,
    mascotas: mascotas.length,
    citasAtendidas: atendidas,
    citasPendientes: citas.length - atendidas,
  };
}