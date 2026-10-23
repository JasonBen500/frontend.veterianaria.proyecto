//---IMPORTACIONES--//
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarUsuariosActivos,
  agregarUsuario,
  modificarUsuario,
  anularUsuario,
} from "../services/usuariosService";
import { UserCog, Plus, Lock, ShieldCheck, Mail, PawPrint } from "lucide-react";
import type { Usuarios } from "../types/usuarios";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import BotonesExportar from "../components/BotonesExportar";
import { reporteUsuarios } from "../utils/reportes";
import { listarPerfilesActivos } from "../services/perfilService";
import type { Perfil } from "../types/perfil";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import { filtrarPorTexto } from "../utils/busqueda";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import {
  CLASE_INPUT,
  CLASE_SELECT,
} from "../components/formulario/estilosFormulario";
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
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [form, setForm] = useState<Usuarios>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cargarUsuarios = async () => {
    try {
      const respuesta = await listarUsuariosActivos();
      setUsuarios(respuesta.data);
    } catch (error) {
      console.error("Error al listar usuarios", error);
    }
  };

  const cargarPerfiles = async () => {
    try {
      const respuesta = await listarPerfilesActivos();
      setPerfiles(respuesta.data);
    } catch (error) {
      console.error("Error al listar perfiles", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);


  useEffect(() => {
    cargarPerfiles();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">
      {/* CABECERA */}
      <EncabezadoPagina
        titulo="Usuarios"
        ruta="/usuarios"
        padres={[{ texto: "Administración", ruta: "/administracion" }]}
        icono={UserCog}
      />

      <BarraListado
        titulo="Listado de Usuarios"
        exportar={<BotonesExportar {...reporteUsuarios} datos={usuarios} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre, usuario, correo o perfil..."
        textoBoton="Nuevo Usuario"
        onNuevo={abrirNuevo}
      />

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
      <ModalFormulario
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR USUARIO" : "NUEVO USUARIO"}
        subtitulo={
          modoEdicion
            ? "Edita la información del usuario:"
            : "Ingresa los datos del nuevo usuario:"
        }
        icono={UserCog}
        mensaje={mensaje}
        onSubmit={handleSubmit}
        onCerrar={cerrarModal}
      >
        <Campo etiqueta="Nombre:">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Ana Torres"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Usuario:">
          <input
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Ej. atorres"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Contraseña:" icono={Lock}>
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            placeholder="••••••••"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Correo:">
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Ej. ana.torres@email.com"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Perfil:" icono={ShieldCheck} className="md:col-span-2">
          <select
            name="idPerfil"
            value={form.idPerfil === 0 ? "" : form.idPerfil}
            onChange={handleChange}
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione un perfil de la lista...
            </option>
            {perfiles.map((p) => (
              <option
                key={p.idPerfil}
                value={p.idPerfil ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {p.nombrePerfil}
              </option>
            ))}
          </select>
        </Campo>
      </ModalFormulario>

      <Mensaje texto={mensaje} />

      {filtrarPorTexto(usuarios, busqueda).length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <UserCog size={40} className="text-marca-verde" />
          <p className="font-nunito text-sm font-bold text-marca-oscuro/60">
            No hay usuarios para mostrar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtrarPorTexto(usuarios, busqueda).map((u) => (
            <article
              key={u.idUsuario}
              className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-1"
            >
              <PawPrint
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-5 -right-4 h-24 w-24 -rotate-12 text-marca-oscuro/5 transition group-hover:rotate-0"
              />

              <div className="relative flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-marca-naranja/30 text-marca-oscuro shadow-sm">
                  <UserCog size={28} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-nunito text-lg font-extrabold text-marca-oscuro">
                    {u.nombre}
                  </h3>
                  <p className="truncate font-nunito text-sm font-bold text-marca-oscuro/70">
                    @{u.usuario}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate font-nunito text-xs font-semibold text-marca-oscuro/60">
                    <Mail size={13} className="shrink-0" />
                    {u.correo}
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-between border-t border-marca-oscuro/10 pt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-marca-verde/30 px-3 py-1 font-nunito text-xs font-extrabold text-marca-oscuro">
                  <ShieldCheck size={14} />
                  {u.nombrePerfil ?? "Sin perfil"}
                </span>

                <AccionesFila
                  onEditar={() => handleModificar(u)}
                  onAnular={() =>
                    u.idUsuario !== null && handleAnular(u.idUsuario)
                  }
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsuariosPage;