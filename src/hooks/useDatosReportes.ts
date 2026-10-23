import { useEffect, useState } from "react";
import { listarDuenosTodos } from "../services/duenoService";
import { listarMascotasTodas } from "../services/mascotaService";
import { listarCitasTodas } from "../services/citaService";
import { listarConsultasTodas } from "../services/consultaService";
import { listarDetallesTodos } from "../services/detalleCitaService";
import { listarMedicamentosTodos } from "../services/medicamentosService";
import { listarTratamientosTodos } from "../services/tratamientoService";
import { listarMedicosTodos } from "../services/medicoService";
import { listarUsuariosTodos } from "../services/usuariosService";
import { listarPerfilesTodos } from "../services/perfilService";

// Para agregar un módulo a los reportes basta con añadir una línea aquí
const cargadores = {
  duenos: listarDuenosTodos,
  mascotas: listarMascotasTodas,
  citas: listarCitasTodas,
  consultas: listarConsultasTodas,
  detalles: listarDetallesTodos,
  medicamentos: listarMedicamentosTodos,
  tratamientos: listarTratamientosTodos,
  medicos: listarMedicosTodos,
  usuarios: listarUsuariosTodos,
  perfiles: listarPerfilesTodos,
};

export type ClaveReporte = keyof typeof cargadores;

// El tipo de cada lista se deduce solo de lo que devuelve su servicio
type Listas = {
  [K in ClaveReporte]: Awaited<ReturnType<(typeof cargadores)[K]>>["data"];
};

export type DatosReportes = Listas & {
  cargando: boolean;
  // true en los módulos que no se pudieron cargar (los demás siguen funcionando)
  errores: Record<ClaveReporte, boolean>;
};

const CLAVES = Object.keys(cargadores) as ClaveReporte[];

const listasVacias = Object.fromEntries(
  CLAVES.map((clave) => [clave, []]),
) as unknown as Listas;

const sinErrores = Object.fromEntries(
  CLAVES.map((clave) => [clave, false]),
) as Record<ClaveReporte, boolean>;

export function useDatosReportes(): DatosReportes {
  const [datos, setDatos] = useState<DatosReportes>({
    ...listasVacias,
    errores: sinErrores,
    cargando: true,
  });

  useEffect(() => {
    let activo = true;

    Promise.allSettled(CLAVES.map((clave) => cargadores[clave]())).then(
      (resultados) => {
        if (!activo) return;

        const listas: Partial<Record<ClaveReporte, unknown>> = {};
        const errores = { ...sinErrores };

        resultados.forEach((resultado, indice) => {
          const clave = CLAVES[indice];
          if (resultado.status === "fulfilled") {
            listas[clave] = resultado.value.data;
          } else {
            errores[clave] = true;
          }
        });

        setDatos({
          ...listasVacias,
          ...(listas as Partial<Listas>),
          errores,
          cargando: false,
        });
      },
    );

    return () => {
      activo = false;
    };
  }, []);

  return datos;
}
