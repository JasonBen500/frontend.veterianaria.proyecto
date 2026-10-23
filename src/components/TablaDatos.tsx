import { useState } from "react";
import type { Key, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Dog } from "lucide-react";

export interface ColumnaTabla<T> {
  encabezado: string;
  valor: (fila: T) => ReactNode;
}

interface Props<T> {
  columnas: ColumnaTabla<T>[];
  datos: T[];
  claveFila: (fila: T) => Key | null;
  acciones?: (fila: T) => ReactNode;
  filasPorPagina?: number;
}

// Estilos en un solo lugar: si quieres cambiar el aspecto de todas las tablas, es aquí
const ESTILO_TH =
  "bg-marca-oscuro px-4 py-3 font-nunito text-sm font-extrabold uppercase tracking-wide text-white";
const ESTILO_TD =
  "px-4 py-3 font-nunito text-sm font-semibold text-marca-oscuro";
const ESTILO_BOTON_PAGINA =
  "flex h-9 w-9 items-center justify-center rounded-full border border-marca-oscuro/20 bg-white text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white disabled:pointer-events-none disabled:opacity-40";

function TablaDatos<T>({
  columnas,
  datos,
  claveFila,
  acciones,
  filasPorPagina = 10,
}: Props<T>) {
  const [paginaSolicitada, setPaginaSolicitada] = useState(1);
  const [longitudPrevia, setLongitudPrevia] = useState(datos.length);
  const totalColumnas = columnas.length + (acciones ? 1 : 0);

  // Si cambia la cantidad de resultados (por ejemplo al buscar), vuelve a la página 1
  if (datos.length !== longitudPrevia) {
    setLongitudPrevia(datos.length);
    setPaginaSolicitada(1);
  }

  const totalPaginas = Math.max(1, Math.ceil(datos.length / filasPorPagina));
  const pagina = Math.min(paginaSolicitada, totalPaginas);
  const inicio = (pagina - 1) * filasPorPagina;
  const filasVisibles = datos.slice(inicio, inicio + filasPorPagina);

  return (
    <div>
      <div className="overflow-x-auto rounded-3xl border border-marca-oscuro/10 bg-white shadow-lg shadow-marca-cafenigga/15">
        <table className="w-full">
          <thead>
            <tr>
              {columnas.map((col, index) => (
                <th key={index} className={`${ESTILO_TH} text-left`}>
                  {col.encabezado}
                </th>
              ))}
              {acciones && (
                <th className={`${ESTILO_TH} text-center`}>Acciones</th>
              )}
            </tr>
          </thead>

          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan={totalColumnas} className={`${ESTILO_TD} py-10`}>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Dog size={40} className="text-marca-verde" />
                    <p className="font-bold text-marca-oscuro/60">
                      No hay registros para mostrar.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filasVisibles.map((fila, indice) => (
                <tr
                  key={claveFila(fila) ?? inicio + indice}
                  className="transition-colors odd:bg-marca-beigeclaro2 even:bg-white hover:bg-marca-verde/20"
                >
                  {columnas.map((col, index) => (
                    <td
                      key={index}
                      className={`${ESTILO_TD} border-t border-marca-oscuro/5`}
                    >
                      {col.valor(fila)}
                    </td>
                  ))}
                  {acciones && (
                    <td
                      className={`${ESTILO_TD} border-t border-marca-oscuro/5 text-center`}
                    >
                      {acciones(fila)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {datos.length > filasPorPagina && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-nunito text-sm font-bold text-marca-oscuro">
          <span>
            {inicio + 1}–{Math.min(inicio + filasPorPagina, datos.length)} de{" "}
            {datos.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaginaSolicitada(pagina - 1)}
              disabled={pagina === 1}
              className={ESTILO_BOTON_PAGINA}
              title="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <button
              type="button"
              onClick={() => setPaginaSolicitada(pagina + 1)}
              disabled={pagina === totalPaginas}
              className={ESTILO_BOTON_PAGINA}
              title="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TablaDatos;