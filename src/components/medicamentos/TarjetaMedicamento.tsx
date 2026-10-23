import { useState } from "react";
import { Minus, Pill, Plus, Package, TriangleAlert } from "lucide-react";
import AccionesFila from "../AccionesFilas";
import type { Medicamentos } from "../../types/medicamentos";

interface Props {
  medicamento: Medicamentos;
  onEditar: () => void;
  onAnular: () => void;
  onEliminar: () => void;
  onAjustarStock: (cambio: number) => Promise<void>;
}

// A partir de cuántas unidades se avisa "stock bajo"
const STOCK_BAJO = 4;

const botonStock =
  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-marca-oscuro bg-white text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white disabled:pointer-events-none disabled:opacity-40";

function TarjetaMedicamento({
  medicamento,
  onEditar,
  onAnular,
  onEliminar,
  onAjustarStock,
}: Props) {
  const [ocupado, setOcupado] = useState(false);

  const agotado = medicamento.stock <= 0;
  const stockBajo = !agotado && medicamento.stock <= STOCK_BAJO;

  const ajustar = async (cambio: number) => {
    setOcupado(true);
    try {
      await onAjustarStock(cambio);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-1">
      {/* Imagen de referencia, o un ícono si todavía no tiene */}
      <div className="relative h-40 bg-marca-naranja/25">
        {medicamento.imagen ? (
          <img
            src={medicamento.imagen}
            alt={medicamento.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-marca-oscuro/30">
            <Pill size={56} />
          </div>
        )}

        {/* Aviso de stock */}
        {(agotado || stockBajo) && (
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-nunito text-xs font-extrabold shadow-md ${
              agotado
                ? "bg-marca-vino text-white"
                : "bg-marca-naranja text-marca-oscuro"
            }`}
          >
            <TriangleAlert size={14} />
            {agotado ? "Agotado" : "Stock bajo"}
          </span>
        )}

        {/* Acciones en la esquina */}
        <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 shadow-md">
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

        <p className="inline-flex w-fit items-center rounded-full bg-marca-verde/30 px-3 py-1 font-nunito text-sm font-extrabold text-marca-oscuro">
          Q {Number(medicamento.precio).toFixed(2)}
        </p>

        {/* Stock con botones de menos y más */}
        <div className="mt-auto flex items-center justify-between border-t border-marca-oscuro/10 pt-3">
          <span className="flex items-center gap-1.5 font-nunito text-sm font-bold text-marca-oscuro/60">
            <Package size={16} />
            Stock
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Restar uno"
              disabled={ocupado || agotado}
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