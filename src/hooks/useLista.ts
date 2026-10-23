import { useEffect, useState } from "react";

export function useLista<T>(listar: () => Promise<{ data: T[] }>) {
  const [datos, setDatos] = useState<T[]>([]);

  useEffect(() => {
    let activo = true;
    listar()
      .then((respuesta) => {
        if (activo) setDatos(respuesta.data);
      })
      .catch((error) => console.error("Error al cargar la lista", error));
    return () => {
      activo = false;
    };
  }, [listar]);

  return datos;
}
