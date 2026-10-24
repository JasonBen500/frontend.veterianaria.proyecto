import { Stethoscope } from "lucide-react";

interface Props {
    onClick: () => void;
}

function BotonIniciarConsulta({ onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-full bg-marca-oscuro px-6 py-2.5 font-nunito font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-marca-oscuro/90"
        >
            <Stethoscope size={18} />
            Iniciar consulta
        </button>
    );
}

export default BotonIniciarConsulta;