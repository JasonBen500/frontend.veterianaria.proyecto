import { Pencil, Ban, Trash2, Eye, FileText } from "lucide-react";

interface Props {
  onVerDetalles?: () => void;
  onEditar: () => void;
  onAnular: () => void;
  onEliminar?: () => void;
  onVerInforme?: () => void;
}

const base =
  "flex h-9 w-9 items-center justify-center rounded-full transition hover:-translate-y-0.5";

function AccionesFila({
  onVerDetalles,
  onVerInforme,
  onEditar,
  onAnular,
  onEliminar,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {onVerDetalles && (
        <button
          type="button"
          onClick={onVerDetalles}
          title="Ver Detalles"
          aria-label="Ver Detalles"
          className={`${base} bg-marca-azulmarino/10 text-marca-azulmarino hover:bg-marca-azulmarino hover:text-white`}
        >
          <Eye size={18} />
        </button>
      )}

      {onVerInforme && (
        <button
          type="button"
          onClick={onVerInforme}
          title="Ver Informe"
          aria-label="Ver Informe"
          className={`${base} bg-marca-verde/30 text-marca-oscuro hover:bg-marca-verde`}
        >
          <FileText size={18} />
        </button>
      )}

      <button
        type="button"
        onClick={onEditar}
        title="Editar"
        aria-label="Editar"
        className={`${base} bg-marca-oscuro/10 text-marca-oscuro hover:bg-marca-oscuro hover:text-white`}
      >
        <Pencil size={18} />
      </button>

      <button
        type="button"
        onClick={onAnular}
        title="Anular"
        aria-label="Anular"
        className={`${base} bg-marca-naranja/30 text-marca-oscuro hover:bg-marca-naranja`}
      >
        <Ban size={18} />
      </button>

      {onEliminar && (
        <button
          type="button"
          onClick={onEliminar}
          title="Eliminar"
          aria-label="Eliminar"
          className={`${base} bg-marca-vino/10 text-marca-vino hover:bg-marca-vino hover:text-white`}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}

export default AccionesFila;