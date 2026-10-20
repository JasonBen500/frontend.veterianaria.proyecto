//---IMPORTACIONES--//
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import logazul from "../assets/images/LogoAzul.png";
import {
  listarUsuariosActivos,
  agregarUsuario,
  modificarUsuario,
  anularUsuario,
} from "../services/usuariosService";
import { HomeIcon, ChevronRight, Plus, UserCog } from "lucide-react";
import type { Usuarios } from "../types/usuarios";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import Modal from "../components/Modal";
import BotonesExportar from "../components/BotonesExportar";
import { reporteUsuarios } from "../utiils/reportes"; // Asegúrate de definirlo en utils
//-------------------------------------------------------------//

//--INFO USUARIOS--//
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
  const [modalAbierto, setModalAbierto] = useState(false);

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
  //-----------------------------------------------//

  //---VENTANA EMERGENTE----//
  const abrirNuevo = () => {
    setForm(formInicial);
    setModoEdicion(false);
    setMensaje("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(formInicial);
    setModoEdicion(false);
    setMensaje("");
  };
  //---------------------//

  //------POR SI SALE MAL-------/
  const obtenerMensajeError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.mensaje ?? error.message;
    }
    if (error instanceof Error) return error.message;
    return "Ocurrió un error inesperado";
  };
  //----------------------------------------//

  //----------------ACTUALIZAR-------------------//
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
      setModalAbierto(false);
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
    setMensaje("");
    setModalAbierto(true);
  };
  //----------------------------------------------//

  //------------------ANULAR---------------------//
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
  //--------------------------------------//

  //------------------LLAMAR PARA EL ORDEN DE LA TABLA----------------//
  const columnasTabla: ColumnaTabla<Usuarios>[] = [
    { encabezado: "Nombre", valor: (u) => u.nombre },
    { encabezado: "Usuario", valor: (u) => u.usuario },
    { encabezado: "Correo", valor: (u) => u.correo },
    { encabezado: "Perfil", valor: (u) => u.nombrePerfil ?? "—" },
  ];
  //--------------------------------------------------------------//

  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">
      {/* CABECERA */}
      <div className="flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Usuarios
          </h1>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-nunito font-bold text-marca-oscuro/70 hover:text-marca-oscuro transition-colors"
            >
              <HomeIcon size={15} />
            </Link>

             <Link
              to="/administracion"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Administración
            </Link>

            <Link
              to="/usuarios"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Usuarios
            </Link>
          </div>
        </div>

        <img src={logazul} alt="Logo de la clínica" className="w-20" />
      </div>

      {/* BOTÓN AGREGAR */}
      <section className="mt-6 mb-4 flex justify-end">
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-5 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </section>

      {/* MODAL DE FORMULARIO */}
      <Modal
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR USUARIO" : "NUEVO USUARIO"}
        subtitulo={modoEdicion ? "Edita la información del usuario:" : "Ingresa los datos del nuevo usuario:"}
        icono={UserCog}
        onCerrar={cerrarModal}
      >
        <Mensaje texto={mensaje} />
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Nombre:
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Ana Torres"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Usuario:
            </label>
            <input
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="Ej. atorres"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Contraseña:
            </label>
            <input
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Correo:
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Ej. ana.torres@email.com"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              ID Perfil:
            </label>
            <input
              type="number"
              name="idPerfil"
              value={form.idPerfil}
              onChange={handleChange}
              min={1}
              placeholder="Ej. 1"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mt-8 col-span-full flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-full border border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* CONTENEDOR TÍTULO DE TABLA Y BOTONES EXPORTAR */}
      <div className="bg-marca-beigeclaro2 p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 mt-6">
        <div className="mb-2 flex w-full flex-wrap items-center justify-between gap-100">
          <h2 className="text-center text-2xl font-nunito font-extrabold text-gray-800">
            Listado de Usuarios
          </h2>
          <BotonesExportar {...reporteUsuarios} datos={usuarios} />
        </div>
      </div>

      <Mensaje texto={mensaje} />

      {/* TABLA REUTILIZABLE */}
      <TablaDatos
        columnas={columnasTabla}
        datos={usuarios}
        claveFila={(u) => u.idUsuario}
        acciones={(u) => (
          <AccionesFila
            onEditar={() => handleModificar(u)}
            onAnular={() => u.idUsuario !== null && handleAnular(u.idUsuario)}
          />
        )}
      />
    </div>
  );
}

export default UsuariosPage;