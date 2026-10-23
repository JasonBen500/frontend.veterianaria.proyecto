import {
  Plus,
  UserRound,
  PawPrint,
  CalendarHeart,
  Check,
  CircleCheck,
  Dog,
} from "lucide-react";
import Modal from "../components/Modal";
import PasoDueno from "../components/wizard/PasoDueno";
import PasoMascota from "../components/wizard/PasoMascota";
import PasoCita from "../components/wizard/PasoCita";
import { useRegistroWizard } from "../hooks/useRegistroWizard";

const TITULOS_PASO = ["Dueño", "Mascota", "Cita"];
const ICONOS_PASO = [UserRound, PawPrint, CalendarHeart];

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

function RegistroWizard({ abierto, onCerrar }: Props) {
  const wizard = useRegistroWizard(onCerrar);
  const { estado } = wizard;

  return (
    <Modal
      abierto={abierto}
      titulo="REGISTRO RÁPIDO"
      subtitulo={
        wizard.exito
          ? "Registro completado"
          : `Paso ${estado.paso} de 3: ${TITULOS_PASO[estado.paso - 1]}`
      }
      icono={Plus}
      onCerrar={wizard.cerrar}
    >
      {wizard.exito ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-marca-verde/40 text-marca-oscuro shadow-md">
            <CircleCheck size={44} />
          </div>
          <h2 className="font-nunito text-2xl font-extrabold text-marca-oscuro">
            ¡Registro guardado con éxito!
          </h2>
          <p className="flex items-center gap-2 font-nunito text-sm font-semibold text-marca-oscuro/60">
            <Dog size={18} />
            Un paciente más en buenas manos.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={wizard.reiniciar}
              className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <Plus size={18} />
              Registrar otro
            </button>
            <button
              type="button"
              onClick={wizard.cerrar}
              className="rounded-full border-2 border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Indicador de pasos */}
          <ol className="mb-6 flex items-center justify-center">
            {TITULOS_PASO.map((titulo, i) => {
              const numero = i + 1;
              const Icono = ICONOS_PASO[i];
              const completado = numero < estado.paso;
              const activo = numero === estado.paso;

              return (
                <li key={titulo} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition ${completado
                          ? "bg-marca-verde text-marca-oscuro"
                          : activo
                            ? "bg-marca-naranja text-marca-oscuro ring-4 ring-marca-naranja/30"
                            : "bg-white text-marca-oscuro/40"
                        }`}
                    >
                      {completado ? <Check size={22} /> : <Icono size={22} />}
                    </div>
                    <span
                      className={`font-nunito text-xs font-extrabold ${activo || completado
                          ? "text-marca-oscuro"
                          : "text-marca-oscuro/40"
                        }`}
                    >
                      {titulo}
                    </span>
                  </div>

                  {numero < TITULOS_PASO.length && (
                    <div
                      className={`mx-3 mb-5 h-1 w-12 rounded-full sm:w-20 ${completado ? "bg-marca-verde" : "bg-marca-oscuro/10"
                        }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {wizard.error && (
            <p
              role="alert"
              className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-nunito text-sm font-semibold text-red-700"
            >
              {wizard.error}
            </p>
          )}

          {wizard.guardando && (
            <p className="mb-4 flex items-center justify-center gap-2 font-nunito text-sm font-bold text-marca-oscuro/60">
              <PawPrint size={16} className="animate-pulse" />
              Guardando...
            </p>
          )}

          {estado.paso === 1 && (
            <PasoDueno
              duenoInicial={estado.dueno}
              onSiguiente={wizard.avanzarDesdeDueno}
            />
          )}
          {estado.paso === 2 && (
            <PasoMascota
              idDueno={estado.dueno.idDueno ?? 0}
              duenoEsNuevo={estado.duenoEsNuevo}
              mascotaInicial={estado.mascota}
              onSiguiente={wizard.avanzarDesdeMascota}
              onAtras={wizard.volverAPaso1}
            />
          )}
          {estado.paso === 3 && (
            <PasoCita
              idMascota={estado.mascota.idMascota ?? 0}
              onGuardarSinCita={() => wizard.guardarTodo(null)}
              onAgendarCita={(cita) => wizard.guardarTodo(cita)}
              onAtras={wizard.volverAPaso2}
            />
          )}
        </div>
      )}
    </Modal>
  );
}

export default RegistroWizard;
