import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarMedicosActivos,
  agregarMedico,
  modificarMedico,
  anularMedico,
} from "../services/medicoService";
import type { Medico } from "../types/medico";
import Mensaje from "../components/Mensaje";

const formInicial: Medico = {
  idMedico: null,
  nombre: "",
  apellido: "",
  cedula: "",
  especialidad: "",
  estado: true,
  idUsuario: 0,
};

function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [form, setForm] = useState<Medico>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarMedicos = async () => {
    try {
      const respuesta = await listarMedicosActivos();
      setMedicos(respuesta.data);
    } catch (error) {
      console.error("Error al listar médicos", error);
    }
  };

  useEffect(() => {
    cargarMedicos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idUsuario" ? Number(value) : value,
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
      if (modoEdicion && form.idMedico !== null) {
        await modificarMedico(form.idMedico, form);
        setMensaje("Médico actualizado correctamente");
      } else {
        await agregarMedico(form);
        setMensaje("Médico creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarMedicos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (medico: Medico) => {
    setForm(medico);
    setModoEdicion(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular este médico?")) return;
    try {
      await anularMedico(id);
      setMensaje("Médico anulado correctamente");
      cargarMedicos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Médico" : "Ingresar Médico"}
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
            Cédula
          </label>
          <input
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Especialidad
          </label>
          <input
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Usuario
          </label>
          <input
            type="number"
            name="idUsuario"
            value={form.idUsuario}
            onChange={handleChange}
            min={1}
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
        Listado de Médicos
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
              Cédula
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Especialidad
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((m) => (
            <tr key={m.idMedico}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.nombre}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.apellido}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.cedula}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.especialidad}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(m)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() =>
                    m.idMedico !== null && handleAnular(m.idMedico)
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

export default MedicosPage;
