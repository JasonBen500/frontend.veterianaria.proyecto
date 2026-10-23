import type { ReactNode } from "react";
import { Plus, PawPrint, Download } from "lucide-react";
import BarraBusqueda from "./BarraBusqueda";

interface Props {
  titulo: string;
  exportar: ReactNode; // normalmente <BotonesExportar ... />
  busqueda: string;
  onBuscar: (texto: string) => void;
  placeholder: string;
  textoBoton: string;
  onNuevo: () => void;
}

// Tarjeta superior del listado: título, exportar, búsqueda y botón de "Nuevo"
function BarraListado({
  titulo,
  exportar,
  busqueda,
  onBuscar,
  placeholder,
  textoBoton,
  onNuevo,
}: Props) {
  return (
    <div className="relative mb-6 mt-6 flex flex-col gap-4 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15">
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-5 h-24 w-24 rotate-12 text-marca-oscuro/5"
      />

      <div className="relative flex flex-col justify-between gap-4 border-b-2 border-marca-oscuro/10 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-verde/40 text-marca-oscuro">
            <PawPrint size={20} />
          </div>
          <h2 className="font-nunito text-2xl font-extrabold text-marca-oscuro">
            {titulo}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-3 sm:justify-end">
          <span className="hidden items-center gap-1.5 font-nunito text-sm font-bold text-marca-cafenigga sm:flex">
            <Download size={16} />
            Exportar:
          </span>
          {exportar}
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="w-full sm:w-96">
          <BarraBusqueda
            valor={busqueda}
            onCambiar={onBuscar}
            placeholder={placeholder}
          />
        </div>
        <button
          type="button"
          onClick={onNuevo}
          className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-marca-naranja px-6 py-2.5 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
        >
          <Plus size={18} />
          {textoBoton}
        </button>
      </div>
    </div>
  );
}

export default BarraListado;