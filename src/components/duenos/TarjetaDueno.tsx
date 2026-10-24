import {
  CalendarClock,
  CalendarX,
  MapPin,
  PawPrint,
  Phone,
  Users,
} from "lucide-react";
import AccionesFila from "../AccionesFilas";
import type { Dueno } from "../../types/dueno";
import type { Mascota } from "../../types/mascota";
import type { Cita } from "../../types/cita";
import { formatearFechaHora } from "../../utils/fechas";

interface Props {
  dueno: Dueno;
  mascotas: Mascota[];
  proximaCita: Cita | null;
  onVerDetalles: () => void;
  onEditar: () => void;
  onAnular: () => void;
}

const MAX_MASCOTAS_VISIBLES = 3;

// Tarjeta de un dueño: contacto, sus mascotas y su próxima cita
function TarjetaDueno({
  dueno,
  mascotas,
  proximaCita,
  onVerDetalles,
  onEditar,
  onAnular,
}: Props) {
  const ocultas = mascotas.length - MAX_MASCOTAS_VISIBLES;

  return (
    <article className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-1">
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 -right-4 h-24 w-24 -rotate-12 text-marca-oscuro/5 transition group-hover:rotate-0"
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-marca-naranja/30 text-marca-oscuro shadow-sm">
          <Users size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-nunito text-lg font-extrabold text-marca-oscuro">
            {dueno.nombre} {dueno.apellido}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 truncate font-nunito text-sm font-semibold text-marca-oscuro/70">
            <Phone size={14} className="shrink-0" />
            {dueno.telefono || "Sin teléfono"}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate font-nunito text-xs font-semibold text-marca-oscuro/60">
            <MapPin size={13} className="shrink-0" />
            {dueno.direccion || "Sin dirección"}
          </p>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-2">
        {mascotas.length === 0 ? (
          <span className="font-nunito text-xs font-bold text-marca-oscuro/50">
            Sin mascotas registradas
          </span>
        ) : (
          <>
            {mascotas.slice(0, MAX_MASCOTAS_VISIBLES).map((m) => (
              <span
                key={m.idMascota}
                className="inline-flex items-center gap-1 rounded-full bg-marca-verde/30 px-3 py-1 font-nunito text-xs font-extrabold text-marca-oscuro"
              >
                <PawPrint size={12} />
                {m.nombre}
              </span>
            ))}
            {ocultas > 0 && (
              <span className="font-nunito text-xs font-bold text-marca-oscuro/60">
                +{ocultas} más
              </span>
            )}
          </>
        )}
      </div>

      <div
        className={`relative rounded-2xl p-3 ${
          proximaCita ? "bg-marca-naranja/20" : "bg-white/60"
        }`}
      >
        {proximaCita ? (
          <>
            <p className="flex items-center gap-1.5 font-nunito text-xs font-extrabold uppercase text-marca-oscuro/70">
              <CalendarClock size={14} />
              Próxima cita
            </p>
            <p className="mt-1 font-nunito text-sm font-extrabold text-marca-oscuro">
              {formatearFechaHora(proximaCita.fecha)}
            </p>
            <p className="font-nunito text-xs font-semibold text-marca-oscuro/70">
              {proximaCita.nombreMascota ?? "Mascota"} · {proximaCita.motivo}
              {proximaCita.nombreMedico ? ` · ${proximaCita.nombreMedico}` : ""}
            </p>
          </>
        ) : (
          <p className="flex items-center gap-1.5 font-nunito text-sm font-bold text-marca-oscuro/50">
            <CalendarX size={16} />
            Sin citas próximas
          </p>
        )}
      </div>

      <div className="relative flex justify-end border-t border-marca-oscuro/10 pt-3">
        <AccionesFila
          onVerDetalles={onVerDetalles}
          onEditar={onEditar}
          onAnular={onAnular}
        />
      </div>
    </article>
  );
}

export default TarjetaDueno;
