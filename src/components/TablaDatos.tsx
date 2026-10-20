import type { Key, ReactNode } from "react";

export interface ColumnaTabla<T> {
  encabezado: string;
  valor: (fila: T) => ReactNode;
}

interface Props<T> {
  columnas: ColumnaTabla<T>[];
  datos: T[];
  claveFila: (fila: T) => Key | null;
  acciones?: (fila: T) => ReactNode;
}

// Estilos en un solo lugar: si quieres cambiar el aspecto de todas las tablas, es aquí
const ESTILO_TH =
  "bg-marca-cafenigga font-nunito px-4 py-2 text-sm font-extrabold uppercase text-marca-beige-claro";
const ESTILO_TD = "font-nunito font-semibold px-4 py-2 text-sm text-gray-700";

function TablaDatos<T>({ columnas, datos, claveFila, acciones }: Props<T>) {
  const totalColumnas = columnas.length + (acciones ? 1 : 0);

  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg bg-white shadow">
      <thead>
        <tr className="border-b-4 border-marca-beigeclaro2">
          {columnas.map((col) => (
            <th
              key={col.encabezado}
              className={`${ESTILO_TH} border-r-1 border-marca-beigeclaro2 text-left`}
            >
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
            <td
              colSpan={totalColumnas}
              className={`${ESTILO_TD} py-6 text-center text-gray-500`}
            >
              No hay registros para mostrar.
            </td>
          </tr>
        ) : (
          datos.map((fila, indice) => (
            <tr
              key={claveFila(fila) ?? indice}
              className="transition-colors odd:bg-marca-beigeclaro2 even:bg-white hover:bg-gray-100"
            >
              {columnas.map((col) => (
                <td key={col.encabezado} className={`${ESTILO_TD} border-r`}>
                  {col.valor(fila)}
                </td>
              ))}
              {acciones && (
                <td className={`${ESTILO_TD} text-center`}>{acciones(fila)}</td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default TablaDatos;