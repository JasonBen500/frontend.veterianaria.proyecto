import { Link } from "react-router-dom";
import {
  Syringe,
  UserPlus,
  FileUser,
  Stethoscope,
  Settings,
  PawPrint,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import EncabezadoPagina from "../components/EncabezadoPagina";

interface Opcion {
  to: string;
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  color: string;
  soloAdmin?: boolean;
}

const OPCIONES: Opcion[] = [
  {
    to: "/tratamientos",
    titulo: "Tratamientos",
    descripcion: "Gestiona el catálogo de servicios y precios",
    icono: Syringe,
    color: "bg-marca-naranja/30",
  },
  {
    to: "/perfiles",
    titulo: "Perfiles",
    descripcion: "Administra roles y permisos del sistema",
    icono: UserPlus,
    color: "bg-marca-verde/40",
    soloAdmin: true,
  },
  {
    to: "/usuarios",
    titulo: "Usuarios",
    descripcion: "Control de cuentas de acceso al sistema",
    icono: FileUser,
    color: "bg-marca-coral/25",
    soloAdmin: true,
  },
  {
    to: "/medicos",
    titulo: "Médicos",
    descripcion: "Registro del personal veterinario",
    icono: Stethoscope,
    color: "bg-marca-beige-verde-claro",
  },
];

function Administracion() {
  const { esAdmin } = useAuth();
  const visibles = OPCIONES.filter((o) => !o.soloAdmin || esAdmin);

  return (
    <div className="mx-auto mb-4 max-w-6xl p-6">
      <EncabezadoPagina
        titulo="Administración"
        ruta="/administracion"
        icono={Settings}
      />

      {/* MENÚ DE TARJETAS INTERACTIVAS */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {visibles.map(({ to, titulo, descripcion, icono: Icono, color }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15 transition-all duration-300 hover:-translate-y-1"
          >
            <PawPrint
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -right-4 h-28 w-28 -rotate-12 text-marca-oscuro/5 transition group-hover:rotate-0"
            />

            <div
              className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-marca-oscuro shadow-sm transition-colors duration-300 group-hover:bg-marca-oscuro group-hover:text-white ${color}`}
            >
              <Icono size={40} strokeWidth={1.75} />
            </div>

            <div className="relative min-w-0 flex-1">
              <h2 className="font-nunito text-2xl font-extrabold uppercase tracking-wide text-marca-oscuro">
                {titulo}
              </h2>
              <p className="mt-1 font-nunito text-sm font-semibold text-marca-oscuro/60">
                {descripcion}
              </p>
            </div>

            <ArrowRight
              size={22}
              className="relative shrink-0 text-marca-oscuro/40 transition group-hover:translate-x-1 group-hover:text-marca-oscuro"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Administracion;