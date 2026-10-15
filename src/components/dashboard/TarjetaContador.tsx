import type { LucideIcon } from "lucide-react";

interface Props {
  titulo: string;
  valor: number | string;
  icono: LucideIcon;
  colorIcono: string;
}

function TarjetaContador({ titulo, valor, icono: Icono, colorIcono }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorIcono}`}
      >
        <Icono size={24} />
      </div>
      <div>
        <p className="font-nunito text-2x1 font-bold text-marca-oscuro/60">{titulo}</p>
        <p className="font-nunito text-3xl font-extrabold text-marca-oscuro">{valor}</p>
      </div>
    </div>
  );
}

export default TarjetaContador;