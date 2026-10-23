import { Link } from "react-router-dom";
import {
  HomeIcon,
  ChevronRight,
  PawPrint,
  Bone,
  Users,
  CalendarDays,
  ClipboardList,
  ListChecks,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import logazul from "../assets/images/LogoAzul.png";

interface Migas {
  texto: string;
  ruta: string;
}

interface Props {
  titulo: string;
  ruta: string;
  padres?: Migas[]; // páginas intermedias, p. ej. Administración
  icono?: LucideIcon; // si no se indica, se elige según la ruta
}

// Icono según la ruta de la página
const ICONOS_POR_RUTA: Record<string, LucideIcon> = {
  "/duenos": Users,
  "/mascotas": PawPrint,
  "/citas": CalendarDays,
  "/consultas": ClipboardList,
  "/detalle-citas": ListChecks,
  "/medicos": Stethoscope,
  "/tratamientos": Syringe,
};

const CLASE_MIGA =
  "flex items-center gap-1 font-nunito text-sm font-bold text-marca-beigeclaro transition-colors hover:text-white";

// Cabecera con título, migas de pan y logo (reutilizable en todas las páginas)
function EncabezadoPagina({ titulo, ruta, padres = [], icono }: Props) {
  const Icono = icono ?? ICONOS_POR_RUTA[ruta] ?? PawPrint;

  return (
    <div className="relative flex min-h-8 items-center justify-between gap-4 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-oscuro p-6 shadow-lg shadow-marca-cafenigga/15">
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rotate-12 text-white/5"
      />
      <Bone
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 left-1/2 h-16 w-16 -rotate-12 text-white/5"
      />

      <div className="relative flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-marca-naranja text-marca-oscuro shadow-md">
          <Icono size={28} />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate font-nunito text-2xl font-extrabold text-white md:text-4xl">
            {titulo}
          </h1>
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            <Link
              to="/"
              aria-label="Inicio"
              className="flex items-center gap-1.5 font-nunito text-sm font-bold text-marca-beigeclaro transition-colors hover:text-white"
            >
              <HomeIcon size={15} />
            </Link>
            {padres.map((padre) => (
              <Link key={padre.ruta} to={padre.ruta} className={CLASE_MIGA}>
                <ChevronRight size={15} className="text-white/40" />
                {padre.texto}
              </Link>
            ))}
            <Link to={ruta} className={CLASE_MIGA}>
              <ChevronRight size={15} className="text-white/40" />
              {titulo}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden shrink-0 rounded-2xl bg-marca-beigeclaro2 p-2 shadow-md sm:block">
        <img src={logazul} alt="Logo de la clínica" className="w-16" />
      </div>
    </div>
  );
}

export default EncabezadoPagina;