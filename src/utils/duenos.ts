import type { Cita } from "../types/cita";
import type { Mascota } from "../types/mascota";

// Mascotas que pertenecen a un dueño
export const mascotasDeDueno = (idDueno: number | null, mascotas: Mascota[]) =>
  idDueno === null ? [] : mascotas.filter((m) => m.idDueno === idDueno);

// Cita activa más cercana (desde este momento) de cualquiera de las mascotas del dueño
export function proximaCitaDeDueno(
  idDueno: number | null,
  mascotas: Mascota[],
  citas: Cita[],
): Cita | null {
  const ids = new Set(mascotasDeDueno(idDueno, mascotas).map((m) => m.idMascota));
  const ahora = Date.now();
  let proxima: Cita | null = null;
  let tiempoProxima = Infinity;

  for (const cita of citas) {
    if (!cita.estado || !ids.has(cita.idMascota)) continue;
    const tiempo = new Date(cita.fecha).getTime();
    if (Number.isNaN(tiempo) || tiempo < ahora || tiempo >= tiempoProxima) continue;
    proxima = cita;
    tiempoProxima = tiempo;
  }
  return proxima;
}
