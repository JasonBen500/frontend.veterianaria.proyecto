import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Cita } from "../../types/cita";
import {
  NOMBRES_MESES,
  formatearFecha,
  hoyTexto,
  soloFecha,
} from "../../utiils/fechas";

interface Props {
  citas: Cita[];
}

const DIAS_SEMANA = ["D", "L", "M", "M", "J", "V", "S"];

const dosDigitos = (n: number) => String(n).padStart(2, "0");

function Calendario({ citas }: Props) {
  const hoy = hoyTexto();
  const [anio, setAnio] = useState(() => Number(hoy.slice(0, 4)));
  const [mes, setMes] = useState(() => Number(hoy.slice(5, 7)) - 1); // 0 a 11
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

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
    <section className="min-h-80 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">
      <h2 className="mb-4 font-nunito text-lg font-extrabold text-marca-oscuro">
        Calendario
      </h2>

      {/* Mes y flechas */}
      <div className="mb-1 flex items-center justify-between">
        <button
          type="button"
          onClick={() => cambiarMes(-1)}
          aria-label="Mes anterior"
          className="rounded-lg p-1 text-marca-oscuro transition-colors hover:bg-marca-oscuro/10"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="font-nunito text-sm font-extrabold text-marca-oscuro">
          {NOMBRES_MESES[mes]} {anio}
        </p>
        <button
          type="button"
          onClick={() => cambiarMes(1)}
          aria-label="Mes siguiente"
          className="rounded-lg p-1 text-marca-oscuro transition-colors hover:bg-marca-oscuro/10"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <p className="mb-3 text-center font-nunito text-xs font-semibold text-marca-oscuro/60">
        {citasDelMes === 1
          ? "1 cita programada"
          : `${citasDelMes} citas programadas`}
      </p>

      {/* Cuadrícula */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA.map((letra, i) => (
          <span
            key={i}
            className="font-nunito text-xs font-bold text-marca-oscuro/60"
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
              className={`relative aspect-square rounded-lg font-nunito text-sm font-semibold transition-colors ${
                activo
                  ? "bg-marca-oscuro text-white"
                  : esHoy
                    ? "border-2 border-marca-oscuro text-marca-oscuro"
                    : "text-marca-oscuro hover:bg-marca-oscuro/10"
              }`}
            >
              {dia}
              {cantidad > 0 && (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-marca-azulmarino" />
              )}
            </button>
          );
        })}
      </div>

      {/* Citas del día seleccionado */}
      {seleccionado && (
        <div className="mt-4 border-t border-marca-oscuro/10 pt-3">
          <p className="mb-2 font-nunito text-xs font-extrabold text-marca-oscuro">
            {formatearFecha(seleccionado)}
          </p>
          {citasSeleccionadas.length === 0 ? (
            <p className="font-nunito text-sm text-marca-oscuro/60">
              Sin citas este día.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {citasSeleccionadas.map((cita) => (
                <li
                  key={cita.idCita}
                  className="font-nunito text-sm text-marca-oscuro"
                >
                  <span className="font-semibold">
                    {cita.nombreMascota ?? "Sin mascota"}
                  </span>{" "}
                  — {cita.motivo}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

export default Calendario;