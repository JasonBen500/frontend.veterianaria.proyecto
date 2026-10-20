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
import type { Dueno } from "../types/dueno";
import type { Mascota } from "../types/mascota";
import type { Cita } from "../types/cita";
import type { Consulta } from "../types/consulta";
import type { DetalleCita } from "../types/detalleCita";
import type { Medicamentos } from "../types/medicamentos";
import type { Tratamiento } from "../types/tratamiento";
import type { Medico } from "../types/medico";
import type { Usuarios } from "../types/usuarios";
import type { Perfil } from "../types/perfil";
import { useEffect, useState } from "react";

export interface DatosReportes {
    duenos: Dueno[];
    mascotas: Mascota[];
    citas: Cita[];
    consultas: Consulta[];
    detalles: DetalleCita[];
    medicamentos: Medicamentos[];
    tratamientos: Tratamiento[];
    medicos: Medico[];
    usuarios: Usuarios[];
    perfiles: Perfil[];
    cargando: boolean;
    error: boolean;
}

const inicial: DatosReportes = {
    duenos: [],
    mascotas: [],
    citas: [],
    consultas: [],
    detalles: [],
    medicamentos: [],
    tratamientos: [],
    medicos: [],
    usuarios: [],
    perfiles: [],
    cargando: true,
    error: false,
};

export function useDatosReportes(): DatosReportes {
    const [datos, setDatos] = useState<DatosReportes>(inicial);

    useEffect(() => {
        let activo = true;

        Promise.all([
            listarDuenosTodos(),
            listarMascotasTodas(),
            listarCitasTodas(),
            listarConsultasTodas(),
            listarDetallesTodos(),
            listarMedicamentosTodos(),
            listarTratamientosTodos(),
            listarMedicosTodos(),
            listarUsuariosTodos(),
            listarPerfilesTodos(),
        ])
            .then(
                ([
                    duenos,
                    mascotas,
                    citas,
                    consultas,
                    detalles,
                    medicamentos,
                    tratamientos,
                    medicos,
                    usuarios,
                    perfiles,
                ]) => {
                    if (!activo) return;
                    setDatos({
                        duenos: duenos.data,
                        mascotas: mascotas.data,
                        citas: citas.data,
                        consultas: consultas.data,
                        detalles: detalles.data,
                        medicamentos: medicamentos.data,
                        tratamientos: tratamientos.data,
                        medicos: medicos.data,
                        usuarios: usuarios.data,
                        perfiles: perfiles.data,
                        cargando: false,
                        error: false,
                    });
                },
            )
            .catch(() => {
                if (activo) setDatos({ ...inicial, cargando: false, error: true });
            });

        return () => {
            activo = false;
        };
    }, []);

    return datos;
}