import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarDuenosActivos,
  agregarDueno,
  modificarDueno,
  anularDueno,
} from "../services/duenoService";
import type { Dueno } from "../types/dueno";
import Mensaje from "../components/Mensaje";

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Dueño" : "Ingresar Dueño"}
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
            Apellido
          </label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
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
        Listado de Dueños
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Nombre
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Apellido
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Teléfono
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Dirección
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {duenos.map((d) => (
            <tr key={d.idDueno}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.nombre}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.apellido}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.telefono}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {d.direccion}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(d)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() => d.idDueno !== null && handleAnular(d.idDueno)}
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

export default DuenosPage;
