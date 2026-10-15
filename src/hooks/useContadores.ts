import { useEffect, useState } from "react";
import { listarDuenosActivos } from "../services/duenoService";
import { listarMascotasActivas } from "../services/mascotaService";
import { listarCitasActivas } from "../services/citaService";
import { listarConsultasActivas } from "../services/consultaService";

export interface Contadores {
  duenos: number;
  mascotas: number;
  citasAtendidas: number;
  citasPendientes: number;
}

interface Estado {
  contadores: Contadores | null;
  cargando: boolean;
  error: boolean;
}

export function useContadores(): Estado {
  const [estado, setEstado] = useState<Estado>({
    contadores: null,
    cargando: true,
    error: false,
  });

  useEffect(() => {
    let activo = true;

    Promise.all([
      listarDuenosActivos(),
      listarMascotasActivas(),
      listarCitasActivas(),
      listarConsultasActivas(),
    ])
      .then(([duenos, mascotas, citas, consultas]) => {
        if (!activo) return;

        // DEFINICIÓN DE "ATENDIDA": cita activa que ya tiene una consulta registrada.
        // Si prefieres otra definición, solo se cambia este bloque.
        const citasConConsulta = new Set(consultas.data.map((c) => c.idCita));
        const atendidas = citas.data.filter(
          (c) => c.idCita !== null && citasConConsulta.has(c.idCita),
        ).length;

        setEstado({
          contadores: {
            duenos: duenos.data.length,
            mascotas: mascotas.data.length,
            citasAtendidas: atendidas,
            citasPendientes: citas.data.length - atendidas,
          },
          cargando: false,
          error: false,
        });
      })
      .catch(() => {
        if (activo) {
          setEstado({ contadores: null, cargando: false, error: true });
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  return estado;
}