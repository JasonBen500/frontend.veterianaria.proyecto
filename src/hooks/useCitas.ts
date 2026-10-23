import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  listarCitasActivas,
  agregarCita,
  modificarCita,
  anularCita,
  eliminarCita,
} from "../services/citaService";
import { listarConsultasActivas } from "../services/consultaService";
import { listarMascotasActivas } from "../services/mascotaService";
import { listarMedicosActivos } from "../services/medicoService";
import { listarUsuariosActivos } from "../services/usuariosService";
import { obtenerMensajeError } from "../utils/errores";
import type { Cita } from "../types/cita";
import type { Mascota } from "../types/mascota";
import type { Medico } from "../types/medico";
import type { Usuarios } from "../types/usuarios";
import type { Consulta } from "../types/consulta";

export const citaVacia: Cita = {
  idCita: null,
  fecha: "",
  motivo: "",
  total: 0, // el backend lo calcula a partir de los detalles
  estado: true,
  idMascota: 0,
  idMedico: 0,
  idUsuario: 0,
};

const CAMPOS_NUMERICOS = ["idMascota", "idMedico", "idUsuario"];

// Toda la lógica de datos y del CRUD de citas vive aquí; la página solo dibuja
export function useCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);

  const [form, setForm] = useState<Cita>(citaVacia);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarCitas = useCallback(async () => {
    try {
      const respuesta = await listarCitasActivas();
      setCitas(respuesta.data);
    } catch (error) {
      console.error("Error al listar citas", error);
    }
  }, []);

  const cargarConsultas = useCallback(async () => {
    try {
      const respuesta = await listarConsultasActivas();
      setConsultas(respuesta.data);
    } catch (error) {
      console.error("Error al listar consultas", error);
    }
  }, []);

  const cargarListas = useCallback(async () => {
    try {
      const [resMascotas, resMedicos, resUsuarios] = await Promise.all([
        listarMascotasActivas(),
        listarMedicosActivos(),
        listarUsuariosActivos(),
      ]);
      setMascotas(resMascotas.data);
      setMedicos(resMedicos.data);
      setUsuarios(resUsuarios.data);
    } catch (error) {
      console.error("Error al cargar las listas", error);
    }
  }, []);

  useEffect(() => {
    cargarCitas();
    cargarConsultas();
    cargarListas();
  }, [cargarCitas, cargarConsultas, cargarListas]);

  // Citas que ya tienen una consulta activa
  const citasAtendidas = new Set(
    consultas.filter((c) => c.estado !== false).map((c) => c.idCita),
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: CAMPOS_NUMERICOS.includes(name) ? Number(value) : value,
    }));
  };

  const abrirNuevo = () => {
    setForm(citaVacia);
    setModoEdicion(false);
    setMensaje("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(citaVacia);
    setModoEdicion(false);
    setMensaje("");
  };

  const handleModificar = (cita: Cita) => {
    setForm(cita);
    setModoEdicion(true);
    setMensaje("");
    setModalAbierto(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (modoEdicion && form.idCita !== null) {
        await modificarCita(form.idCita, form);
        setMensaje("Cita actualizada correctamente");
      } else {
        await agregarCita(form);
        setMensaje("Cita creada correctamente");
      }
      setModalAbierto(false);
      setForm(citaVacia);
      setModoEdicion(false);
      cargarCitas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular esta cita?")) return;
    try {
      await anularCita(id);
      setMensaje("Cita anulada correctamente");
      cargarCitas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleEliminar = async (id: number) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar esta cita? Se eliminarán también sus detalles. Esta acción no se puede deshacer.",
      )
    )
      return;
    try {
      await eliminarCita(id);
      setMensaje("Cita eliminada correctamente");
      cargarCitas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return {
    citas,
    consultas,
    mascotas,
    medicos,
    usuarios,
    form,
    modoEdicion,
    modalAbierto,
    mensaje,
    citasAtendidas,
    cargarCitas,
    cargarConsultas,
    handleChange,
    abrirNuevo,
    cerrarModal,
    handleModificar,
    handleSubmit,
    handleAnular,
    handleEliminar,
  };
}
