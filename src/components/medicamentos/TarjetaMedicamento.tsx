import { useState } from "react";
import { Minus, Pill, Plus } from "lucide-react";
import AccionesFila from "../AccionesFilas";
import type { Medicamentos } from "../../types/medicamentos";

interface Props {
  medicamento: Medicamentos;
  onEditar: () => void;
  onAnular: () => void;
  onEliminar: () => void;
  onAjustarStock: (cambio: number) => Promise<void>;
}

const botonStock =
  "flex h-9 w-9 items-center justify-center rounded-full border border-marca-oscuro text-marca-oscuro transition-colors hover:bg-marca-oscuro hover:text-white disabled:pointer-events-none disabled:opacity-40";

function TarjetaMedicamento({
  medicamento,
  onEditar,
  onAnular,
  onEliminar,
  onAjustarStock,
}: Props) {
  const [ocupado, setOcupado] = useState(false);

  const ajustar = async (cambio: number) => {
    setOcupado(true);
    try {
      await onAjustarStock(cambio);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 shadow-sm">
      {/* Imagen de referencia, o un ícono si todavía no tiene */}
      <div className="relative h-40 bg-marca-naranja/25">
        {medicamento.imagen ? (
          <img
            src={medicamento.imagen}
            alt={medicamento.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-marca-oscuro/40">
            <Pill size={48} />
          </div>
        )}

        {/* Acciones en la esquina */}
        <div className="absolute right-2 top-2 rounded-full bg-white/90 px-1 shadow-sm">
          <AccionesFila
            onEditar={onEditar}
            onAnular={onAnular}
            onEliminar={onEliminar}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-nunito text-lg font-extrabold text-marca-oscuro">
            {medicamento.nombre}
          </h3>
          <p className="line-clamp-2 font-nunito text-sm font-medium text-marca-oscuro/60">
            {medicamento.descripcion || "Sin descripción"}
          </p>
        </div>

        <p className="font-nunito text-sm font-semibold text-marca-oscuro">
          Precio:{" "}
          <span className="font-extrabold">
            {Number(medicamento.precio).toFixed(2)}
          </span>
        </p>

        {/* Stock con botones de menos y más */}
        <div className="mt-auto flex items-center justify-between border-t border-marca-oscuro/10 pt-3">
          <span className="font-nunito text-sm font-semibold text-marca-oscuro/60">
            Stock
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Restar uno"
              disabled={ocupado || medicamento.stock <= 0}
              onClick={() => ajustar(-1)}
              className={botonStock}
            >
              <Minus size={16} />
            </button>
            <span className="min-w-8 text-center font-nunito text-xl font-extrabold text-marca-oscuro">
              {medicamento.stock}
            </span>
            <button
              type="button"
              aria-label="Sumar uno"
              disabled={ocupado}
              onClick={() => ajustar(1)}
              className={botonStock}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TarjetaMedicamento;