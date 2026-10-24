import { useState } from "react";
import { soloFecha } from "../utils/fechas";

// Lista desplegable: el valor puede ser un texto o varios (basta que uno coincida)
export interface FiltroSelect<T> {
  tipo: "select";
  id: string;
  etiqueta: string;
  valor: (fila: T) => string | string[] | null | undefined;
  opciones?: string[]; // si no se indican, salen de los datos
}

// Rango "desde / hasta" de números o de fechas
export interface FiltroRango<T> {
  tipo: "numero" | "fecha";
  id: string;
  etiqueta: string;
  valor: (fila: T) => number | string | null | undefined;
}

export type Filtro<T> = FiltroSelect<T> | FiltroRango<T>;

export interface EstadoFiltros<T> {
  filtros: Filtro<T>[];
  datos: T[];
  valores: Record<string, string>;
  setValor: (clave: string, valor: string) => void;
  limpiar: () => void;
  activos: number;
  filtrados: T[];
}

// Aplica los filtros elegidos a una lista. Se usa junto con <FiltrosTabla />
export function useFiltros<T>(datos: T[], filtros: Filtro<T>[]): EstadoFiltros<T> {
  const [valores, setValores] = useState<Record<string, string>>({});

  const setValor = (clave: string, valor: string) =>
    setValores((prev) => ({ ...prev, [clave]: valor }));
  const limpiar = () => setValores({});
  const activos = Object.values(valores).filter((v) => v !== "").length;

  const cumple = (fila: T, filtro: Filtro<T>) => {
    if (filtro.tipo === "select") {
      const elegido = valores[filtro.id];
      if (!elegido) return true;
      const valor = filtro.valor(fila);
      const lista = Array.isArray(valor) ? valor : [valor];
      return lista.includes(elegido);
    }

    const desde = valores[`${filtro.id}:desde`] ?? "";
    const hasta = valores[`${filtro.id}:hasta`] ?? "";
    if (!desde && !hasta) return true;

    const bruto = filtro.valor(fila);
    if (bruto === null || bruto === undefined || bruto === "") return false;

    if (filtro.tipo === "fecha") {
      const dia = soloFecha(String(bruto));
      return (!desde || dia >= desde) && (!hasta || dia <= hasta);
    }
    const numero = Number(bruto);
    return (
      (desde === "" || numero >= Number(desde)) &&
      (hasta === "" || numero <= Number(hasta))
    );
  };

  const filtrados = datos.filter((fila) => filtros.every((f) => cumple(fila, f)));

  return { filtros, datos, valores, setValor, limpiar, activos, filtrados };
}
