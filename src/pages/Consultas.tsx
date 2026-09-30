import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarConsultasActivas,
  agregarConsulta,
  modificarConsulta,
  anularConsulta,
} from "../services/consultaService";
import type { Consulta } from "../types/consulta";
import Mensaje from "../components/Mensaje";

const formInicial: Consulta = {
  idConsulta: null,
  diagnostico: "",
  sintomas: "",
  estado: true,
  idCita: 0,
};

function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [form, setForm] = useState<Consulta>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarConsultas = async () => {
    try {
      const respuesta = await listarConsultasActivas();
      setConsultas(respuesta.data);
    } catch (error) {
      console.error("Error al listar consultas", error);
    }
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idCita" ? Number(value) : value,
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
      if (modoEdicion && form.idConsulta !== null) {
        await modificarConsulta(form.idConsulta, form);
        setMensaje("Consulta actualizada correctamente");
      } else {
        await agregarConsulta(form);
        setMensaje("Consulta creada correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarConsultas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (consulta: Consulta) => {
    setForm(consulta);
    setModoEdicion(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular esta consulta?")) return;
    try {
      await anularConsulta(id);
      setMensaje("Consulta anulada correctamente");
      cargarConsultas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Consulta" : "Ingresar Consulta"}
      </h2>
      <Mensaje texto={mensaje} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnóstico
          </label>
          <textarea
            name="diagnostico"
            value={form.diagnostico}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Síntomas
          </label>
          <textarea
            name="sintomas"
            value={form.sintomas}
            onChange={handleChange}
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
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Listado de Consultas
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Diagnóstico
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Síntomas
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              ID Cita
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c) => (
            <tr key={c.idConsulta}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.diagnostico}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.sintomas}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {c.idCita}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(c)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() =>
                    c.idConsulta !== null && handleAnular(c.idConsulta)
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

export default ConsultasPage;
