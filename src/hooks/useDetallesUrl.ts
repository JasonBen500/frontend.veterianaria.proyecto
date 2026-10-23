import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// Maneja el modal de "Ver detalles" y los parámetros ?detalle=ID y ?buscar=texto
// que llegan desde la búsqueda global del dashboard.
export function useDetallesUrl() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idDesdeUrl = Number(searchParams.get("detalle")) || null;

  const [abierto, setAbierto] = useState(idDesdeUrl !== null);
  const [id, setId] = useState<number | null>(idDesdeUrl);

  const ver = (idSeleccionado: number) => {
    setId(idSeleccionado);
    setAbierto(true);
  };

  const cerrar = () => {
    setAbierto(false);
    setSearchParams({}, { replace: true });
  };

  return {
    abierto,
    id,
    ver,
    cerrar,
    busquedaInicial: searchParams.get("buscar") ?? "",
  };
}
