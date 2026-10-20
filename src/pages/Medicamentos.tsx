import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  listarMedicamentosActivos,
  agregarMedicamento,
  modificarMedicamento,
  anularMedicamento,
  eliminarMedicamento,
  ajustarStockMedicamento,
} from "../services/medicamentosService";

import {
  HomeIcon,
  ChevronRight,
  Plus,
  ImagePlus,
  Pill,
} from "lucide-react";

import type { Medicamentos } from "../types/medicamentos";
import Mensaje from "../components/Mensaje";
import { reporteMedicamentos } from "../utiils/reportes";
import BotonesExportar from "../components/BotonesExportar";
import logazul from "../assets/images/LogoAzul.png";
import Modal from "../components/Modal";
import TarjetaMedicamento from "../components/medicamentos/TarjetaMedicamento";
import { archivoADataUrl } from "../utiils/imagenes";

const formInicial: Medicamentos = {
  idMedicamento: null,
  nombre: "",
  descripcion: "",
  precio: 0,
  stock: 0,
  estado: true,
};

function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamentos[]>([]);
  const [form, setForm] = useState<Medicamentos>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarMedicamentos = async () => {
    try {
      const respuesta = await listarMedicamentosActivos();
      setMedicamentos(respuesta.data);
    } catch (error) {
      console.error("Error al listar medicamentos", error);
    }
  };

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["precio", "stock"].includes(name) ? Number(value) : value,
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
      if (modoEdicion && form.idMedicamento !== null) {
        await modificarMedicamento(form.idMedicamento, form);
        setMensaje("Medicamento actualizado correctamente");
      } else {
        await agregarMedicamento(form);
        setMensaje("Medicamento creado correctamente");
      }
      setModalAbierto(false);
      setForm(formInicial);
      setModoEdicion(false);
      cargarMedicamentos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (medicamentos: Medicamentos) => {
    setForm(medicamentos);
    setModoEdicion(true);
    setMensaje("");
    setModalAbierto(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular este medicamento?")) return;
    try {
      await anularMedicamento(id);
      setMensaje("Medicamento anulado correctamente");
      cargarMedicamentos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleEliminar = async (id: number) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar este medicamento? Esta acción no se puede deshacer.",
      )
    )
      return;
    try {
      await eliminarMedicamento(id);
      setMensaje("Medicamento eliminado correctamente");
      cargarMedicamentos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleAjustarStock = async (id: number, cambio: number) => {
    try {
      const respuesta = await ajustarStockMedicamento(id, cambio);
      setMedicamentos((anteriores) =>
        anteriores.map((m) =>
          m.idMedicamento === id ? { ...m, stock: respuesta.data.stock } : m,
        ),
      );
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleImagen = async (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite elegir el mismo archivo otra vez
    if (!archivo) return;

    try {
      const imagen = await archivoADataUrl(archivo);
      setForm((prev) => ({ ...prev, imagen }));
    } catch (error) {
      setMensaje(
        error instanceof Error ? error.message : "No se pudo cargar la imagen",
      );
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Inventario de Medicamentos
          </h1>
          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-nunito font-bold text-marca-oscuro/70 hover:text-marca-oscuro transition-colors"
            >
              <HomeIcon size={15} />
            </Link>
            <Link
              to="/medicamentos"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Medicamentos
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
        titulo={modoEdicion ? "MODIFICAR MEDICAMENTO" : "NUEVO MEDICAMENTO"}
        subtitulo={modoEdicion ? "Edita la información del medicamento:" : "Ingresa los datos del nuevo medicamento:"}
        icono={Pill}
        onCerrar={cerrarModal}
      >
        <Mensaje texto={mensaje} />
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Nombre:
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Paracetamol"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Descripción:
            </label>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej. Analgésico y antipirético"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Precio:
            </label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="0.00"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Stock:
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min={0}
              placeholder="Ej. 50"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Sección de Imagen dentro del modal */}
          <div className="col-span-full">
            <label className="mb-2 block font-nunito text-lg font-semibold text-gray-700">
              Imagen de referencia:
            </label>
            <div className="flex items-center gap-4">
              {form.imagen ? (
                <img
                  src={form.imagen}
                  alt="Vista previa"
                  className="h-20 w-20 rounded-lg border border-marca-oscuro/10 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-marca-naranja/25 text-marca-oscuro/40">
                  <ImagePlus size={28} />
                </div>
              )}

              <div className="flex flex-col items-start gap-2">
                <label className="cursor-pointer rounded-full border border-marca-oscuro px-4 py-1.5 font-nunito text-sm font-bold text-marca-oscuro transition-colors hover:bg-marca-oscuro hover:text-white">
                  {form.imagen ? "Cambiar imagen" : "Elegir imagen"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagen}
                    className="hidden"
                  />
                </label>

                {form.imagen && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imagen: "" }))}
                    className="font-nunito text-sm font-semibold text-marca-vino hover:underline"
                  >
                    Quitar imagen
                  </button>
                )}
              </div>
            </div>
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

      <div className="bg-marca-beigeclaro2 p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 mb-4 mt-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-50">
          <h2 className="text-center text-2xl font-nunito font-extrabold text-gray-800">Listado de Medicamentos</h2>
          <BotonesExportar {...reporteMedicamentos} datos={medicamentos} />
        </div>
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-5 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
        >
          <Plus size={18} />
          Nuevo Medicamento
        </button>
      </div>

      {medicamentos.length === 0 ? (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          No hay medicamentos para mostrar.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {medicamentos.map((m) => (
            <TarjetaMedicamento
              key={m.idMedicamento}
              medicamento={m}
              onEditar={() => handleModificar(m)}
              onAnular={() => m.idMedicamento !== null && handleAnular(m.idMedicamento)}
              onEliminar={() => m.idMedicamento !== null && handleEliminar(m.idMedicamento)}
              onAjustarStock={(cambio) =>
                m.idMedicamento !== null
                  ? handleAjustarStock(m.idMedicamento, cambio)
                  : Promise.resolve()
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicamentosPage;
