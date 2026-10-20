import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logazul from "../assets/images/LogoAzul.png";
import Modal from "../components/Modal";
import {
  listarDuenosActivos,
  agregarDueno,
  modificarDueno,
  anularDueno,
} from "../services/duenoService";
import {
  HomeIcon,
  ChevronRight,
  Plus,
  Users,
} from "lucide-react";
import type { Dueno } from "../types/dueno";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import { reporteDuenos } from "../utiils/reportes";
import BotonesExportar from "../components/BotonesExportar";

const formInicial: Dueno = {
  idDueno: null,
  nombre: "",
  apellido: "",
  telefono: "",
  direccion: "",
  estado: true,
};

function DuenosPage() {
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [form, setForm] = useState<Dueno>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarDuenos = async () => {
    try {
      const respuesta = await listarDuenosActivos();
      setDuenos(respuesta.data);
    } catch (error) {
      console.error("Error al listar dueños", error);
    }
  };

  useEffect(() => {
    cargarDuenos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerMensajeError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.mensaje ?? error.message;
    }
    if (error instanceof Error) return error.message;
    return "Ocurrió un error inesperado";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (modoEdicion && form.idDueno !== null) {
        await modificarDueno(form.idDueno, form);
        setMensaje("Dueño actualizado correctamente");
      } else {
        await agregarDueno(form);
        setMensaje("Dueño creado correctamente");
      }
      setModalAbierto(false);
      setForm(formInicial);
      setModoEdicion(false);
      cargarDuenos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (dueno: Dueno) => {
    setForm(dueno);
    setModoEdicion(true);
    setMensaje("");
    setModalAbierto(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular este dueño?")) return;
    try {
      await anularDueno(id);
      setMensaje("Dueño anulado correctamente");
      cargarDuenos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const columnasTabla: ColumnaTabla<Dueno>[] = [
    { encabezado: "Nombre", valor: (c) => c.nombre },
    { encabezado: "Apellido", valor: (c) => c.apellido },
    { encabezado: "Dirección", valor: (c) => c.direccion },
    { encabezado: "Telefono", valor: (c) => c.telefono ?? "—" },
  ];

  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirNuevo = () => {
    setForm(formInicial);
    setModoEdicion(false);
    setMensaje("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(formInicial);
    setModoEdicion(false);
    setMensaje("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">

      <div className="flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Dueños
          </h1>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-nunito font-bold text-marca-oscuro/70 hover:text-marca-oscuro transition-colors"
            >
              <HomeIcon size={15} />
            </Link>

            <Link
              to="/duenos"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Citas
            </Link>
          </div>
        </div>

        <img
          src={logazul}
          alt="Logo de la clínica"
          className="w-20"
        />
      </div>


      <Modal
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR DATOS" : "NUEVO DUEÑO"}
        subtitulo={modoEdicion ? "Edita la información del dueño: " : "Ingresa los datos del nuevo dueño: "}
        icono={Users}
        onCerrar={cerrarModal}
      >
        <Mensaje texto={mensaje} />
        <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-3">
              Nombre:
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Carlos"
              className="mb-4 w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-3">
              Apellido:
            </label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Ej. Pérez Gómez"
              className="mb-4 w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-3">
              Teléfono:
            </label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Ej. 1234-5678"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-3">
              Dirección:
            </label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Ej. Av. Siempreviva 742" /* <-- Aquí está el texto de sugerencia */
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mt-25 col-span-full flex justify-end gap-3">
            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-full border border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-marca-beigeclaro2 p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 mt-6">

        <div className="mb-2 flex flex-wrap items-center justify-between gap-100">
          <h2 className="text-center text-2xl font-nunito font-extrabold text-gray-800">Listado de Citas</h2>
          <BotonesExportar {...reporteDuenos} datos={duenos} />
        </div>
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-5 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
        >
          <Plus size={18} />
          Nueva Dueño
        </button>
      </div>

      <TablaDatos
        columnas={columnasTabla}
        datos={duenos}
        claveFila={(c) => c.idDueno}
        acciones={(c) => (
          <AccionesFila
            onEditar={() => handleModificar(c)}
            onAnular={() => c.idDueno !== null && handleAnular(c.idDueno)}
          />
        )}
      />

    </div>
  );
}

export default DuenosPage;
