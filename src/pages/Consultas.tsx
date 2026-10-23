import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Modal from "../components/Modal";
import {
  listarConsultasActivas,
  agregarConsulta,
  modificarConsulta,
  anularConsulta,
} from "../services/consultaService";
import { listarCitasActivas } from "../services/citaService";
import { listarMascotasActivas } from "../services/mascotaService";
import { History, Stethoscope, Thermometer, ClipboardList } from "lucide-react";
import type { Consulta } from "../types/consulta";
import type { Cita } from "../types/cita";
import type { Mascota } from "../types/mascota";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import { reporteConsultas } from "../utils/reportes";
import BotonesExportar from "../components/BotonesExportar";
import { VistaDetallesEntidad } from "../components/DetallesDatos";
import { formatearFecha } from "../utils/fechas";
import { filtrarPorTexto } from "../utils/busqueda";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import {
  CLASE_INPUT,
  CLASE_SELECT,
} from "../components/formulario/estilosFormulario";

const formInicial: Consulta = {
  idConsulta: null,
  diagnostico: "",
  sintomas: "",
  estado: true,
  idCita: 0,
};

function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [form, setForm] = useState<Consulta>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("buscar") ?? "");

  // Estados para el modal de detalles
  const idDesdeUrl = Number(searchParams.get("detalle")) || null;
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(idDesdeUrl !== null);
  const [idDetalleSeleccionado, setIdDetalleSeleccionado] = useState<number | null>(idDesdeUrl);

  const handleVerDetalles = (id: number) => {
    setIdDetalleSeleccionado(id);
    setModalDetallesAbierto(true);
  };

  const cargarConsultas = async () => {
    try {
      const respuesta = await listarConsultasActivas();
      setConsultas(respuesta.data);
    } catch (error) {
      console.error("Error al listar consultas", error);
    }
  };

  const cargarCitas = async () => {
    try {
      const respuesta = await listarCitasActivas();
      setCitas(respuesta.data);
    } catch (error) {
      console.error("Error al listar citas", error);
    }
  };

  const cargarMascotas = async () => {
    try {
      const respuesta = await listarMascotasActivas();
      setMascotas(respuesta.data);
    } catch (error) {
      console.error("Error al listar mascotas", error);
    }
  };

  useEffect(() => {
    cargarConsultas();
    cargarCitas();
    cargarMascotas();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idCita" ? Number(value) : value,
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
      if (modoEdicion && form.idConsulta !== null) {
        await modificarConsulta(form.idConsulta, form);
        setMensaje("Consulta actualizada correctamente");
      } else {
        await agregarConsulta(form);
        setMensaje("Consulta creada correctamente");
      }
      setModalAbierto(false);
      setForm(formInicial);
      setModoEdicion(false);
      cargarConsultas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleModificar = (consulta: Consulta) => {
    setForm(consulta);
    setModoEdicion(true);
    setMensaje("");
    setModalAbierto(true);
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas anular esta consulta?")) return;
    try {
      await anularConsulta(id);
      setMensaje("Consulta anulada correctamente");
      cargarConsultas();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

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

  const columnasTabla: ColumnaTabla<Consulta>[] = [
    { encabezado: "Diagnóstico", valor: (c) => c.diagnostico },
    { encabezado: "Síntomas", valor: (c) => c.sintomas },
    { encabezado: "Cita Asociada", valor: (c) => c.descripcionCita ?? `Cita #${c.idCita}` },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      {/* HEADER SUPERIOR */}
      <EncabezadoPagina
        titulo="Historial de Consultas"
        ruta="/consultas"
        icono={History}
      />

      {/* TARJETA UNIFICADA DE CONTROLES DE TABLA */}
      <BarraListado
        titulo="Listado de Consultas"
        exportar={<BotonesExportar {...reporteConsultas} datos={consultas} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por diagnóstico, síntomas o cita..."
        textoBoton="Nueva Consulta"
        onNuevo={abrirNuevo}
      />

      <Mensaje texto={mensaje} />

      {/* TABLA DE DATOS UNIFICADA */}
      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(consultas, busqueda)}
        claveFila={(c) => c.idConsulta}
        acciones={(c) => (
          <AccionesFila
            onVerDetalles={() => handleVerDetalles(c.idConsulta!)}
            onEditar={() => handleModificar(c)}
            onAnular={() => c.idConsulta !== null && handleAnular(c.idConsulta)}
          />
        )}
      />

      {/* MODAL DEL FORMULARIO DE CONSULTAS */}
      {/* MODAL DEL FORMULARIO DE CONSULTAS */}
      <ModalFormulario
        abierto={modalAbierto}
        titulo={modoEdicion ? "MODIFICAR CONSULTA" : "NUEVA CONSULTA"}
        subtitulo={
          modoEdicion
            ? "Edita la información de la consulta:"
            : "Ingresa los datos de la nueva consulta médica:"
        }
        icono={Stethoscope}
        mensaje={mensaje}
        onSubmit={handleSubmit}
        onCerrar={cerrarModal}
      >
        {/* COMBOBOX DE CITA CON CRUCE DE MASCOTA */}
        <Campo etiqueta="Cita Asociada:" className="md:col-span-2">
          <select
            name="idCita"
            value={form.idCita === 0 ? "" : form.idCita}
            onChange={handleChange}
            required
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione la cita correspondiente...
            </option>
            {citas.map((c: any) => {
              let nombreMascota =
                c.nombreMascota || c.nombre_mascota || c.mascota?.nombre;

              if (!nombreMascota && c.idMascota) {
                const mascotaEncontrada = mascotas.find(
                  (m: any) => String(m.idMascota) === String(c.idMascota),
                );
                nombreMascota = mascotaEncontrada?.nombre;
              }
              const textoFinal =
                nombreMascota || `Mascota ID: ${c.idMascota ?? "N/A"}`;

              return (
                <option
                  key={c.idCita}
                  value={c.idCita ?? undefined}
                  className="bg-marca-beigeclaro2"
                >
                  Cita #{c.idCita} - Paciente: {textoFinal} (
                  {formatearFecha(c.fecha)})
                </option>
              );
            })}
          </select>
        </Campo>

        <Campo
          etiqueta="Síntomas:"
          icono={Thermometer}
          className="md:col-span-2"
        >
          <textarea
            name="sintomas"
            value={form.sintomas}
            onChange={handleChange}
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
            value={form.diagnostico}
            onChange={handleChange}
            rows={3}
            placeholder="Ej. Infección respiratoria, aplicar tratamiento..."
            className={CLASE_INPUT}
          />
        </Campo>
      </ModalFormulario>

      {/* MODAL DE DETALLES */}
      <Modal
        abierto={modalDetallesAbierto}
        titulo="Detalles de la Consulta"
        subtitulo="Información médica completa"
        icono={Stethoscope}
        onCerrar={() => {
          setModalDetallesAbierto(false);
          setSearchParams({}, { replace: true });
        }}
      >
        {idDetalleSeleccionado && (
          <VistaDetallesEntidad
            entity="detallecita"
            id={idDetalleSeleccionado}
            configReporte={reporteConsultas}
          />
        )}
      </Modal>

    </div>
  );
}

export default ConsultasPage;
