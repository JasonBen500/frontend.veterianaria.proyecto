import { useState } from "react";
import axios from "axios";
import PasoDueno from "../components/wizard/PasoDueno";
import PasoMascota from "../components/wizard/PasoMascota";
import PasoCita from "../components/wizard/PasoCita";
import { agregarDueno } from "../services/duenoService";
import { agregarMascota } from "../services/mascotaService";
import { agregarCita } from "../services/citaService";
import { useAuth } from "../context/AuthContext";
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

function RegistroWizard() {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<WizardState>({
    paso: 1,
    dueno: duenoVacio,
    duenoEsNuevo: true,
    mascota: mascotaVacia,
    mascotaEsNueva: true,
    quiereAgendarCita: false,
    cita: citaVacia,
  });
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

  const obtenerMensajeError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.mensaje ?? err.message;
    }
    return "Ocurrió un error inesperado al guardar";
  };

  // El corazón de todo: guarda en orden, reutilizando IDs reales
  const guardarTodo = async (citaAAgendar: Cita | null) => {
    setGuardando(true);
    setError("");
    try {
      // 1. Resolver dueño
      let idDueno = estado.dueno.idDueno;
      if (estado.duenoEsNuevo) {
        const { idDueno: _sinUsar, ...datosDueno } = estado.dueno;
        const respuestaDueno = await agregarDueno(datosDueno);
        idDueno = respuestaDueno.data.idDueno;
      }

      // 2. Resolver mascota
      let idMascota = estado.mascota.idMascota;
      if (estado.mascotaEsNueva) {
        const { idMascota: _sinUsar2, ...datosMascota } = estado.mascota;
        const respuestaMascota = await agregarMascota({
          ...datosMascota,
          idDueno: idDueno!,
        });
        idMascota = respuestaMascota.data.idMascota;
      }

      // 3. Cita (opcional)
      if (citaAAgendar) {
        const { idCita: _sinUsar3, ...datosCita } = citaAAgendar;
        await agregarCita({
          ...datosCita,
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

  const reiniciarWizard = () => {
    setEstado({
      paso: 1,
      dueno: duenoVacio,
      duenoEsNuevo: true,
      mascota: mascotaVacia,
      mascotaEsNueva: true,
      quiereAgendarCita: false,
      cita: citaVacia,
    });
    setExito(false);
    setError("");
  };

  if (exito) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow text-center">
        <h2 className="text-xl font-bold text-green-700 mb-2">
          ¡Registro guardado con éxito!
        </h2>
        <button
          onClick={reiniciarWizard}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Registrar otro
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <p className="max-w-xl mx-auto mb-4 p-3 rounded border text-sm bg-red-50 text-red-700 border-red-200">
          {error}
        </p>
      )}

      {guardando && (
        <p className="max-w-xl mx-auto mb-4 text-center text-sm text-gray-500">
          Guardando...
        </p>
      )}

      {estado.paso === 1 && (
        <PasoDueno duenoInicial={estado.dueno} onSiguiente={avanzarDesdeDueno} />
      )}
      {estado.paso === 2 && (
        <PasoMascota
          idDueno={estado.dueno.idDueno ?? 0}
          duenoEsNuevo={estado.duenoEsNuevo}
          mascotaInicial={estado.mascota}
          onSiguiente={avanzarDesdeMascota}
          onAtras={volverAPaso1}
        />
      )}
      {estado.paso === 3 && (
        <PasoCita
          idMascota={estado.mascota.idMascota ?? 0}
          onGuardarSinCita={() => guardarTodo(null)}
          onAgendarCita={(cita) => guardarTodo(cita)}
          onAtras={volverAPaso2}
        />
      )}
    </div>
  );
}

export default RegistroWizard;