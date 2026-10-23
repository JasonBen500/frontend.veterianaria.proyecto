import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { useCitas } from "../hooks/useCitas";
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
    valor: (c) => (c.nombreMascota ? `${c.idMascota}. ${c.nombreMascota}` : "—"),
  },
  {
    encabezado: "Médico",
    valor: (c) => (c.nombreMedico ? `${c.idMedico}. ${c.nombreMedico}` : "—"),
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
  const c = useCitas();

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
        onAgendar={c.abrirNuevo}
      />

      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(c.citas, busqueda)}
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
            onEliminar={() =>
              cita.idCita !== null && c.handleEliminar(cita.idCita)
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
