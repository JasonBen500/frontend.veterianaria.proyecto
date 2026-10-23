import type { ElementType, FormEvent, ReactNode } from "react";
import { PawPrint, Save, X } from "lucide-react";
import Modal from "../Modal";
import Mensaje from "../Mensaje";

interface Props {
  abierto: boolean;
  titulo: string;
  subtitulo: string;
  icono: ElementType;
  mensaje: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCerrar: () => void;
  claseGrid?: string;
  children: ReactNode; // los campos del formulario
}

// Modal con formulario y botones Cancelar / Guardar
function ModalFormulario({
  abierto,
  titulo,
  subtitulo,
  icono,
  mensaje,
  onSubmit,
  onCerrar,
  claseGrid = "grid-cols-1 md:grid-cols-2",
  children,
}: Props) {
  return (
    <Modal
      abierto={abierto}
      titulo={titulo}
      subtitulo={subtitulo}
      icono={icono}
      onCerrar={onCerrar}
    >
      <Mensaje texto={mensaje} />
      <form onSubmit={onSubmit} className={`grid gap-5 ${claseGrid}`}>
        {children}

        <div className="col-span-full mt-4 flex items-center justify-between gap-3 border-t border-marca-oscuro/10 pt-5">
          <span className="hidden items-center gap-2 font-nunito text-sm font-extrabold text-marca-oscuro/50 sm:flex">
            <PawPrint size={18} />
            Firolaiv Veterinaria
          </span>

          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <Save size={18} />
              Guardar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ModalFormulario;