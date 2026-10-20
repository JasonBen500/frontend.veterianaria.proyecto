//---IMPORTACIONES--//
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import logazul from "../assets/images/LogoAzul.png";
import {
  listarMedicosActivos,
  agregarMedico,
  modificarMedico,
  anularMedico,
} from "../services/medicoService";
import { HomeIcon, ChevronRight, Plus, Stethoscope } from "lucide-react";
import type { Medico } from "../types/medico";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import Modal from "../components/Modal";
import BotonesExportar from "../components/BotonesExportar";
import { reporteMedicos } from "../utiils/reportes"; // Asegúrate de tener esto configurado
//-------------------------------------------------------------//

//--INFO MEDICOS--//
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
  const [modalAbierto, setModalAbierto] = useState(false);

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
      if (modoEdicion && form.idMedico !== null) {
        await modificarMedico(form.idMedico, form);
        setMensaje("Médico actualizado correctamente");
      } else {
        await agregarMedico(form);
        setMensaje("Médico creado correctamente");
      }
      setModalAbierto(false);
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
    setMensaje("");
    setModalAbierto(true);
  };
  //----------------------------------------------//

  //------------------ANULAR---------------------//
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
  //--------------------------------------//

  //------------------LLAMAR PARA EL ORDEN DE LA TABLA----------------//
  const columnasTabla: ColumnaTabla<Medico>[] = [
    { encabezado: "Nombre", valor: (m) => m.nombre },
    { encabezado: "Apellido", valor: (m) => m.apellido },
    { encabezado: "Cédula", valor: (m) => m.cedula },
    { encabezado: "Especialidad", valor: (m) => m.especialidad },
    { encabezado: "Usuario", valor: (m) => m.nombreUsuario ?? "—" },
  ];
  //--------------------------------------------------------------//

  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">
      {/* CABECERA */}
      <div className="flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Médicos
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
              to="/medicos"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Médicos
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
          Nuevo Médico
        </button>
      </section>

      {/* MODAL DE FORMULARIO */}
      <Modal
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR MÉDICO" : "NUEVO MÉDICO"}
        subtitulo={modoEdicion ? "Edita la información del médico:" : "Ingresa los datos del nuevo médico:"}
        icono={Stethoscope}
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
              placeholder="Ej. Carlos"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Apellido:
            </label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Ej. Mendoza"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Cédula:
            </label>
            <input
              name="cedula"
              value={form.cedula}
              onChange={handleChange}
              placeholder="Ej. 0912345678"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Especialidad:
            </label>
            <input
              name="especialidad"
              value={form.especialidad}
              onChange={handleChange}
              placeholder="Ej. Cirugía Veterinaria"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              ID Usuario:
            </label>
            <input
              type="number"
              name="idUsuario"
              value={form.idUsuario}
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
            Listado de Médicos
          </h2>
          <BotonesExportar {...reporteMedicos} datos={medicos} />
        </div>
      </div>

      <Mensaje texto={mensaje} />

      {/* TABLA REUTILIZABLE */}
      <TablaDatos
        columnas={columnasTabla}
        datos={medicos}
        claveFila={(m) => m.idMedico}
        acciones={(m) => (
          <AccionesFila
            onEditar={() => handleModificar(m)}
            onAnular={() => m.idMedico !== null && handleAnular(m.idMedico)}
          />
        )}
      />
    </div>
  );
}

export default MedicosPage;