import { Link } from "react-router-dom";
import type { Cita } from "../../types/cita";
import { formatearFecha, hoyTexto, soloFecha } from "../../utiils/fechas";

interface Props {
  citas: Cita[];
  cargando: boolean;
  error: boolean;
}

function ProximasCitas({ citas, cargando, error }: Props) {
  const hoy = hoyTexto();

  const proximas = citas
    .filter((c) => soloFecha(c.fecha) >= hoy)
    .sort((a, b) => soloFecha(a.fecha).localeCompare(soloFecha(b.fecha)))
    .slice(0, 3);

  return (
    <section>
      <h2 className="mb-3 mt-1 font-nunito text-lg font-extrabold text-marca-oscuro">
        Próximas Citas
      </h2>

      {cargando && (
        <p className="font-nunito text-sm text-marca-oscuro/60">Cargando…</p>
      )}

      {error && (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          No se pudieron cargar las citas.
        </p>
      )}

      {!cargando && !error && proximas.length === 0 && (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          No hay citas próximas.
        </p>
      )}

      <div className="space-y-3">
        {proximas.map((cita) => (
          <div
            key={cita.idCita}
            className="flex items-center justify-between gap-3 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-4 shadow-sm"
          >
            <div className="min-w-0 space-y-0.5">
              <p className="truncate font-nunito text-base font-semibold text-marca-oscuro">
                {cita.nombreMascota ?? "Sin mascota"}
              </p>
              <p className="truncate font-nunito text-sm font-medium text-marca-oscuro/60">
                {cita.motivo}
              </p>
              <p className="truncate font-nunito text-xs font-semibold text-marca-oscuro/60">
                {formatearFecha(cita.fecha)} · {cita.nombreMedico ?? "—"}
              </p>
            </div>
            <Link
              to="/citas"
              className="shrink-0 rounded-full border border-marca-oscuro px-3 py-1 font-nunito text-sm font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              Detalles
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProximasCitas;