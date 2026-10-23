import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Cita } from "../../types/cita";
import type { Consulta } from "../../types/consulta";
import { resumenSemana } from "../../utils/estadisticas";

interface Props {
  citas: Cita[];
  consultas: Consulta[];
  cargando: boolean;
  error: boolean;
}

const COLOR_ATENDIDAS = "#83b8aa"; // marca-verde
const COLOR_PENDIENTES = "#ff6a5a"; // marca-coral

function GraficaAtendidasSemana({ citas, consultas, cargando, error }: Props) {
  const { atendidas, pendientes, total } = resumenSemana(citas, consultas);

  // El segundo porcentaje se calcula restando, para que siempre sumen 100
  const pctAtendidas = total === 0 ? 0 : Math.round((atendidas / total) * 100);
  const pctPendientes = total === 0 ? 0 : 100 - pctAtendidas;

  const filas = [
    { nombre: "Atendidas", valor: atendidas, pct: pctAtendidas, color: COLOR_ATENDIDAS },
    { nombre: "Pendientes", valor: pendientes, pct: pctPendientes, color: COLOR_PENDIENTES },
  ];

  // Solo las porciones que tienen citas
  const datosPie = filas
    .filter((f) => f.valor > 0)
    .map((f) => ({ name: f.nombre, value: f.valor, fill: f.color }));

  return (
    <div>
      <p className="mb-2 font-nunito text-sm font-semibold text-marca-oscuro/60">
        Atendidas y pendientes · esta semana
      </p>

      {cargando && (
        <p className="font-nunito text-sm text-marca-oscuro/60">Cargando…</p>
      )}

      {error && (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          No se pudieron cargar las citas.
        </p>
      )}

      {!cargando && !error && total === 0 && (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          No hay citas esta semana.
        </p>
      )}

      {!cargando && !error && total > 0 && (
        <div className="flex flex-wrap items-center gap-6">
          {/* Dona con el total al centro */}
          <div className="relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="65%"
                  outerRadius="100%"
                  stroke="none"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-nunito text-3xl font-extrabold text-marca-oscuro">
                {total}
              </span>
              <span className="font-nunito text-xs font-semibold text-marca-oscuro/60">
                {total === 1 ? "cita" : "citas"}
              </span>
            </div>
          </div>

          {/* Resumen */}
          <ul className="space-y-2 font-nunito text-sm text-marca-oscuro">
            {filas.map((f) => (
              <li key={f.nombre} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: f.color }}
                />
                <span className="font-semibold">{f.nombre}:</span>
                <span>
                  {f.valor} ({f.pct}%)
                </span>
              </li>
            ))}
            <li className="border-t border-marca-oscuro/10 pt-2 font-semibold">
              Total de la semana: {total}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default GraficaAtendidasSemana;