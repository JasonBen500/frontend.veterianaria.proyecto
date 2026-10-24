import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PawPrint } from "lucide-react";
import type { Mascota } from "../../types/mascota";
import { especiesMasRegistradas } from "../../utils/mascotas";

interface Props {
  mascotas: Mascota[];
}

const COLOR_BARRA = "#ffb350"; // marca-naranja (recharts necesita el valor directo)

// Las 5 especies con más mascotas registradas
function GraficaEspecies({ mascotas }: Props) {
  const datos = especiesMasRegistradas(mascotas, 5);

  return (
    <section className="min-w-0 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-verde/40 text-marca-oscuro">
          <PawPrint size={20} />
        </div>
        <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
          Especies más registradas
        </h2>
      </div>

      {datos.length === 0 ? (
        <p className="py-10 text-center font-nunito text-sm font-semibold text-marca-oscuro/60">
          Aún no hay mascotas registradas.
        </p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="especie"
                width={90}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: "rgba(39, 45, 77, 0.08)" }} />
              <Bar
                dataKey="cantidad"
                name="Mascotas"
                fill={COLOR_BARRA}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default GraficaEspecies;
