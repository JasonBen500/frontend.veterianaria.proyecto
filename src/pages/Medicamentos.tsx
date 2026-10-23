import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarMedicamentosActivos,
  agregarMedicamento,
  modificarMedicamento,
  anularMedicamento,
  eliminarMedicamento,
  ajustarStockMedicamento,
} from "../services/medicamentosService";

import { ImagePlus, Pill, Package } from "lucide-react";
import type { Medicamentos } from "../types/medicamentos";
import Mensaje from "../components/Mensaje";
import { reporteMedicamentos } from "../utils/reportes";
import BotonesExportar from "../components/BotonesExportar";
import TarjetaMedicamento from "../components/medicamentos/TarjetaMedicamento";
import { archivoADataUrl } from "../utils/imagenes";
import { filtrarPorTexto } from "../utils/busqueda";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import { CLASE_INPUT } from "../components/formulario/estilosFormulario";

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
  const [busqueda, setBusqueda] = useState("");

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
    <div className="p-6 max-w-6xl mx-auto mb-4">
      {/* HEADER SUPERIOR */}
      <EncabezadoPagina
        titulo="Inventario de Medicamentos"
        ruta="/medicamentos"
        icono={Pill}
      />

      {/* MODAL DEL FORMULARIO DE MEDICAMENTOS */}
      {/* MODAL DEL FORMULARIO DE MEDICAMENTOS */}
      <ModalFormulario
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR MEDICAMENTO" : "NUEVO MEDICAMENTO"}
        subtitulo={
          modoEdicion
            ? "Edita la información del medicamento:"
            : "Ingresa los datos del nuevo medicamento:"
        }
        icono={Pill}
        mensaje={mensaje}
        onSubmit={handleSubmit}
        onCerrar={cerrarModal}
      >
        <Campo etiqueta="Nombre:" icono={Pill}>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Paracetamol"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Descripción:">
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Ej. Analgésico y antipirético"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Precio:">
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            min={0}
            step="0.01"
            placeholder="0.00"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Stock:" icono={Package}>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min={0}
            placeholder="Ej. 50"
            className={CLASE_INPUT}
          />
        </Campo>

        {/* Sección de imagen */}
        <Campo
          etiqueta="Imagen de referencia:"
          icono={ImagePlus}
          className="col-span-full"
        >
          <div className="flex items-center gap-4">
            {form.imagen ? (
              <img
                src={form.imagen}
                alt="Vista previa"
                className="h-24 w-24 rounded-2xl border border-marca-oscuro/10 object-cover shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-marca-naranja/25 text-marca-oscuro/40">
                <ImagePlus size={32} />
              </div>
            )}

            <div className="flex flex-col items-start gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-marca-oscuro px-5 py-1.5 font-nunito text-sm font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white">
                <ImagePlus size={16} />
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
        </Campo>
      </ModalFormulario>

      <BarraListado
        titulo="Medicamentos"
        exportar={<BotonesExportar {...reporteMedicamentos} datos={medicamentos} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre o descripción..."
        textoBoton="Nuevo Medicamento"
        onNuevo={abrirNuevo}
      />

      <Mensaje texto={mensaje} />

      {/* GRILLA DE TARJETAS DE MEDICAMENTOS */}
      {filtrarPorTexto(medicamentos, busqueda).length === 0 ? (
        <p className="font-nunito text-sm font-semibold text-marca-oscuro/60 text-center mt-8">
          No hay medicamentos para mostrar.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtrarPorTexto(medicamentos, busqueda).map((m) => (
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
