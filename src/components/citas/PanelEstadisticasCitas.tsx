import Calendario from "../dashboard/Calendario";
import ProximasCitas from "../dashboard/ProximasCitas";
import GraficaAtendidasSemana from "../dashboard/GraficaAtendidasSemana";
import type { Cita } from "../../types/cita";
import type { Consulta } from "../../types/consulta";
import { ChartColumn } from "lucide-react";

interface Props {
  citas: Cita[];
  consultas: Consulta[];
  cargando: boolean;
  error: boolean;
}

function PanelEstadisticasCitas({ citas, consultas, cargando, error }: Props) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <section className="min-h-80 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15 lg:col-span-1">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-verde/40 text-marca-oscuro">
            <ChartColumn size={20} />
          </div>
          <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
            Estadísticas
          </h2>
        </div>
        <div className="space-y-8">
          <GraficaAtendidasSemana
            citas={citas}
            consultas={consultas}
            cargando={cargando}
            error={error}
          />
        </div>
      </section>
      <Calendario citas={citas} />
      <ProximasCitas citas={citas} cargando={cargando} error={error} />
    </div>
  );
}

export default PanelEstadisticasCitas;
