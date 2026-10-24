import { History, Stethoscope, Thermometer, ClipboardList, CalendarDays } from "lucide-react";
import {
  listarConsultasActivas,
  agregarConsulta,
  modificarConsulta,
  anularConsulta,
} from "../services/consultaService";
import { listarCitasActivas } from "../services/citaService";
import type { Consulta } from "../types/consulta";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import ModalDetalles from "../components/ModalDetalles";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import {
  CLASE_INPUT,
  CLASE_SELECT,
} from "../components/formulario/estilosFormulario";
import { useState } from "react";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useDetallesUrl } from "../hooks/useDetallesUrl";
import { useLista } from "../hooks/useLista";
import { useFiltros } from "../hooks/useFiltros";
import { formatearFecha } from "../utils/fechas";
import { reporteConsultas } from "../utils/reportes";
import { etiquetaCita } from "../utils/citas";
import { filtrarPorTexto } from "../utils/busqueda";
import Modal from "../components/Modal";
import FiltrosTabla from "../components/FiltrosTabla";
import HojaCliente from "../components/HojaCliente";

const configConsultas: ConfigCrud<Consulta> = {
  listar: listarConsultasActivas,
  agregar: agregarConsulta,
  modificar: modificarConsulta,
  anular: anularConsulta,
  obtenerId: (c) => c.idConsulta,
  camposNumericos: ["idCita"],
  vacio: {
    idConsulta: null,
    diagnostico: "",
    sintomas: "",
    estado: true,
    idCita: 0,
  },
  textos: {
    creado: "Consulta creada correctamente",
    actualizado: "Consulta actualizada correctamente",
    anulado: "Consulta anulada correctamente",
    confirmarAnular: "¿Seguro que deseas anular esta consulta?",
    errorListar: "Error al listar consultas",
  },
};

function ConsultasPage() {
  const crud = useCrud(configConsultas);
  const citas = useLista(listarCitasActivas);
  const detalles = useDetallesUrl();
  const [busqueda, setBusqueda] = useState(detalles.busquedaInicial);
  const [idInformeAbierto, setIdInformeAbierto] = useState<number | null>(null);

  // Datos de la cita de cada consulta (paciente, fecha y médico)
  const citaDe = (c: Consulta) => citas.find((x) => x.idCita === c.idCita);

  const filtros = useFiltros(crud.items, [
    {
      tipo: "select",
      id: "paciente",
      etiqueta: "Paciente",
      valor: (c) => citaDe(c)?.nombreMascota,
    },
    {
      tipo: "select",
      id: "medico",
      etiqueta: "Médico",
      valor: (c) => citaDe(c)?.nombreMedico,
    },
    {
      tipo: "fecha",
      id: "fecha",
      etiqueta: "Fecha de la cita",
      valor: (c) => citaDe(c)?.fecha,
    },
    {
      tipo: "select",
      id: "diagnostico",
      etiqueta: "Diagnóstico",
      opciones: ["Con diagnóstico", "Sin diagnóstico"],
      valor: (c) => (c.diagnostico?.trim() ? "Con diagnóstico" : "Sin diagnóstico"),
    },
  ]);

  const columnasTabla: ColumnaTabla<Consulta>[] = [
    {
      encabezado: "Paciente",
      valor: (c) => citaDe(c)?.nombreMascota ?? c.descripcionCita ?? "—",
    },
    {
      encabezado: "Fecha de la cita",
      valor: (c) => {
        const cita = citaDe(c);
        return cita ? formatearFecha(cita.fecha) : "—";
      },
    },
    { encabezado: "Médico", valor: (c) => citaDe(c)?.nombreMedico ?? "—" },
    { encabezado: "Diagnóstico", valor: (c) => c.diagnostico },
    { encabezado: "Síntomas", valor: (c) => c.sintomas },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina
        titulo="Historial de Consultas"
        ruta="/consultas"
        icono={History}
      />

      <BarraListado
        titulo="Listado de Consultas"
        exportar={<BotonesExportar {...reporteConsultas} datos={crud.items} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por diagnóstico, síntomas o cita..."
        textoBoton="Nueva Consulta"
        onNuevo={crud.abrirNuevo}
      />

      <FiltrosTabla estado={filtros} />

      <Mensaje texto={crud.mensaje} />

      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(filtros.filtrados, busqueda)}
        claveFila={(c) => c.idConsulta}
        acciones={(c) => (
          <AccionesFila
            onVerDetalles={() => detalles.ver(c.idConsulta!)}
            onVerInforme={() => setIdInformeAbierto(c.idCita)}
            onEditar={() => crud.handleModificar(c)}
            onAnular={() =>
              c.idConsulta !== null && crud.handleAnular(c.idConsulta)
            }
          />
        )}
      />

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR CONSULTA" : "NUEVA CONSULTA"}
        subtitulo={
          crud.modoEdicion
            ? "Edita la información de la consulta:"
            : "Ingresa los datos de la nueva consulta médica:"
        }
        icono={Stethoscope}
        mensaje={crud.mensaje}
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Cita Asociada:" className="md:col-span-2">
          <select
            name="idCita"
            value={crud.form.idCita === 0 ? "" : crud.form.idCita}
            onChange={crud.handleChange}
            required
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione la cita correspondiente...
            </option>
            {citas.map((c) => (
              <option
                key={c.idCita}
                value={c.idCita ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {etiquetaCita(c)}
              </option>
            ))}
          </select>
        </Campo>

        <Campo
          etiqueta="Síntomas:"
          icono={Thermometer}
          className="md:col-span-2"
        >
          <textarea
            name="sintomas"
            value={crud.form.sintomas}
            onChange={crud.handleChange}
            rows={3}
            placeholder="Ej. Fiebre alta, decaimiento..."
            className={CLASE_INPUT}
          />
        </Campo>

        <Campo
          etiqueta="Diagnóstico:"
          icono={ClipboardList}
          className="md:col-span-2"
        >
          <textarea
            name="diagnostico"
            value={crud.form.diagnostico}
            onChange={crud.handleChange}
            rows={3}
            placeholder="Ej. Infección respiratoria, aplicar tratamiento..."
            className={CLASE_INPUT}
          />
        </Campo>
      </ModalFormulario>

      <ModalDetalles
        abierto={detalles.abierto}
        id={detalles.id}
        entity="consultas"
        configReporte={reporteConsultas}
        icono={Stethoscope}
        subtitulo="Información médica completa"
        onCerrar={detalles.cerrar}
      />

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

export default ConsultasPage;
