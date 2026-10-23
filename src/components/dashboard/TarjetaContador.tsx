import { PawPrint, type LucideIcon } from "lucide-react";

interface Props {
  titulo: string;
  valor: number | string;
  icono: LucideIcon;
  colorIcono: string;
}

function TarjetaContador({ titulo, valor, icono: Icono, colorIcono }: Props) {
  return (
    <div className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-1">
      {/* Huella decorativa */}
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -right-3 h-20 w-20 -rotate-12 text-marca-oscuro/5 transition group-hover:rotate-0"
      />

      <div
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${colorIcono}`}
      >
        <Icono size={26} />
      </div>

      <div className="relative min-w-0">
        <p className="truncate font-nunito text-sm font-bold uppercase tracking-wide text-marca-oscuro/60">
          {titulo}
        </p>
        <p className="font-nunito text-4xl font-extrabold leading-tight text-marca-oscuro">
          {valor}
        </p>
      </div>
    </div>
  );
}

export default TarjetaContador;