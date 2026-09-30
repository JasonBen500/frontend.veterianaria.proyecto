import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarDetallesActivos,
  agregarDetalleCita,
  modificarDetalleCita,
  anularDetalleCita,
} from "../services/detalleCitaService";
import type { DetalleCita } from "../types/detalleCita";
import Mensaje from "../components/Mensaje";

const formInicial: DetalleCita = {
  idDetalleCita: null,
  precioAplicado: 0,
  estado: true,
  idCita: 0,
  idMedicamento: 0,
  idTratamiento: 0,
};

function DetalleCitasPage() {
  const [detalles, setDetalles] = useState<DetalleCita[]>([]);
  const [form, setForm] = useState<DetalleCita>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarDetalles = async () => {
    try {
      const respuesta = await listarDetallesActivos();
      setDetalles(respuesta.data);
    } catch (error) {
      console.error("Error al listar detalles de cita", error);
    }
  };

  useEffect(() => {
    cargarDetalles();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
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
      if (modoEdicion && form.idDetalleCita !== null) {
        await modificarDetalleCita(form.idDetalleCita, form);
        setMensaje("Detalle actualizado correctamente");
      } else {
        await agregarDetalleCita(form);
        setMensaje("Detalle creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarDetalles();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (detalle: DetalleCita) => {
    setForm(detalle);
    setModoEdicion(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular este detalle?")) return;
    try {
      await anularDetalleCita(id);
      setMensaje("Detalle anulado correctamente");
      cargarDetalles();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Detalle de Cita" : "Ingresar Detalle de Cita"}
      </h2>
      <Mensaje texto={mensaje} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Aplicado
          </label>
          <input
            type="number"
            name="precioAplicado"
            value={form.precioAplicado}
            onChange={handleChange}
            min={0}
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Cita
          </label>
          <input
            type="number"
            name="idCita"
            value={form.idCita}
            onChange={handleChange}
            min={1}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Medicamento
          </label>
          <input
            type="number"
            name="idMedicamento"
            value={form.idMedicamento}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Tratamiento
          </label>
          <input
            type="number"
            name="idTratamiento"
            value={form.idTratamiento}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Listado de Detalles de Cita
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Precio
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              ID Cita
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              ID Medicamento
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              ID Tratamiento
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.idDetalleCita}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.precioAplicado}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.idCita}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.idMedicamento}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.idTratamiento}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(d)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() =>
                    d.idDetalleCita !== null && handleAnular(d.idDetalleCita)
                  }
                  className="text-red-600 hover:underline"
                >
                  Anular
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetalleCitasPage;
