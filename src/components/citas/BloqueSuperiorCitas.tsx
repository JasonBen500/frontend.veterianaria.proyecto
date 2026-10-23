import {
  CircleCheck,
  Clock,
  Plus,
  Stethoscope,
  PawPrint,
  Download,
} from "lucide-react";
import TarjetaContador from "../dashboard/TarjetaContador";
import BotonesExportar from "../BotonesExportar";
import BarraBusqueda from "../BarraBusqueda";
import { reporteCitas } from "../../utils/reportes";
import type { Cita } from "../../types/cita";

interface Props {
  citas: Cita[];
  atendidas: string | number;
  pendientes: string | number;
  busqueda: string;
  onBuscar: (texto: string) => void;
  onIniciarConsulta: () => void;
  onAgendar: () => void;
}

// Contadores + título del listado + exportar + búsqueda + botones de acción
function BloqueSuperiorCitas({
  citas,
  atendidas,
  pendientes,
  busqueda,
  onBuscar,
  onIniciarConsulta,
  onAgendar,
}: Props) {
  return (
    <div className="mb-6 mt-6 flex flex-col items-stretch gap-6 lg:flex-row">
      <div className="flex w-full min-w-[240px] flex-col gap-4 sm:flex-row lg:w-1/4 lg:flex-col">
        <TarjetaContador
          titulo="Citas atendidas"
          valor={atendidas}
          icono={CircleCheck}
          colorIcono="bg-marca-verde/40 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas pendientes"
          valor={pendientes}
          icono={Clock}
          colorIcono="bg-marca-coral/25 text-marca-oscuro"
        />
      </div>

      <div className="relative flex flex-1 flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15">
        <PawPrint
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-5 h-24 w-24 rotate-12 text-marca-oscuro/5"
        />

        <div className="relative flex flex-col justify-between gap-4 border-b-2 border-marca-oscuro/10 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-naranja/30 text-marca-oscuro">
              <Stethoscope size={20} />
            </div>
            <h2 className="font-nunito text-2xl font-extrabold text-marca-oscuro">
              Listado de Citas
            </h2>
          </div>
          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <span className="hidden items-center gap-1.5 font-nunito text-sm font-bold text-marca-cafenigga sm:flex">
              <Download size={16} />
              Exportar:
            </span>
            <BotonesExportar {...reporteCitas} datos={citas} />
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-between gap-4 xl:flex-row">
          <div className="w-full xl:w-80">
            <BarraBusqueda
              valor={busqueda}
              onCambiar={onBuscar}
              placeholder="Buscar por mascota, médico, motivo o fecha..."
            />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <button
              type="button"
              onClick={onIniciarConsulta}
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-marca-oscuro px-5 py-2.5 font-nunito font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-marca-oscuro/90 sm:w-auto"
            >
              <Stethoscope size={18} />
              Iniciar Consulta
            </button>
            <button
              type="button"
              onClick={onAgendar}
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-marca-naranja px-5 py-2.5 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
            >
              <Plus size={18} />
              Agendar Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloqueSuperiorCitas;