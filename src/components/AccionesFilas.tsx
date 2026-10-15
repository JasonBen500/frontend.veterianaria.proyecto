import { Pencil, Ban, Trash2 } from "lucide-react";

interface Props {
  onEditar: () => void;
  onAnular: () => void;
  onEliminar?: () => void;
}

const base = "rounded-lg p-2 transition-colors";

function AccionesFila({ onEditar, onAnular, onEliminar }: Props) {
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={onEditar}
        title="Editar"
        aria-label="Editar"
        className={`${base} text-marca-oscuro/70 hover:bg-marca-oscuro/10 hover:text-marca-oscuro`}
      >
        <Pencil size={18} />
      </button>

      <button
        type="button"
        onClick={onAnular}
        title="Anular"
        aria-label="Anular"
        className={`${base} text-marca-naranja hover:bg-marca-naranja/20`}
      >
        <Ban size={18} />
      </button>

      {onEliminar && (
        <button
          type="button"
          onClick={onEliminar}
          title="Eliminar"
          aria-label="Eliminar"
          className={`${base} text-marca-vino hover:bg-marca-vino/15`}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}

export default AccionesFila;