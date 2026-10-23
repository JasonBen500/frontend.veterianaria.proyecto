import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, ChevronUp, Stethoscope, CalendarDays } from "lucide-react";
import type { Cita } from "../../types/cita";
import type { Mascota } from "../../types/mascota";
import type { Medico } from "../../types/medico";
import type { Usuarios } from "../../types/usuarios";
import {
  NOMBRES_MESES,
  formatearFecha,
  hoyTexto,
  soloFecha,
} from "../../utils/fechas";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import { listarMascotasActivas } from "../../services/mascotaService";
import { listarMedicosActivos } from "../../services/medicoService";
import { listarUsuariosActivos } from "../../services/usuariosService";

interface Props {
  citas: Cita[];
}

const DIAS_SEMANA = ["D", "L", "M", "M", "J", "V", "S"];
const dosDigitos = (n: number) => String(n).padStart(2, "0");

function Calendario({ citas }: Props) {
  const hoy = hoyTexto();
  const navigate = useNavigate();
  const [anio, setAnio] = useState(() => Number(hoy.slice(0, 4)));
  const [mes, setMes] = useState(() => Number(hoy.slice(5, 7)) - 1); // 0 a 11
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  // Estados para el modal de detalles
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  // Catálogos para cruzar nombres por ID
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
        console.error("Error al cargar catálogos en el calendario", err);
      }
    };
    cargarCatalogos();
  }, []);

  const handleVerDetalles = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setModalDetallesAbierto(true);
  };

  // Funciones auxiliares para obtener nombres reales
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

  // Agrupa las citas por día: "2026-10-20" -> [cita, cita, ...]
  const citasPorDia = useMemo(() => {
    const mapa = new Map<string, Cita[]>();
    for (const cita of citas) {
      const dia = soloFecha(cita.fecha);
      mapa.set(dia, [...(mapa.get(dia) ?? []), cita]);
    }
    return mapa;
  }, [citas]);

  const primerDiaSemana = new Date(anio, mes, 1).getDay(); // 0 = domingo
  const diasDelMes = new Date(anio, mes + 1, 0).getDate();

  const celdas: (number | null)[] = [
    ...Array.from({ length: primerDiaSemana }, () => null),
    ...Array.from({ length: diasDelMes }, (_, i) => i + 1),
  ];

  const prefijoMes = `${anio}-${dosDigitos(mes + 1)}`;
  const citasDelMes = citas.filter((c) =>
    soloFecha(c.fecha).startsWith(prefijoMes),
  ).length;

  const cambiarMes = (cambio: number) => {
    const nuevo = new Date(anio, mes + cambio, 1);
    setAnio(nuevo.getFullYear());
    setMes(nuevo.getMonth());
    setSeleccionado(null);
  };

  const citasSeleccionadas = seleccionado
    ? (citasPorDia.get(seleccionado) ?? [])
    : [];

  return (
    <section className="h-full min-h-80 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-beige-verde-claro text-marca-oscuro">
          <CalendarDays size={20} />
        </div>
        <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
          Calendario
        </h2>
      </div>

      {/* Mes y flechas */}
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-marca-oscuro px-3 py-2 shadow-md">
        <button
          type="button"
          onClick={() => cambiarMes(-1)}
          aria-label="Mes anterior"
          className="rounded-full p-1.5 text-white transition-colors hover:bg-white/15"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="font-nunito text-sm font-extrabold text-white">
            {NOMBRES_MESES[mes]} {anio}
          </p>
          <p className="font-nunito text-xs font-semibold text-marca-beigeclaro">
            {citasDelMes === 1
              ? "1 cita programada"
              : `${citasDelMes} citas programadas`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => cambiarMes(1)}
          aria-label="Mes siguiente"
          className="rounded-full p-1.5 text-white transition-colors hover:bg-white/15"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Cuadrícula */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {DIAS_SEMANA.map((letra, i) => (
          <span
            key={i}
            className="font-nunito text-xs font-extrabold text-marca-oscuro/60"
          >
            {letra}
          </span>
        ))}

        {celdas.map((dia, i) => {
          if (dia === null) return <div key={`vacio-${i}`} />;

          const clave = `${prefijoMes}-${dosDigitos(dia)}`;
          const cantidad = citasPorDia.get(clave)?.length ?? 0;
          const esHoy = clave === hoy;
          const activo = clave === seleccionado;

          return (
            <button
              key={clave}
              type="button"
              onClick={() => setSeleccionado(activo ? null : clave)}
              title={cantidad > 0 ? `${cantidad} cita(s)` : undefined}
              className={`relative aspect-square rounded-xl font-nunito text-sm font-bold transition ${activo
                  ? "bg-marca-oscuro text-white shadow-md"
                  : esHoy
                    ? "bg-marca-naranja/40 text-marca-oscuro ring-2 ring-marca-naranja"
                    : cantidad > 0
                      ? "bg-white/70 text-marca-oscuro hover:bg-marca-verde/30"
                      : "text-marca-oscuro hover:bg-marca-oscuro/10"
                }`}
            >
              {dia}
              {cantidad > 0 && (
                <span
                  className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${activo ? "bg-marca-naranja" : "bg-marca-coral"
                    }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Citas del día seleccionado */}
      {seleccionado && (
        <div className="mt-4 border-t border-marca-oscuro/10 pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-nunito text-xs font-extrabold text-marca-oscuro">
              {formatearFecha(seleccionado)}
            </p>
            {/* Botón para subir / ocultar el panel desplegado */}
            <button
              type="button"
              onClick={() => setSeleccionado(null)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-marca-oscuro hover:bg-marca-oscuro/10 transition"
              title="Cerrar listado"
            >
              <ChevronUp size={16} /> Subir
            </button>
          </div>

          {citasSeleccionadas.length === 0 ? (
            <p className="font-nunito text-sm text-marca-oscuro/60">
              Sin citas este día.
            </p>
          ) : (
            <ul className="space-y-2">
              {citasSeleccionadas.map((cita) => (
                <li
                  key={cita.idCita}
                  className="flex items-center justify-between gap-2 rounded-xl bg-white/60 p-2 shadow-sm font-nunito text-sm text-marca-oscuro"
                >
                  <div className="min-w-0">
                    <span className="font-bold">
                      {obtenerNombreMascota(cita)}
                    </span>{" "}
                    <span className="text-marca-oscuro/70">— {cita.motivo}</span>
                  </div>

                  {/* Botón de detalles (ojo) para cada cita del día */}
                  <button
                    type="button"
                    onClick={() => handleVerDetalles(cita)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-marca-oscuro/5 text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal de Detalles de la Cita */}
      <Modal
        abierto={modalDetallesAbierto}
        titulo="Detalles de la Cita"
        subtitulo="Información completa del evento"
        icono={Stethoscope}
        onCerrar={() => setModalDetallesAbierto(false)}
      >
        {citaSeleccionada && (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-lg shadow-marca-cafenigga/15">
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

export default Calendario;