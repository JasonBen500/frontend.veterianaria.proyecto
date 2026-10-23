import { useState, useEffect } from "react";
import type { Cita } from "../../types/cita";
import type { Mascota } from "../../types/mascota";
import type { Medico } from "../../types/medico";
import type { Usuarios } from "../../types/usuarios";
import { formatearFecha, hoyTexto, soloFecha } from "../../utils/fechas";
import Modal from "../Modal";
import { Stethoscope, Eye, CalendarHeart, CalendarDays, PawPrint, Dog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { listarMascotasActivas } from "../../services/mascotaService";
import { listarMedicosActivos } from "../../services/medicoService";
import { listarUsuariosActivos } from "../../services/usuariosService";

interface Props {
  citas: Cita[];
  cargando: boolean;
  error: boolean;
}

function ProximasCitas({ citas, cargando, error }: Props) {
  const hoy = hoyTexto();
  const navigate = useNavigate();

  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  // Catálogos para cruzar IDs por nombres reales
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [resMascotas, resMedicos, resUsuarios] = await Promise.all([
          listarMascotasActivas(),
          listarMedicosActivos(),
          listarUsuariosActivos(),
        ]);
        setMascotas(resMascotas.data);
        setMedicos(resMedicos.data);
        setUsuarios(resUsuarios.data);
      } catch (err) {
        console.error("Error al cargar catálogos en próximas citas", err);
      }
    };
    cargarCatalogos();
  }, []);

  const handleVerDetalles = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setModalDetallesAbierto(true);
  };

  const proximas = citas
    .filter((c) => soloFecha(c.fecha) >= hoy)
    .sort((a, b) => soloFecha(a.fecha).localeCompare(soloFecha(b.fecha)))
    .slice(0, 3);

  // Funciones auxiliares para obtener los nombres de una cita específica
  const obtenerNombreMascota = (cita: Cita) => {
    const encontrada = mascotas.find((m) => String(m.idMascota) === String(cita.idMascota));
    return cita.nombreMascota || encontrada?.nombre || "Sin mascota";
  };

  const obtenerNombreMedico = (cita: Cita) => {
    const encontrado = medicos.find((m) => String(m.idMedico) === String(cita.idMedico));
    return cita.nombreMedico || (encontrado ? `${encontrado.nombre} ${encontrado.apellido || ""}` : null) || "—";
  };

  const obtenerNombreUsuario = (cita: Cita) => {
    const encontrado = usuarios.find((u) => String(u.idUsuario) === String(cita.idUsuario));
    return cita.nombreUsuario || encontrado?.nombre || "No registrado";
  };

  return (
    <section className="h-full min-h-80 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-naranja/30 text-marca-oscuro">
          <CalendarHeart size={20} />
        </div>
        <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
          Próximas Citas
        </h2>
      </div>

      {cargando && (
        <p className="font-nunito text-sm text-marca-oscuro/60">Cargando…</p>
      )}

      {error && (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          No se pudieron cargar las citas.
        </p>
      )}

      {!cargando && !error && proximas.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-marca-oscuro/20 py-10 text-center">
          <Dog size={40} className="text-marca-verde" />
          <p className="font-nunito text-sm font-bold text-marca-oscuro/60">
            No hay citas próximas.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {proximas.map((cita) => (
          <div
            key={cita.idCita}
            className="flex items-center justify-between gap-3 rounded-3xl border border-marca-oscuro/10 bg-white/70 p-4 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-0.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-marca-verde/40 text-marca-oscuro">
                <PawPrint size={22} />
              </div>

              <div className="min-w-0 space-y-0.5">
                <p className="truncate font-nunito text-base font-extrabold text-marca-oscuro">
                  {obtenerNombreMascota(cita)}
                </p>
                <p className="truncate font-nunito text-sm font-medium text-marca-oscuro/70">
                  {cita.motivo}
                </p>
                <p className="flex items-center gap-1.5 truncate font-nunito text-xs font-semibold text-marca-oscuro/60">
                  <CalendarDays size={13} className="shrink-0" />
                  {formatearFecha(cita.fecha)} · {obtenerNombreMedico(cita)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleVerDetalles(cita)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marca-oscuro/5 text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
              title="Ver detalles"
            >
              <Eye size={18} />
            </button>
          </div>
        ))}
      </div>

      <Modal
        abierto={modalDetallesAbierto}
        titulo="Detalles de la Cita"
        subtitulo="Información completa del evento"
        icono={Stethoscope}
        onCerrar={() => setModalDetallesAbierto(false)}
      >
        {citaSeleccionada && (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Fecha</p>
                <p className="text-sm font-semibold text-gray-800">{formatearFecha(citaSeleccionada.fecha)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total</p>
                <p className="text-sm font-semibold text-gray-800">Q {Number(citaSeleccionada.total).toFixed(2)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase">Motivo</p>
                <p className="text-sm font-semibold text-gray-800">{citaSeleccionada.motivo}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Paciente (Mascota)</p>
                <p className="text-sm font-semibold text-gray-800">{obtenerNombreMascota(citaSeleccionada)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Médico</p>
                <p className="text-sm font-semibold text-gray-800">{obtenerNombreMedico(citaSeleccionada)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Usuario del Sistema</p>
                <p className="text-sm font-semibold text-gray-800">{obtenerNombreUsuario(citaSeleccionada)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Estado</p>
                <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700 mt-1">
                  {citaSeleccionada.estado ? "Activa" : "Anulada"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalDetallesAbierto(false);
                  navigate("/consultas");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2.5 font-nunito font-bold text-marca-oscuro transition shadow-md hover:opacity-90"
              >
                <Stethoscope size={18} />
                Iniciar Consulta
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default ProximasCitas;