import { useCallback, useState } from "react";
import { Activity } from "lucide-react";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraBusqueda from "../components/BarraBusqueda";
import FiltrosTabla from "../components/FiltrosTabla";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import { useLista } from "../hooks/useLista";
import { useFiltros } from "../hooks/useFiltros";
import { listarHistorial } from "../services/historialService";
import { filtrarPorTexto } from "../utils/busqueda";
import type { Historial } from "../types/historial";
import { fechaHora } from "../utils/fechas";

const COLOR_ACCION: Record<string, string> = {
  CREAR: "bg-green-100 text-green-800",
  MODIFICAR: "bg-amber-100 text-amber-800",
  ANULAR: "bg-red-100 text-red-800",
  ELIMINAR: "bg-red-100 text-red-800",
  CONSULTA: "bg-blue-100 text-blue-800",
};

function HistorialPage() {
  const listar = useCallback(() => listarHistorial(), []);
  const movimientos = useLista<Historial>(listar);

  const [busqueda, setBusqueda] = useState("");

  const filtros = useFiltros(movimientos, [
    {
      tipo: "select",
      id: "accion",
      etiqueta: "Acción",
      opciones: ["CREAR", "MODIFICAR", "ANULAR", "ELIMINAR", "CONSULTA"],
      valor: (m) => m.accion,
    },
    { tipo: "select", id: "modulo", etiqueta: "Módulo", valor: (m) => m.entidad },
    { tipo: "select", id: "usuario", etiqueta: "Usuario", valor: (m) => m.usuario },
    { tipo: "fecha", id: "fecha", etiqueta: "Fecha del movimiento", valor: (m) => m.fecha },
  ]);

  const filtrados = filtrarPorTexto(filtros.filtrados, busqueda);

  const columnas: ColumnaTabla<Historial>[] = [
    { encabezado: "Fecha", valor: (m) => fechaHora(m.fecha) },
    { encabezado: "Usuario", valor: (m) => m.usuario ?? "—" },
    {
      encabezado: "Acción",
      valor: (m) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${COLOR_ACCION[m.accion] ?? "bg-gray-100 text-gray-800"}`}
        >
          {m.accion}
        </span>
      ),
    },
    { encabezado: "Módulo", valor: (m) => m.entidad },
    { encabezado: "Detalle", valor: (m) => m.descripcion },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina
        titulo="Historial de Movimientos"
        ruta="/historial"
        icono={Activity}
      />

      <div className="mb-6 mt-6 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15">
        <BarraBusqueda
          valor={busqueda}
          onCambiar={setBusqueda}
          placeholder="Buscar en el historial..."
        />
      </div>

      <FiltrosTabla estado={filtros} />

      <TablaDatos
        columnas={columnas}
        datos={filtrados}
        claveFila={(m) => m.idHistorial}
      />
    </div>
  );
}

export default HistorialPage;
