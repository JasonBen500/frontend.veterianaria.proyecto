import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarMedicamentosActivos,
  agregarMedicamento,
  modificarMedicamento,
  anularMedicamento,
} from "../services/medicamentosService";
import type { Medicamentos } from "../types/medicamentos";
import Mensaje from "../components/Mensaje";

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
      setForm(formInicial);
      setModoEdicion(false);
      cargarMedicamentos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (medicamento: Medicamentos) => {
    setForm(medicamento);
    setModoEdicion(true);
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Medicamento" : "Ingresar Medicamento"}
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
            Descripción
          </label>
          <input
            name="descripcion"
            value={form.descripcion}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
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
        Listado de Medicamentos
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Nombre
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Descripción
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Precio
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Stock
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {medicamentos.map((m) => (
            <tr key={m.idMedicamento}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.nombre}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.descripcion}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.precio}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.stock}
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
                    m.idMedicamento !== null && handleAnular(m.idMedicamento)
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

export default MedicamentosPage;
