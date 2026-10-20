//---IMPORTACIONES--//
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import { formatearFecha } from "../utiils/fechas";
import logazul from "../assets/images/LogoAzul.png";
import {
  listarCitasActivas,
  agregarCita,
  modificarCita,
  anularCita,
  eliminarCita,
} from "../services/citaService";
import {
  CircleCheck,
  Clock,
  Plus,
  HomeIcon,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import type { Cita } from "../types/cita";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import Calendario from "../components/dashboard/Calendario";
import { useDatosInicio } from "../hooks/useDatosInicio";
import { calcularContadores } from "../utiils/contadores";
import TarjetaContador from "../components/dashboard/TarjetaContador";
import ProximasCitas from "../components/dashboard/ProximasCitas";
import BotonesExportar from "../components/BotonesExportar";
import { reporteCitas } from "../utiils/reportes";
import Modal from "../components/Modal";
import GraficaAtendidasSemana from "../components/dashboard/GraficaAtendidasSemana";
//-------------------------------------------------------------//

//--INFO CITAS--//
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
  const datos = useDatosInicio();
  const { cargando, error } = datos;
  const contadores = calcularContadores(datos);

  const mostrar = (n?: number) =>
    cargando ? "…" : error || n === undefined ? "—" : n;

  const [citas, setCitas] = useState<Cita[]>([]);
  const [form, setForm] = useState<Cita>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);


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
      if (modoEdicion && form.idCita !== null) {
        await modificarCita(form.idCita, form);
        setMensaje("Cita actualizada correctamente");
      } else {
        await agregarCita(form);
        setMensaje("Cita creada correctamente");
      }
      setModalAbierto(false);
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
    setMensaje("");
    setModalAbierto(true);
  };
  //----------------------------------------------//


  //------------------ANULAR---------------------//
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
  //--------------------------------------//

  //-----------------------ELIMINAR--------------//
  const handleEliminar = async (id: number) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar esta cita? Se eliminarán también sus detalles. Esta acción no se puede deshacer.",
      )
    )
      return;
    try {
      await eliminarCita(id);
      setMensaje("Cita eliminada correctamente");
      cargarCitas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };
  //--------------------------------------------//


  //------------------LLAMAR PARA EL ORDEN DE LA TABLA----------------//
  const columnasTabla: ColumnaTabla<Cita>[] = [
    { encabezado: "Fecha", valor: (c) => formatearFecha(c.fecha) },
    { encabezado: "Motivo", valor: (c) => c.motivo },
    { encabezado: "Total", valor: (c) => c.total },
    { encabezado: "Mascota", valor: (c) => c.nombreMascota ?? "—" },
    { encabezado: "Médico", valor: (c) => c.nombreMedico ?? "—" },
  ];
  //--------------------------------------------------------------//

  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">

      <div className="flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Citas
          </h1>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-nunito font-bold text-marca-oscuro/70 hover:text-marca-oscuro transition-colors"
            >
              <HomeIcon size={15} />
            </Link>

            <Link
              to="/citas"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Citas
            </Link>
          </div>
        </div>

        <img
          src={logazul}
          alt="Logo de la clínica"
          className="w-20"
        />
      </div>

      <section className="mt-6 mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaContador
          titulo="Citas atendidas"
          valor={mostrar(contadores.citasAtendidas)}
          icono={CircleCheck}
          colorIcono="bg-marca-grisclaro/30 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas pendientes"
          valor={mostrar(contadores.citasPendientes)}
          icono={Clock}
          colorIcono="bg-marca-azulmarino/20 text-marca-oscuro"
        />

        <div>

        </div>

        <div className="flex w-100 h-15 justify-center mt-4">
          <button
            type="button"
            onClick={abrirNuevo}
            className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-5 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
          >
            <Plus size={20} />
            Agendar Cita
          </button>
        </div>

      </section>

      <div className="grid gap-2 lg:grid-cols-3">
        <section className="min-h-80 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-lg font-nunito font-extrabold text-marca-oscuro">Estadísticas</h2>
          <div className="space-y-8">
            <GraficaAtendidasSemana
              citas={datos.citas}
              consultas={datos.consultas}
              cargando={datos.cargando}
              error={datos.error}
            />
          </div>
        </section>

        <Calendario citas={datos.citas} />

        <ProximasCitas
          citas={datos.citas}
          cargando={datos.cargando}
          error={datos.error}
        />

      </div>



      <Modal
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR CITA" : "NUEVA CITA"}
        subtitulo={modoEdicion ? "Edita la información de la cita:" : "Ingresa los datos para agendar la nueva cita:"}
        icono={CalendarDays}
        onCerrar={cerrarModal}
      >
        <Mensaje texto={mensaje} />
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Fecha:
            </label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Motivo:
            </label>
            <input
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              placeholder="Ej. Control y vacunas"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              Total:
            </label>
            <input
              type="number"
              name="total"
              value={form.total}
              onChange={handleChange}
              min={0}
              placeholder="0.00"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              ID Mascota:
            </label>
            <input
              type="number"
              name="idMascota"
              value={form.idMascota}
              onChange={handleChange}
              min={1}
              placeholder="Ej. 1"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-nunito text-lg font-semibold text-gray-700 mb-2">
              ID Médico:
            </label>
            <input
              type="number"
              name="idMedico"
              value={form.idMedico}
              onChange={handleChange}
              min={1}
              placeholder="Ej. 1"
              className="w-full border border-cafenigga rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
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

      <div className="bg-marca-beigeclaro2 p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 mt-6">

        <div className="mb-2 flex flex-wrap items-center justify-between gap-100">
          <h2 className="text-center text-2xl font-nunito font-extrabold text-gray-800">Listado de Citas</h2>
          <BotonesExportar {...reporteCitas} datos={citas} />
        </div>

      </div>

      <Mensaje texto={mensaje} />
      <TablaDatos
        columnas={columnasTabla}
        datos={citas}
        claveFila={(c) => c.idCita}
        acciones={(c) => (
          <AccionesFila
            onEditar={() => handleModificar(c)}
            onAnular={() => c.idCita !== null && handleAnular(c.idCita)}
            onEliminar={() => c.idCita !== null && handleEliminar(c.idCita)}
          />
        )}
      />
    </div>
  );

}

export default CitasPage;