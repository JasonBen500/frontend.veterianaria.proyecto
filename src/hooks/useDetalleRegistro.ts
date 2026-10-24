import { useEffect, useState } from "react";
import { obtenerUnaMascota } from "../services/mascotaService";
import { obtenerUnDetalleCita } from "../services/detalleCitaService";
import { obtenerUnDueno } from "../services/duenoService";
import { obtenerUnaCita } from "../services/citaService";
import type { Dueno } from "../types/dueno";
import type { Mascota } from "../types/mascota";
import type { Cita } from "../types/cita";
import type { DetalleCita } from "../types/detalleCita";
import { obtenerUnaConsulta } from "../services/consultaService";
import type { Consulta } from "../types/consulta";

export interface DatosDetalles {
  mascotas: Mascota[];
  duenos: Dueno[];
  citas: Cita[];
  consultas: Consulta[];
  detalleCita: DetalleCita[];
}

export function useDatosDetalle(
  entity: "mascotas" | "duenos" | "citas" | "detallecita" | "consultas",
  id: number
) {
  const [datos, setDatos] = useState<DatosDetalles>({
    mascotas: [],
    duenos: [],
    citas: [],
    consultas: [],
    detalleCita: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // Mapeo entidad → función del servicio correspondiente
  const serviceMap = {
    mascotas: obtenerUnaMascota,
    duenos: obtenerUnDueno,
    citas: obtenerUnaCita,
    consultas: obtenerUnaConsulta,
    detallecita: obtenerUnDetalleCita,
  } as const;
  useEffect(() => {
    if (!entity || isNaN(id)) {
      setError("Parámetros inválidos");
      setLoading(false);
      return;
    }
    const fetchFn = serviceMap[entity];
    if (!fetchFn) {
      setError(`Entidad "${entity}" no soportada`);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchFn(id)
      .then((res) => {
        const registro = Array.isArray(res.data) ? res.data : [res.data];
        setDatos({
          mascotas: entity === "mascotas" ? (registro as Mascota[]) : [],
          duenos: entity === "duenos" ? (registro as Dueno[]) : [],
          citas: entity === "citas" ? (registro as Cita[]) : [],
          consultas: entity === "consultas" ? (registro as Consulta[]) : [],
          detalleCita: entity === "detallecita" ? (registro as DetalleCita[]) : [],
        });
        setError("");
      })
      .catch(() => setError("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, [entity, id]);
  return { datos, loading, error };
}