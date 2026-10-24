import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import Modal from "../components/Modal";
import HojaCliente from "../components/HojaCliente";
import ModalConsulta from "../components/ModalConsulta";
import EncabezadoPagina from "../components/EncabezadoPagina";
import { VistaDetallesEntidad } from "../components/DetallesDatos";
import PanelEstadisticasCitas from "../components/citas/PanelEstadisticasCitas";
import BloqueSuperiorCitas from "../components/citas/BloqueSuperiorCitas";
import FormularioCita from "../components/citas/FormularioCita";
import FiltrosTabla from "../components/FiltrosTabla";
import { useAuth } from "../context/AuthContext";
import { useCitas } from "../hooks/useCitas";
import { useFiltros } from "../hooks/useFiltros";
import { useDatosInicio } from "../hooks/useDatosInicio";
import { calcularContadores } from "../utils/contadores";
import { formatearFecha } from "../utils/fechas";
import { filtrarPorTexto } from "../utils/busqueda";
import { reporteCitas } from "../utils/reportes";
import type { Cita } from "../types/cita";

const columnasTabla: ColumnaTabla<Cita>[] = [
  { encabezado: "Fecha", valor: (c) => formatearFecha(c.fecha) },
  { encabezado: "Motivo", valor: (c) => c.motivo },
  { encabezado: "Total", valor: (c) => `Q ${Number(c.total).toFixed(2)}` },
  {
    encabezado: "Mascota",
    valor: (c) => c.nombreMascota ?? "—",
  },
  {
    encabezado: "Médico",
    valor: (c) => c.nombreMedico ?? "—",
  },
];

function CitasPage() {
  // Datos del dashboard (contadores, gráficas, calendario)
  const datos = useDatosInicio();
  const { cargando, error } = datos;
  const contadores = calcularContadores(datos);
  const mostrar = (n?: number) =>
    cargando ? "…" : error || n === undefined ? "—" : n;

  // Datos y acciones del CRUD de citas
  const { esAdmin } = useAuth();

  // Si llega desde "Iniciar cita" (Mascotas), se abre el formulario con la mascota elegida
  const location = useLocation();
  const [entrada] = useState<{ mascota?: number } | null>(() => {
    const estado = location.state as {
      nuevaCita?: boolean;
      nuevaCitaMascota?: number;
    } | null;
    return estado?.nuevaCita ? { mascota: estado.nuevaCitaMascota } : null;
  });
  const c = useCitas(entrada);
  useEffect(() => {
    // Evita que el formulario se vuelva a abrir al recargar la página
    if (entrada) window.history.replaceState({}, "");
  }, [entrada]);

  const filtros = useFiltros(c.citas, [
    {
      tipo: "select",
      id: "atencion",
      etiqueta: "Atención",
      opciones: ["Atendida", "Pendiente"],
      valor: (cita) =>
        cita.idCita !== null && c.citasAtendidas.has(cita.idCita)
          ? "Atendida"
          : "Pendiente",
    },
    { tipo: "select", id: "medico", etiqueta: "Médico", valor: (cita) => cita.nombreMedico },
    { tipo: "select", id: "mascota", etiqueta: "Mascota", valor: (cita) => cita.nombreMascota },
    { tipo: "fecha", id: "fecha", etiqueta: "Fecha de la cita", valor: (cita) => cita.fecha },
    { tipo: "numero", id: "total", etiqueta: "Total (Q)", valor: (cita) => cita.total },
  ]);

  // Estado puramente visual de esta página
  const [searchParams, setSearchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("buscar") ?? "");
  const [modalConsultaAbierto, setModalConsultaAbierto] = useState(false);
  const [idInformeAbierto, setIdInformeAbierto] = useState<number | null>(null);

  const idDesdeUrl = Number(searchParams.get("detalle")) || null;
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(
    idDesdeUrl !== null,
  );
  const [idDetalleSeleccionado, setIdDetalleSeleccionado] = useState<
    number | null
  >(idDesdeUrl);

  const verDetalles = (id: number) => {
    setIdDetalleSeleccionado(id);
    setModalDetallesAbierto(true);
  };

  const cerrarDetalles = () => {
    setModalDetallesAbierto(false);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina titulo="Citas" ruta="/citas" />

      <PanelEstadisticasCitas
        citas={datos.citas}
        consultas={c.consultas}
        cargando={datos.cargando}
        error={datos.error}
      />

      <Mensaje texto={c.mensaje} />

      <BloqueSuperiorCitas
        citas={c.citas}
        atendidas={mostrar(contadores.citasAtendidas)}
        pendientes={mostrar(contadores.citasPendientes)}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        onIniciarConsulta={() => setModalConsultaAbierto(true)}
        onAgendar={() => c.abrirNuevo()}
      />

      <FiltrosTabla estado={filtros} />

      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(filtros.filtrados, busqueda)}
        claveFila={(cita) => cita.idCita}
        acciones={(cita) => (
          <AccionesFila
            onVerDetalles={() => verDetalles(cita.idCita!)}
            onVerInforme={
              cita.idCita !== null && c.citasAtendidas.has(cita.idCita)
                ? () => setIdInformeAbierto(cita.idCita)
                : undefined
            }
            onEditar={() => c.handleModificar(cita)}
            onAnular={() => cita.idCita !== null && c.handleAnular(cita.idCita)}
            onEliminar={
              esAdmin
                ? () => cita.idCita !== null && c.handleEliminar(cita.idCita)
                : undefined
            }
          />
        )}
      />

      <FormularioCita
        abierto={c.modalAbierto}
        modoEdicion={c.modoEdicion}
        form={c.form}
        mensaje={c.mensaje}
        mascotas={c.mascotas}
        medicos={c.medicos}
        usuarios={c.usuarios}
        onChange={c.handleChange}
        onSubmit={c.handleSubmit}
        onCerrar={c.cerrarModal}
      />

      <ModalConsulta
        abierto={modalConsultaAbierto}
        onCerrar={() => setModalConsultaAbierto(false)}
        onFinalizado={() => {
          c.cargarConsultas();
          c.cargarCitas();
        }}
      />

      <Modal
        abierto={modalDetallesAbierto}
        titulo="Detalles de la Cita"
        subtitulo="Información completa del evento"
        icono={CalendarDays}
        onCerrar={cerrarDetalles}
      >
        {idDetalleSeleccionado && (
          <VistaDetallesEntidad
            entity="citas"
            id={idDetalleSeleccionado}
            configReporte={reporteCitas}
          />
        )}
      </Modal>

      <Modal
        abierto={idInformeAbierto !== null}
        titulo="Informe de la cita"
        subtitulo="Resumen de la atención"
        icono={CalendarDays}
        onCerrar={() => setIdInformeAbierto(null)}
      >
        {idInformeAbierto !== null && (
          <HojaCliente key={idInformeAbierto} idCita={idInformeAbierto} />
        )}
      </Modal>
    </div>
  );
}

export default CitasPage;
