import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Cita } from "../../types/cita";
import { citasDeLaSemana } from "../../utils/estadisticas";

interface Props {
  citas: Cita[];
  cargando: boolean;
  error: boolean;
}

// Colores de tu paleta (recharts necesita el valor directo)
const COLOR_BARRA = "#ffb350"; // marca-naranja

function GraficaCitasSemana({ citas, cargando, error }: Props) {
  const datos = citasDeLaSemana(citas);
  const total = datos.reduce((suma, d) => suma + d.citas, 0);

  return (
    <div>
      <p className="mb-2 font-nunito text-sm font-semibold text-marca-oscuro/60">
        Citas por día · esta semana
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
          No hay citas programadas esta semana.
        </p>
      )}

      {!cargando && !error && total > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(39, 45, 77, 0.08)" }} />
              <Bar
                dataKey="citas"
                name="Citas"
                fill={COLOR_BARRA}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default GraficaCitasSemana;