import { useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  ListChecks,
  PawPrint,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import TarjetaReporte from "../components/reportes/TarjetaReporte";
import { useDatosReportes } from "../hooks/useDatosReportes";
import type { FiltroEstado } from "../utiils/estados";
import {
  reporteCitas,
  reporteConsultas,
  reporteDetalleCitas,
  reporteDuenos,
  reporteMascotas,
  reporteMedicamentos,
  reporteMedicos,
  reportePerfiles,
  reporteTratamientos,
  reporteUsuarios,
  type DefinicionReporte,
} from "../utiils/reportes";

const OPCIONES_FILTRO: { valor: FiltroEstado; etiqueta: string }[] = [
  { valor: "activos", etiqueta: "Activos" },
  { valor: "inactivos", etiqueta: "Inactivos" },
  { valor: "todos", etiqueta: "Todos" },
];

function Reportes() {
  const datos = useDatosReportes();
  const { cargando, error } = datos;
  const [filtro, setFiltro] = useState<FiltroEstado>("activos");

  // Arma una tarjeta. El tipo genérico T hace que TypeScript compruebe que el
  // reporte y la lista de registros pertenecen a la misma entidad.
  const tarjeta = <T extends { estado: boolean }>(
    nombre: string,
    icono: LucideIcon,
    reporte: DefinicionReporte<T>,
    registros: T[],
  ) => (
    <TarjetaReporte
      key={nombre}
      nombre={nombre}
      icono={icono}
      reporte={reporte}
      registros={registros}
      filtro={filtro}
      cargando={cargando}
      error={error}
    />
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div className="border-b border-marca-oscuro/10 pb-4">
        <h1 className="font-nunito text-4xl font-extrabold text-marca-oscuro md:text-5xl">
          Reportes
        </h1>
        <p className="mt-2 font-nunito text-sm font-semibold text-marca-oscuro/60">
          Descarga o consulta la información de cada módulo en PDF o Excel.
          Elige si quieres incluir los registros activos, los inactivos
          (anulados) o todos.
        </p>
      </div>

      {/* Selector de estado */}
      <div className="inline-flex rounded-full border border-marca-oscuro/20 bg-white p-1">
        {OPCIONES_FILTRO.map(({ valor, etiqueta }) => (
          <button
            key={valor}
            type="button"
            aria-pressed={filtro === valor}
            onClick={() => setFiltro(valor)}
            className={`rounded-full px-4 py-1.5 font-nunito text-sm font-bold transition-colors ${filtro === valor
                ? "bg-marca-oscuro text-white"
                : "text-marca-oscuro hover:bg-marca-oscuro/10"
              }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-xl border border-marca-oscuro/10 bg-white p-4 font-nunito text-sm text-marca-oscuro">
          No se pudieron cargar los datos del servidor.
        </p>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tarjeta("Dueños", Users, reporteDuenos, datos.duenos)}
        {tarjeta("Mascotas", PawPrint, reporteMascotas, datos.mascotas)}
        {tarjeta("Citas", CalendarDays, reporteCitas, datos.citas)}
        {tarjeta("Consultas", ClipboardList, reporteConsultas, datos.consultas)}
        {tarjeta("Detalle de citas", ListChecks, reporteDetalleCitas, datos.detalles)}
        {tarjeta("Medicamentos", Pill, reporteMedicamentos, datos.medicamentos)}
        {tarjeta("Tratamientos", Syringe, reporteTratamientos, datos.tratamientos)}
        {tarjeta("Médicos", Stethoscope, reporteMedicos, datos.medicos)}
        {tarjeta("Usuarios", UserRound, reporteUsuarios, datos.usuarios)}
        {tarjeta("Perfiles", ShieldCheck, reportePerfiles, datos.perfiles)}
      </section>
    </div>
  );
}

export default Reportes;