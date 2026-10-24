import {
  House,
  Users,
  PawPrint,
  CalendarDays,
  ChartColumn,
  Pill,
  Settings,
  History,
  Syringe,
  Stethoscope,
  ShieldCheck,
  UserCog,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  to: string;
  label: string;
  icon: LucideIcon;
  soloAdmin?: boolean; // solo lo ve el perfil administrador
  hijos?: MenuItem[]; // submenú desplegable
}

export interface SeccionMenu {
  titulo: string;
  items: MenuItem[];
}

export const secciones: SeccionMenu[] = [
  {
    titulo: "General",
    items: [
      { to: "/", label: "Página principal", icon: House },
      { to: "/duenos", label: "Dueños", icon: Users },
      { to: "/mascotas", label: "Mascotas", icon: PawPrint },
      { to: "/citas", label: "Citas", icon: CalendarDays },
      { to: "/consultas", label: "Historial de Consultas", icon: History },
      { to: "/historial", label: "Historial de Movimientos", icon: Activity },
    ],
  },
  {
    titulo: "Gestión",
    items: [
      { to: "/reportes", label: "Reportes", icon: ChartColumn },
      { to: "/medicamentos", label: "Medicamentos", icon: Pill },
      {
        to: "/administracion",
        label: "Administración",
        icon: Settings,
        hijos: [
          { to: "/tratamientos", label: "Tratamientos", icon: Syringe },
          { to: "/medicos", label: "Médicos", icon: Stethoscope },
          { to: "/perfiles", label: "Perfiles", icon: ShieldCheck, soloAdmin: true },
          { to: "/usuarios", label: "Usuarios", icon: UserCog, soloAdmin: true },
        ],
      },
    ],
  },
];
