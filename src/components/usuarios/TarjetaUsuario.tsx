import { Mail, PawPrint, ShieldCheck, UserCog } from "lucide-react";
import AccionesFila from "../AccionesFilas";
import type { Usuarios } from "../../types/usuarios";

interface Props {
  usuario: Usuarios;
  onEditar: () => void;
  onAnular: () => void;
}

function TarjetaUsuario({ usuario, onEditar, onAnular }: Props) {
  return (
    <article className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-1">
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 -right-4 h-24 w-24 -rotate-12 text-marca-oscuro/5 transition group-hover:rotate-0"
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-marca-naranja/30 text-marca-oscuro shadow-sm">
          <UserCog size={28} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-nunito text-lg font-extrabold text-marca-oscuro">
            {usuario.nombre}
          </h3>
          <p className="truncate font-nunito text-sm font-bold text-marca-oscuro/70">
            @{usuario.usuario}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate font-nunito text-xs font-semibold text-marca-oscuro/60">
            <Mail size={13} className="shrink-0" />
            {usuario.correo}
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-marca-oscuro/10 pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-marca-verde/30 px-3 py-1 font-nunito text-xs font-extrabold text-marca-oscuro">
          <ShieldCheck size={14} />
          {usuario.nombrePerfil ?? "Sin perfil"}
        </span>

        <AccionesFila onEditar={onEditar} onAnular={onAnular} />
      </div>
    </article>
  );
}

export default TarjetaUsuario;
