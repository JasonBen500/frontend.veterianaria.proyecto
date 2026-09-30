import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarTratamientosActivos,
  agregarTratamiento,
  modificarTratamiento,
  anularTratamiento,
} from "../services/tratamientoService";
import type { Tratamiento } from "../types/tratamiento";
import Mensaje from "../components/Mensaje";

const formInicial: Tratamiento = {
  idTratamiento: null,
  nombre: "",
  precio: 0,
  estado: true,
};

function TratamientosPage() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [form, setForm] = useState<Tratamiento>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarTratamientos = async () => {
    try {
      const respuesta = await listarTratamientosActivos();
      setTratamientos(respuesta.data);
    } catch (error) {
      console.error("Error al listar tratamientos", error);
    }
  };

  useEffect(() => {
    cargarTratamientos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
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
      if (modoEdicion && form.idTratamiento !== null) {
        await modificarTratamiento(form.idTratamiento, form);
        setMensaje("Tratamiento actualizado correctamente");
      } else {
        await agregarTratamiento(form);
        setMensaje("Tratamiento creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarTratamientos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (tratamiento: Tratamiento) => {
    setForm(tratamiento);
    setModoEdicion(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular este tratamiento?")) return;
    try {
      await anularTratamiento(id);
      setMensaje("Tratamiento anulado correctamente");
      cargarTratamientos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Tratamiento" : "Ingresar Tratamiento"}
      </h2>
      <Mensaje texto={mensaje} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio
          </label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            min={0}
            step="0.01"
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
        Listado de Tratamientos
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Nombre
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Precio
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {tratamientos.map((t) => (
            <tr key={t.idTratamiento}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {t.nombre}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {t.precio}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(t)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() =>
                    t.idTratamiento !== null && handleAnular(t.idTratamiento)
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

export default TratamientosPage;
