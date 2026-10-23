import { Ban, CircleCheck, PawPrint, type LucideIcon } from "lucide-react";
import type { FiltroEstado } from "../../utils/estados";

const OPCIONES: { valor: FiltroEstado; etiqueta: string; icono: LucideIcon }[] =
  [
    { valor: "activos", etiqueta: "Activos", icono: CircleCheck },
    { valor: "inactivos", etiqueta: "Inactivos", icono: Ban },
    { valor: "todos", etiqueta: "Todos", icono: PawPrint },
  ];

interface Props {
  valor: FiltroEstado;
  onCambiar: (valor: FiltroEstado) => void;
}

// Botones "Activos / Inactivos / Todos"
function SelectorEstado({ valor, onCambiar }: Props) {
  return (
    <div
      role="group"
      aria-label="Filtrar por estado"
      className="inline-flex flex-wrap gap-1 rounded-full border border-marca-cafenigga/30 bg-marca-beigeclaro2 p-1 shadow-sm"
    >
      {OPCIONES.map(({ valor: opcion, etiqueta, icono: Icono }) => {
        const activo = valor === opcion;

        return (
          <button
            key={opcion}
            type="button"
            aria-pressed={activo}
            onClick={() => onCambiar(opcion)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-nunito text-sm font-extrabold transition ${activo
                ? "bg-marca-oscuro text-white shadow-md"
                : "text-marca-oscuro hover:bg-marca-naranja/30"
              }`}
          >
            <Icono size={16} />
            {etiqueta}
          </button>
        );
      })}
    </div>
  );
}

export default SelectorEstado;