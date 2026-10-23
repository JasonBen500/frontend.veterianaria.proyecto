import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, PawPrint, Bone } from "lucide-react";
import type { ElementType } from "react";
import logoazul from "../assets/images/LogoAzul.png";

interface Props {
  abierto: boolean;
  titulo: string;
  subtitulo: string;
  icono?: ElementType;
  onCerrar: () => void;
  children: ReactNode;
}

function Modal({ abierto, titulo, subtitulo, icono: Icono, onCerrar, children }: Props) {
  const idTitulo = useId();
  const idSubtitulo = useId();

  useEffect(() => {
    if (!abierto) return;

    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alPresionar);

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-marca-azulmarino/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${idTitulo} ${idSubtitulo}`}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 shadow-2xl shadow-marca-azulmarino/40"
      >
        {/* Encabezado */}
        <div className="relative flex shrink-0 items-center justify-between gap-4 overflow-hidden bg-marca-oscuro p-6">
          <PawPrint
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-6 h-32 w-32 rotate-12 text-white/5"
          />
          <Bone
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 left-1/2 h-14 w-14 -rotate-12 text-white/5"
          />

          <div className="relative flex min-w-0 items-center gap-4">
            {Icono && (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-marca-naranja text-marca-oscuro shadow-md">
                <Icono size={28} />
              </div>
            )}

            <div className="min-w-0">
              <h2
                id={idTitulo}
                className="truncate font-nunito text-2xl font-black text-white"
              >
                {titulo}
              </h2>

              {subtitulo && (
                <p
                  id={idSubtitulo}
                  className="mt-0.5 font-nunito text-sm font-bold text-marca-beigeclaro"
                >
                  {subtitulo}
                </p>
              )}
            </div>
          </div>

          <div className="relative flex shrink-0 items-center gap-3">
            <div className="hidden rounded-2xl bg-marca-beigeclaro2 p-2 shadow-md sm:block">
              <img
                src={logoazul}
                alt="Logo de la clínica"
                className="w-14"
              />
            </div>

            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="rounded-full p-2 text-white transition-colors hover:bg-white/15"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;