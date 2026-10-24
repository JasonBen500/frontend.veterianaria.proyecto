import type { Mascota } from "../types/mascota";

export interface EspecieContada {
  especie: string;
  cantidad: number;
}

// "  canino " y "Canino" cuentan como la misma especie; se muestra con la primera letra en mayúscula
const normalizar = (texto: string) => texto.trim().toLowerCase();
const capitalizar = (texto: string) =>
  texto.length === 0 ? texto : texto[0].toUpperCase() + texto.slice(1);

export function especiesMasRegistradas(
  mascotas: Mascota[],
  limite = 5,
): EspecieContada[] {
  const conteo = new Map<string, number>();
  for (const m of mascotas) {
    const clave = normalizar(m.especie ?? "");
    if (!clave) continue;
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
  }
  return [...conteo.entries()]
    .map(([especie, cantidad]) => ({ especie: capitalizar(especie), cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad || a.especie.localeCompare(b.especie, "es"))
    .slice(0, limite);
}

// Las últimas mascotas registradas (a mayor id, más reciente)
export const mascotasRecientes = (mascotas: Mascota[], limite = 4) =>
  [...mascotas]
    .sort((a, b) => (b.idMascota ?? 0) - (a.idMascota ?? 0))
    .slice(0, limite);
