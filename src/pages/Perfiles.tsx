//---IMPORTACIONES--//
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import logazul from "../assets/images/LogoAzul.png";
import {
  listarPerfilesActivos,
  agregarPerfil,
  modificarPerfil,
  anularPerfil,
} from "../services/perfilService";
import { HomeIcon, ChevronRight, Plus, Users } from "lucide-react";
import type { Perfil } from "../types/perfil";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import Modal from "../components/Modal";
// Nota: Si en el futuro necesitas exportar perfiles, puedes importar BotonesExportar y reportePerfiles
//-------------------------------------------------------------//

//--INFO PERFILES--//
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
  const [modalAbierto, setModalAbierto] = useState(false);

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
      if (modoEdicion && form.idPerfil !== null) {
        await modificarPerfil(form.idPerfil, form);
        setMensaje("Perfil actualizado correctamente");
      } else {
        await agregarPerfil(form);
        setMensaje("Perfil creado correctamente");
      }
      setModalAbierto(false);
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
    setMensaje("");
    setModalAbierto(true);
  };
  //----------------------------------------------//

  //------------------ANULAR---------------------//
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
  //--------------------------------------//

  //------------------LLAMAR PARA EL ORDEN DE LA TABLA----------------//
  const columnasTabla: ColumnaTabla<Perfil>[] = [
    { encabezado: "Nombre del Perfil", valor: (p) => p.nombrePerfil },
  ];
  //--------------------------------------------------------------//

  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">
      {/* CABECERA */}
      <div className="flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Perfiles
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
              to="/perfiles"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Perfiles
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
          Nuevo Perfil
        </button>
      </section>

      {/* MODAL DE FORMULARIO */}
      <Modal
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR PERFIL" : "NUEVO PERFIL"}
        subtitulo={modoEdicion ? "Edita la información del perfil:" : "Ingresa los datos del nuevo perfil:"}
        icono={Users}
        onCerrar={cerrarModal}
      >
        <Mensaje texto={mensaje} />
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Nombre del Perfil:
            </label>
            <input
              name="nombrePerfil"
              value={form.nombrePerfil}
              onChange={handleChange}
              placeholder="Ej. Administrador"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
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

      {/* CONTENEDOR TÍTULO DE TABLA */}
      <div className="bg-marca-beigeclaro2 p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 mt-6">
        <div className="mb-2 flex w-full items-center justify-between">
          <h2 className="text-center text-2xl font-nunito font-extrabold text-gray-800">
            Listado de Perfiles
          </h2>
        </div>
      </div>

      <Mensaje texto={mensaje} />

      {/* TABLA REUTILIZABLE */}
      <TablaDatos
        columnas={columnasTabla}
        datos={perfiles}
        claveFila={(p) => p.idPerfil}
        acciones={(p) => (
          <AccionesFila
            onEditar={() => handleModificar(p)}
            onAnular={() => p.idPerfil !== null && handleAnular(p.idPerfil)}
          />
        )}
      />
    </div>
  );
}

export default PerfilesPage;