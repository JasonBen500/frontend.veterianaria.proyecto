import { useState } from "react";
import { agregarDueno } from "../services/duenoService";
import { agregarMascota } from "../services/mascotaService";
import { agregarCita } from "../services/citaService";
import { useAuth } from "../context/AuthContext";
import { obtenerMensajeError } from "../utils/errores";
import type { Dueno } from "../types/dueno";
import type { Mascota } from "../types/mascota";
import type { Cita } from "../types/cita";
import type { WizardState } from "../types/wizard";

const duenoVacio: Dueno = {
  idDueno: null,
  nombre: "",
  apellido: "",
  telefono: "",
  direccion: "",
  estado: true,
};

const mascotaVacia: Mascota = {
  idMascota: null,
  nombre: "",
  especie: "",
  edad: 0,
  peso: 0,
  estado: true,
  idDueno: 0,
};

const citaVacia: Cita = {
  idCita: null,
  fecha: "",
  motivo: "",
  total: 0,
  estado: true,
  idMascota: 0,
  idMedico: 0,
  idUsuario: 0,
};

const estadoInicial: WizardState = {
  paso: 1,
  dueno: duenoVacio,
  duenoEsNuevo: true,
  mascota: mascotaVacia,
  mascotaEsNueva: true,
  quiereAgendarCita: false,
  cita: citaVacia,
};

// Copia del objeto sin su llave (para enviar al backend sin el id vacío)
function sinLlave<T extends object, K extends keyof T>(
  objeto: T,
  llave: K,
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(objeto).filter(([clave]) => clave !== llave),
  ) as Omit<T, K>;
}

// Estado y acciones del registro rápido (dueño → mascota → cita opcional)
export function useRegistroWizard(onCerrar: () => void) {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<WizardState>(estadoInicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const avanzarDesdeDueno = (dueno: Dueno, esNuevo: boolean) => {
    setEstado((prev) => ({ ...prev, dueno, duenoEsNuevo: esNuevo, paso: 2 }));
  };

  const avanzarDesdeMascota = (mascota: Mascota, esNueva: boolean) => {
    setEstado((prev) => ({
      ...prev,
      mascota,
      mascotaEsNueva: esNueva,
      paso: 3,
    }));
  };

  const volverAPaso1 = () => setEstado((prev) => ({ ...prev, paso: 1 }));
  const volverAPaso2 = () => setEstado((prev) => ({ ...prev, paso: 2 }));

  // Guarda dueño y mascota (si son nuevos) y, opcionalmente, la cita.
  // Si algo falla a mitad, lo que ya se creó queda marcado como existente
  // para que al reintentar no se duplique.
  const guardarTodo = async (citaAAgendar: Cita | null) => {
    setGuardando(true);
    setError("");
    try {
      let idDueno = estado.dueno.idDueno;
      if (estado.duenoEsNuevo) {
        const respuesta = await agregarDueno(sinLlave(estado.dueno, "idDueno"));
        idDueno = respuesta.data.idDueno;
        setEstado((prev) => ({
          ...prev,
          dueno: { ...prev.dueno, idDueno },
          duenoEsNuevo: false,
        }));
      }

      let idMascota = estado.mascota.idMascota;
      if (estado.mascotaEsNueva) {
        const respuesta = await agregarMascota({
          ...sinLlave(estado.mascota, "idMascota"),
          idDueno: idDueno!,
        });
        idMascota = respuesta.data.idMascota;
        setEstado((prev) => ({
          ...prev,
          mascota: { ...prev.mascota, idMascota, idDueno: idDueno! },
          mascotaEsNueva: false,
        }));
      }

      if (citaAAgendar) {
        await agregarCita({
          ...sinLlave(citaAAgendar, "idCita"),
          idMascota: idMascota!,
          idUsuario: usuario?.idUsuario ?? 0,
        });
      }

      setExito(true);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const reiniciar = () => {
    setEstado(estadoInicial);
    setExito(false);
    setError("");
  };

  const cerrar = () => {
    reiniciar();
    onCerrar();
  };

  return {
    estado,
    guardando,
    error,
    exito,
    avanzarDesdeDueno,
    avanzarDesdeMascota,
    volverAPaso1,
    volverAPaso2,
    guardarTodo,
    reiniciar,
    cerrar,
  };
}
