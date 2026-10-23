import type { ReactNode } from "react";
import {
  Banknote,
  Bone,
  Cake,
  CalendarDays,
  CalendarHeart,
  ClipboardList,
  Dog,
  Hash,
  IdCard,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Pill,
  Stethoscope,
  Syringe,
  Tag,
  User,
  UserRound,
  Weight,
  type LucideIcon,
} from "lucide-react";
import { CLASE_LABEL } from "./estilosFormulario";

interface Props {
  etiqueta: string;
  icono?: LucideIcon;
  className?: string;
  children: ReactNode;
}

// Palabra clave de la etiqueta -> icono (se evalúa en orden)
const ICONOS_POR_ETIQUETA: [string, LucideIcon][] = [
  ["nombre", User],
  ["apellido", User],
  ["usuario", UserRound],
  ["dueno", UserRound],
  ["telefono", Phone],
  ["direccion", MapPin],
  ["correo", Mail],
  ["cedula", IdCard],
  ["especialidad", Stethoscope],
  ["medico", Stethoscope],
  ["especie", PawPrint],
  ["mascota", PawPrint],
  ["raza", Dog],
  ["edad", Cake],
  ["peso", Weight],
  ["precio", Banknote],
  ["costo", Banknote],
  ["total", Banknote],
  ["cantidad", Hash],
  ["medicamento", Pill],
  ["tratamiento", Syringe],
  ["tipo", Tag],
  ["fecha", CalendarDays],
  ["cita", CalendarHeart],
  ["motivo", ClipboardList],
  ["descripcion", ClipboardList],
];

function iconoDeEtiqueta(etiqueta: string): LucideIcon {
  const texto = etiqueta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const encontrado = ICONOS_POR_ETIQUETA.find(([clave]) => texto.includes(clave));
  return encontrado ? encontrado[1] : Bone;
}

// Etiqueta con icono + control de formulario (input, select...)
function Campo({ etiqueta, icono, className, children }: Props) {
  const Icono = icono ?? iconoDeEtiqueta(etiqueta);

  return (
    <div className={className}>
      <label className={CLASE_LABEL}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-marca-naranja/30 text-marca-oscuro">
          <Icono size={16} />
        </span>
        {etiqueta.replace(/:\s*$/, "")}
      </label>
      {children}
    </div>
  );
}

export default Campo;
