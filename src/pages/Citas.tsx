import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarCitasActivas,
  agregarCita,
  modificarCita,
  anularCita,
} from "../services/citaService";
import type { Cita } from "../types/cita";
import Mensaje from "../components/Mensaje";

const formInicial: Cita = {
  idCita: null,
  fecha: "",
  motivo: "",
  total: 0,
  estado: true,
  idMascota: 0,
  idMedico: 0,
  idUsuario: 0,
};

function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [form, setForm] = useState<Cita>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarCitas = async () => {
    try {
      const respuesta = await listarCitasActivas();
      setCitas(respuesta.data);
    } catch (error) {
      console.error("Error al listar citas", error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["total", "idMascota", "idMedico", "idUsuario"].includes(name)
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
      if (modoEdicion && form.idCita !== null) {
        await modificarCita(form.idCita, form);
        setMensaje("Cita actualizada correctamente");
      } else {
        await agregarCita(form);
        setMensaje("Cita creada correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarCitas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (cita: Cita) => {
    setForm(cita);
    setModoEdicion(true);
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Cita" : "Ingresar Cita"}
      </h2>
      <Mensaje texto={mensaje} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo
          </label>
          <input
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total
          </label>
          <input
            type="number"
            name="total"
            value={form.total}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Mascota
          </label>
          <input
            type="number"
            name="idMascota"
            value={form.idMascota}
            onChange={handleChange}
            min={1}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Médico
          </label>
          <input
            type="number"
            name="idMedico"
            value={form.idMedico}
            onChange={handleChange}
            min={1}
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
        Listado de Citas
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Fecha
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Motivo
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Total
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Mascota
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Médico
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.idCita}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.fecha}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.motivo}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.total}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.idMascota}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.idMedico}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(c)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() => c.idCita !== null && handleAnular(c.idCita)}
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

export default CitasPage;
