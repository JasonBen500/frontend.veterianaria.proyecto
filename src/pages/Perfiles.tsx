import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarPerfilesActivos,
  agregarPerfil,
  modificarPerfil,
  anularPerfil,
} from "../services/perfilService";
import type { Perfil } from "../types/perfil";
import Mensaje from "../components/Mensaje";

const formInicial: Perfil = {
  idPerfil: null,
  nombrePerfil: "",
  estado: true,
};

function PerfilesPage() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [form, setForm] = useState<Perfil>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarPerfiles = async () => {
    try {
      const respuesta = await listarPerfilesActivos();
      setPerfiles(respuesta.data);
    } catch (error) {
      console.error("Error al listar perfiles", error);
    }
  };

  useEffect(() => {
    cargarPerfiles();
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
      if (modoEdicion && form.idPerfil !== null) {
        await modificarPerfil(form.idPerfil, form);
        setMensaje("Perfil actualizado correctamente");
      } else {
        await agregarPerfil(form);
        setMensaje("Perfil creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarPerfiles();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (perfil: Perfil) => {
    setForm(perfil);
    setModoEdicion(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular este perfil?")) return;
    try {
      await anularPerfil(id);
      setMensaje("Perfil anulado correctamente");
      cargarPerfiles();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Perfil" : "Ingresar Perfil"}
      </h2>
      <Mensaje texto={mensaje} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 mb-8 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Perfil
          </label>
          <input
            name="nombrePerfil"
            value={form.nombrePerfil}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Listado de Perfiles
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Nombre del Perfil
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {perfiles.map((p) => (
            <tr key={p.idPerfil}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {p.nombrePerfil}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(p)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() =>
                    p.idPerfil !== null && handleAnular(p.idPerfil)
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

export default PerfilesPage;
