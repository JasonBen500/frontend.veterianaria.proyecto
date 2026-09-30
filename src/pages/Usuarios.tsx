import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarUsuariosActivos,
  agregarUsuario,
  modificarUsuario,
  anularUsuario,
} from "../services/usuariosService";
import type { Usuarios } from "../types/usuarios";
import Mensaje from "../components/Mensaje";

const formInicial: Usuarios = {
  idUsuario: null,
  nombre: "",
  usuario: "",
  contrasena: "",
  correo: "",
  estado: true,
  idPerfil: 0,
};

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [form, setForm] = useState<Usuarios>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarUsuarios = async () => {
    try {
      const respuesta = await listarUsuariosActivos();
      setUsuarios(respuesta.data);
    } catch (error) {
      console.error("Error al listar usuarios", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idPerfil" ? Number(value) : value,
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
      if (modoEdicion && form.idUsuario !== null) {
        await modificarUsuario(form.idUsuario, form);
        setMensaje("Usuario actualizado correctamente");
      } else {
        await agregarUsuario(form);
        setMensaje("Usuario creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarUsuarios();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (usuario: Usuarios) => {
    setForm(usuario);
    setModoEdicion(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular este usuario?")) return;
    try {
      await anularUsuario(id);
      setMensaje("Usuario anulado correctamente");
      cargarUsuarios();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {modoEdicion ? "Modificar Usuario" : "Ingresar Usuario"}
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
            Usuario
          </label>
          <input
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo
          </label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Perfil
          </label>
          <input
            type="number"
            name="idPerfil"
            value={form.idPerfil}
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
        Listado de Usuarios
      </h2>
      <table className="w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Nombre
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Usuario
            </th>
            <th className="bg-gray-100 text-left px-4 py-2 text-sm font-semibold text-gray-600">
              Correo
            </th>
            <th className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.idUsuario}>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {u.nombre}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {u.usuario}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-700">
                {u.correo}
              </td>
              <td className="px-4 py-2 border-t text-sm text-center">
                <button
                  onClick={() => handleModificar(u)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Modificar
                </button>
                <button
                  onClick={() =>
                    u.idUsuario !== null && handleAnular(u.idUsuario)
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

export default UsuariosPage;