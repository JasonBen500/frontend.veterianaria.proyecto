import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarMascotasActivas,
  agregarMascota,
  modificarMascota,
  anularMascota,
} from "../services/mascotaService";
import type { Mascota } from "../types/mascota";
import Mensaje from "../components/Mensaje";

const formInicial: Mascota = {
  idMascota: null,
  nombre: "",
  especie: "",
  edad: 0,
  peso: 0,
  estado: true,
  idDueno: 0,
};

function MascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [form, setForm] = useState<Mascota>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarMascotas = async () => {
    try {
      const respuesta = await listarMascotasActivas();
      setMascotas(respuesta.data);
    } catch (error) {
      console.error("Error al listar mascotas", error);
    }
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["edad", "peso", "idDueno"].includes(name)
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
      if (modoEdicion && form.idMascota !== null) {
        await modificarMascota(form.idMascota, form);
        setMensaje("Mascota actualizada correctamente");
      } else {
        await agregarMascota(form);
        setMensaje("Mascota creada correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarMascotas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (mascota: Mascota) => {
    setForm(mascota);
    setModoEdicion(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular esta mascota?")) return;
    try {
      await anularMascota(id);
      setMensaje("Mascota anulada correctamente");
      cargarMascotas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Mascota" : "Ingresar Mascota"}
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
            Especie
          </label>
          <input
            name="especie"
            value={form.especie}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edad
          </label>
          <input
            type="number"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            name="peso"
            value={form.peso}
            onChange={handleChange}
            min={0}
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Dueño
          </label>
          <input
            type="number"
            name="idDueno"
            value={form.idDueno}
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
        Listado de Mascotas
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Nombre
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Especie
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Edad
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Peso
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              ID Dueño
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map((m) => (
            <tr key={m.idMascota}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.nombre}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.especie}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.edad}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.peso}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {m.idDueno}
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
                    m.idMascota !== null && handleAnular(m.idMascota)
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

export default MascotasPage;
