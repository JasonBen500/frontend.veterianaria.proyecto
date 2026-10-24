import { useState } from "react";
import { ListFilter, X } from "lucide-react";
import type { EstadoFiltros, Filtro } from "../hooks/useFiltros";

const CLASE_CAMPO =
  "w-full rounded-xl border border-marca-cafenigga/30 bg-white px-3 py-2 font-nunito text-sm font-semibold text-marca-oscuro shadow-sm focus:border-marca-naranja focus:outline-none focus:ring-2 focus:ring-marca-naranja";

function opcionesDe<T>(estado: EstadoFiltros<T>, filtro: Filtro<T>): string[] {
  if (filtro.tipo !== "select") return [];
  if (filtro.opciones) return filtro.opciones;
  const unicos = new Set<string>();
  for (const fila of estado.datos) {
    const valor = filtro.valor(fila);
    for (const v of Array.isArray(valor) ? valor : [valor]) {
      if (v) unicos.add(v);
    }
  }
  return [...unicos].sort((a, b) => a.localeCompare(b, "es"));
}

interface Props<T> {
  estado: EstadoFiltros<T>;
}

// Panel desplegable de filtros para listados y tablas
function FiltrosTabla<T>({ estado }: Props<T>) {
  const [abierto, setAbierto] = useState(false);
  const { filtros, valores, setValor, limpiar, activos, datos, filtrados } = estado;

  return (
    <div className="mb-6 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-4 shadow-lg shadow-marca-cafenigga/15">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setAbierto((prev) => !prev)}
          aria-expanded={abierto}
          className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-4 py-1.5 font-nunito text-sm font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
        >
          <ListFilter size={16} />
          Filtros
          {activos > 0 && (
            <span className="rounded-full bg-marca-naranja px-2 text-xs font-extrabold text-marca-oscuro">
              {activos}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 font-nunito text-sm font-bold text-marca-oscuro/70">
          <span>
            Mostrando {filtrados.length} de {datos.length}
          </span>
          {activos > 0 && (
            <button
              type="button"
              onClick={limpiar}
              className="inline-flex items-center gap-1 text-marca-vino hover:underline"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {abierto && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtros.map((f) => (
            <div key={f.id} className={f.tipo === "select" ? "" : "sm:col-span-2"}>
              <label className="mb-1 block font-nunito text-xs font-extrabold uppercase tracking-wide text-marca-oscuro/70">
                {f.etiqueta}
              </label>

              {f.tipo === "select" ? (
                <select
                  value={valores[f.id] ?? ""}
                  onChange={(e) => setValor(f.id, e.target.value)}
                  className={CLASE_CAMPO}
                >
                  <option value="">Todos</option>
                  {opcionesDe(estado, f).map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type={f.tipo === "fecha" ? "date" : "number"}
                    min={f.tipo === "numero" ? 0 : undefined}
                    placeholder="Desde"
                    aria-label={`${f.etiqueta} desde`}
                    value={valores[`${f.id}:desde`] ?? ""}
                    onChange={(e) => setValor(`${f.id}:desde`, e.target.value)}
                    className={CLASE_CAMPO}
                  />
                  <span className="font-nunito text-sm font-bold text-marca-oscuro/50">
                    a
                  </span>
                  <input
                    type={f.tipo === "fecha" ? "date" : "number"}
                    min={f.tipo === "numero" ? 0 : undefined}
                    placeholder="Hasta"
                    aria-label={`${f.etiqueta} hasta`}
                    value={valores[`${f.id}:hasta`] ?? ""}
                    onChange={(e) => setValor(`${f.id}:hasta`, e.target.value)}
                    className={CLASE_CAMPO}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FiltrosTabla;
