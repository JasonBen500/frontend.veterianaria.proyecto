import { CalendarPlus, Clock } from "lucide-react";
import AccionesFila from "../AccionesFilas";
import type { Mascota } from "../../types/mascota";
import { mascotasRecientes } from "../../utils/mascotas";

interface Props {
  mascotas: Mascota[];
  onEditar: (mascota: Mascota) => void;
  onAnular: (mascota: Mascota) => void;
  onIniciarCita: (mascota: Mascota) => void;
}

// Últimas mascotas registradas, con acciones rápidas
function MascotasRecientes({ mascotas, onEditar, onAnular, onIniciarCita }: Props) {
  const recientes = mascotasRecientes(mascotas, 4);

  return (
    <section className="min-w-0 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-5 shadow-lg shadow-marca-cafenigga/15">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-coral/25 text-marca-oscuro">
          <Clock size={20} />
        </div>
        <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
          Registradas recientemente
        </h2>
      </div>

      {recientes.length === 0 ? (
        <p className="py-10 text-center font-nunito text-sm font-semibold text-marca-oscuro/60">
          Aún no hay mascotas registradas.
        </p>
      ) : (
        <ul className="space-y-3">
          {recientes.map((m) => (
            <li
              key={m.idMascota}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-nunito text-sm font-extrabold text-marca-oscuro">
                  {m.nombre}
                </p>
                <p className="truncate font-nunito text-xs font-semibold text-marca-oscuro/60">
                  {m.especie} · {m.edad} meses · {m.peso} kg
                  {m.nombreDueno ? ` · ${m.nombreDueno}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onIniciarCita(m)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-marca-oscuro px-3 py-1.5 font-nunito text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-marca-oscuro/90"
                >
                  <CalendarPlus size={14} />
                  Iniciar cita
                </button>
                <AccionesFila onEditar={() => onEditar(m)} onAnular={() => onAnular(m)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default MascotasRecientes;
