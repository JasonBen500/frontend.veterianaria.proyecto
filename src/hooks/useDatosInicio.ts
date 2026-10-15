import { useEffect, useState } from "react";
import { listarCitasActivas } from "../services/citaService";
import { listarMascotasActivas } from "../services/mascotaService";
import { listarDuenosActivos } from "../services/duenoService";
import { listarConsultasActivas } from "../services/consultaService";
import type { Cita } from "../types/cita";
import type { Mascota } from "../types/mascota";
import type { Dueno } from "../types/dueno";
import type { Consulta } from "../types/consulta";

export interface DatosInicio {
    citas: Cita[];
    mascotas: Mascota[];
    duenos: Dueno[];
    consultas: Consulta[];
    cargando: boolean;
    error: boolean;
}

const inicial: DatosInicio = {
    citas: [],
    mascotas: [],
    duenos: [],
    consultas: [],
    cargando: true,
    error: false,
};

export function useDatosInicio(): DatosInicio {
    const [datos, setDatos] = useState<DatosInicio>(inicial);

    useEffect(() => {
        let activo = true;

        Promise.all([
            listarCitasActivas(),
            listarMascotasActivas(),
            listarDuenosActivos(),
            listarConsultasActivas(),
        ])
            .then(([citas, mascotas, duenos, consultas]) => {
                if (!activo) return;
                setDatos({
                    citas: citas.data,
                    mascotas: mascotas.data,
                    duenos: duenos.data,
                    consultas: consultas.data,
                    cargando: false,
                    error: false,
                });
            })
            .catch(() => {
                if (activo) setDatos({ ...inicial, cargando: false, error: true });
            });

        return () => {
            activo = false;
        };
    }, []);

    return datos;
}