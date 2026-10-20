import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  listarMascotasActivas,
  agregarMascota,
  modificarMascota,
  anularMascota,
} from "../services/mascotaService";
import {
  HomeIcon,
  ChevronRight,
  Plus,
  PawPrint,
} from "lucide-react";
import type { Mascota } from "../types/mascota";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import { reporteMascotas } from "../utiils/reportes";
import BotonesExportar from "../components/BotonesExportar";
import logazul from "../assets/images/LogoAzul.png";
import Modal from "../components/Modal";


const formInicial: Mascota = {
  idMascota: null,
  nombre: "",
  especie: "",
  edad: 0,
  peso: 0,
  estado: true,
  idDueno: 0,
};

function MascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [form, setForm] = useState<Mascota>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarMascotas = async () => {
    try {
      const respuesta = await listarMascotasActivas();
      setMascotas(respuesta.data);
    } catch (error) {
      console.error("Error al listar mascotas", error);
    }
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["edad", "peso", "idDueno"].includes(name)
        ? Number(value)
        : value,
    }));
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
      if (modoEdicion && form.idMascota !== null) {
        await modificarMascota(form.idMascota, form);
        setMensaje("Mascota actualizada correctamente");
      } else {
        await agregarMascota(form);
        setMensaje("Mascota creada correctamente");
      }
      setModalAbierto(false);
      setForm(formInicial);
      setModoEdicion(false);
      cargarMascotas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (mascota: Mascota) => {
    setForm(mascota);
    setModoEdicion(true);
    setMensaje("");
    setModalAbierto(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular esta mascota?")) return;
    try {
      await anularMascota(id);
      setMensaje("Mascota anulada correctamente");
      cargarMascotas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

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

  const columnasTabla: ColumnaTabla<Mascota>[] = [
    { encabezado: "Nombre", valor: (c) => c.nombre },
    { encabezado: "Especie", valor: (c) => c.especie },
    { encabezado: "Edad", valor: (c) => c.edad },
    { encabezado: "peso", valor: (c) => c.peso },
    { encabezado: "Dueño", valor: (c) => c.nombreDueno ?? "—" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Mascota
          </h1>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-nunito font-bold text-marca-oscuro/70 hover:text-marca-oscuro transition-colors"
            >
              <HomeIcon size={15} />
            </Link>

            <Link
              to="/mascotas"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Mascotas
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
        titulo={modoEdicion ? "MODIFICAR MASCOTA" : "NUEVA MASCOTA"}
        subtitulo={modoEdicion ? "Edita la información de la mascota:" : "Ingresa los datos de la nueva mascota:"}
        icono={PawPrint}
        onCerrar={cerrarModal}
      >
        <Mensaje texto={mensaje} />
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Nombre:
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Firulais"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Especie:
            </label>
            <input
              name="especie"
              value={form.especie}
              onChange={handleChange}
              placeholder="Ej. Canino"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Edad:
            </label>
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              min={0}
              placeholder="Ej. 3"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Peso (kg):
            </label>
            <input
              type="number"
              name="peso"
              value={form.peso}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="Ej. 12.5"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              ID Dueño:
            </label>
            <input
              type="number"
              name="idDueno"
              value={form.idDueno}
              onChange={handleChange}
              min={1}
              placeholder="Ej. 1"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mt-8 col-span-full flex justify-end gap-3 pt-4 border-t border-gray-100">
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
        <div className="mb-2 flex flex-wrap items-center justify-between gap-55">
          <h2 className="text-center text-2xl font-nunito font-extrabold text-gray-800">Listado de Mascotas</h2>
          <BotonesExportar {...reporteMascotas} datos={mascotas} />
        </div>
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-5 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
        >
          <Plus size={18} />
          Agregar Mascota
        </button>
      </div>

      <TablaDatos
        columnas={columnasTabla}
        datos={mascotas}
        claveFila={(c) => c.idMascota}
        acciones={(c) => (
          <AccionesFila
            onEditar={() => handleModificar(c)}
            onAnular={() => c.idMascota !== null && handleAnular(c.idMascota)}
          />
        )}
      />
    </div>
  );
}

export default MascotasPage;
