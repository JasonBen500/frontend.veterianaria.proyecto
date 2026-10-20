import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ElementType } from "react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4  backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-labelledbyy={idSubtitulo}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-marca-beigeclaro2 p-6 shadow-2xl"
      >
     <div className="-mt-6 -mx-6 mb-6 p-6 flex items-start justify-between gap-4 bg-marca-naranja rounded-t-xl">

        <div className="flex items-center gap-3">
  
          {Icono && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-marca-oscuro/10 text-marca-oscuro">
              <Icono size={50} />
            </div>
          )}

          <div className="flex flex-col">
            <h2
              id={idTitulo}
              className="font-nunito text-2xl font-black text-marca-oscuro"
            >
              {titulo}
            </h2>
            
            {subtitulo && (
              <h2
                id={idSubtitulo} 
                className="font-nunito text-sm font-bold text-marca-oscuro mt-1"
              >
                {subtitulo}
              </h2>
            )}
          </div>
        </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-2 text-marca-oscuro transition-colors hover:bg-marca-oscuro/10"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;