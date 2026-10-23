//---IMPORTACIONES--//
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import {
  listarPerfilesActivos,
  agregarPerfil,
  modificarPerfil,
  anularPerfil,
} from "../services/perfilService";
import { Users, ShieldCheck } from "lucide-react";
import type { Perfil } from "../types/perfil";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import { filtrarPorTexto } from "../utils/busqueda";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import BotonesExportar from "../components/BotonesExportar";
import { reportePerfiles } from "../utils/reportes";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import { CLASE_INPUT } from "../components/formulario/estilosFormulario";
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
  const [busqueda, setBusqueda] = useState("");

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
    <div className="p-6 max-w-6xl mx-auto mb-4">
      {/* CABECERA (Con sombra unificada) */}
      <EncabezadoPagina
        titulo="Perfiles"
        ruta="/perfiles"
        padres={[{ texto: "Administración", ruta: "/administracion" }]}
        icono={ShieldCheck}
      />

      <BarraListado
        titulo="Listado de Perfiles"
        exportar={<BotonesExportar {...reportePerfiles} datos={perfiles} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre de perfil..."
        textoBoton="Nuevo Perfil"
        onNuevo={abrirNuevo}
      />
      <Mensaje texto={mensaje} />

      {/* MODAL DE FORMULARIO */}
      {/* MODAL DE FORMULARIO */}
      <ModalFormulario
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR PERFIL" : "NUEVO PERFIL"}
        subtitulo={
          modoEdicion
            ? "Edita la información del perfil:"
            : "Ingresa los datos del nuevo perfil:"
        }
        icono={Users}
        mensaje={mensaje}
        onSubmit={handleSubmit}
        onCerrar={cerrarModal}
        claseGrid="grid-cols-1"
      >
        <Campo etiqueta="Nombre del Perfil:" icono={ShieldCheck}>
          <input
            name="nombrePerfil"
            value={form.nombrePerfil}
            onChange={handleChange}
            placeholder="Ej. Administrador"
            className={CLASE_INPUT}
          />
        </Campo>
      </ModalFormulario>

      {/* TABLA REUTILIZABLE */}
      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(perfiles, busqueda)}
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