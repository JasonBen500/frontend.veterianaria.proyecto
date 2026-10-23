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
  ChartColumn,
  Info,
  type LucideIcon,
} from "lucide-react";
import TarjetaReporte from "../components/reportes/TarjetaReporte";
import SelectorEstado from "../components/reportes/SelectorEstado";
import EncabezadoPagina from "../components/EncabezadoPagina";
import {
  useDatosReportes,
  type ClaveReporte,
} from "../hooks/useDatosReportes";
import type { FiltroEstado } from "../utils/estados";
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
} from "../utils/reportes";

const NOMBRES: Record<ClaveReporte, string> = {
  duenos: "Dueños",
  mascotas: "Mascotas",
  citas: "Citas",
  consultas: "Consultas",
  detalles: "Detalle de citas",
  medicamentos: "Medicamentos",
  tratamientos: "Tratamientos",
  medicos: "Médicos",
  usuarios: "Usuarios",
  perfiles: "Perfiles",
};

function Reportes() {
  const datos = useDatosReportes();
  const [filtro, setFiltro] = useState<FiltroEstado>("activos");

  const modulosConError = (Object.keys(datos.errores) as ClaveReporte[])
    .filter((clave) => datos.errores[clave])
    .map((clave) => NOMBRES[clave]);

  // Arma una tarjeta. El tipo genérico T hace que TypeScript compruebe que el
  // reporte y la lista de registros pertenecen a la misma entidad.
  const tarjeta = <T extends { estado: boolean }>(
    clave: ClaveReporte,
    icono: LucideIcon,
    reporte: DefinicionReporte<T>,
    registros: T[],
  ) => (
    <TarjetaReporte
      key={clave}
      nombre={NOMBRES[clave]}
      icono={icono}
      reporte={reporte}
      registros={registros}
      filtro={filtro}
      cargando={datos.cargando}
      error={datos.errores[clave]}
    />
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <EncabezadoPagina titulo="Reportes" ruta="/reportes" icono={ChartColumn} />

      <section className="flex flex-col gap-4 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15 md:flex-row md:items-center md:justify-between">
        <p className="flex items-start gap-2 font-nunito text-sm font-semibold text-marca-oscuro/70">
          <Info size={18} className="mt-0.5 shrink-0 text-marca-oscuro" />
          Descarga o consulta la información de cada módulo en PDF o Excel.
          Elige si quieres incluir los registros activos, los inactivos
          (anulados) o todos.
        </p>
        <SelectorEstado valor={filtro} onCambiar={setFiltro} />
      </section>

      {modulosConError.length > 0 && (
        <p className="rounded-2xl border border-marca-vino/20 bg-white p-4 font-nunito text-sm font-semibold text-marca-oscuro shadow-sm">
          No se pudieron cargar estos módulos: {modulosConError.join(", ")}. Los
          demás reportes siguen disponibles.
        </p>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tarjeta("duenos", Users, reporteDuenos, datos.duenos)}
        {tarjeta("mascotas", PawPrint, reporteMascotas, datos.mascotas)}
        {tarjeta("citas", CalendarDays, reporteCitas, datos.citas)}
        {tarjeta("consultas", ClipboardList, reporteConsultas, datos.consultas)}
        {tarjeta("detalles", ListChecks, reporteDetalleCitas, datos.detalles)}
        {tarjeta("medicamentos", Pill, reporteMedicamentos, datos.medicamentos)}
        {tarjeta("tratamientos", Syringe, reporteTratamientos, datos.tratamientos)}
        {tarjeta("medicos", Stethoscope, reporteMedicos, datos.medicos)}
        {tarjeta("usuarios", UserRound, reporteUsuarios, datos.usuarios)}
        {tarjeta("perfiles", ShieldCheck, reportePerfiles, datos.perfiles)}
      </section>
    </div>
  );
}

export default Reportes;
