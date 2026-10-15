import {
  House,
  Users,
  PawPrint,
  CalendarDays,
  ChartColumn,
  Pill,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const menuItems: MenuItem[] = [
  { to: "/", label: "Página principal", icon: House },
  { to: "/duenos", label: "Dueños", icon: Users },
  { to: "/mascotas", label: "Mascotas", icon: PawPrint },
  { to: "/citas", label: "Citas", icon: CalendarDays },
  { to: "/reportes", label: "Reportes", icon: ChartColumn },
  { to: "/medicamentos", label: "Medicamentos", icon: Pill },
  { to: "/administracion", label: "Administración", icon: Settings },
];
