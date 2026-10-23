import { Search, X } from "lucide-react";

interface Props {
  valor: string;
  onCambiar: (valor: string) => void;
  placeholder?: string;
}

function BarraBusqueda({ valor, onCambiar, placeholder = "Buscar..." }: Props) {
  return (
    <div className="relative w-full max-w-sm">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-marca-oscuro/50"
      />
      <input
        type="text"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-marca-cafenigga/30 bg-white py-2.5 pl-11 pr-10 font-nunito text-sm font-semibold text-marca-oscuro shadow-sm transition placeholder:text-marca-oscuro/40 focus:border-marca-naranja focus:outline-none focus:ring-2 focus:ring-marca-naranja"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onCambiar("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-marca-oscuro/50 hover:text-marca-oscuro"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default BarraBusqueda;