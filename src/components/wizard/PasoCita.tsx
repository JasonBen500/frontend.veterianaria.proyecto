import { useState, useEffect, type ChangeEvent } from "react";
import { listarMedicosActivos } from "../../services/medicoService";
import type { Medico } from "../../types/medico";
import type { Cita } from "../../types/cita";
import { ArrowLeft, CalendarHeart, Check, Save } from "lucide-react";
import Campo from "../formulario/Campo";
import { CLASE_INPUT, CLASE_SELECT } from "../formulario/estilosFormulario";

interface Props {
  idMascota: number;
  onGuardarSinCita: () => void;
  onAgendarCita: (cita: Cita) => void;
  onAtras: () => void;
}

const citaVacia = (idMascota: number): Cita => ({
  idCita: null,
  fecha: "",
  motivo: "",
  total: 0,
  estado: true,
  idMascota,
  idMedico: 0,
  idUsuario: 0,
});

function PasoCita({ idMascota, onGuardarSinCita, onAgendarCita, onAtras }: Props) {
  const [quiereCita, setQuiereCita] = useState(false);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [form, setForm] = useState<Cita>(citaVacia(idMascota));

  useEffect(() => {
    listarMedicosActivos()
      .then((respuesta) => setMedicos(respuesta.data))
      .catch(() => setMedicos([]));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["total", "idMedico"].includes(name) ? Number(value) : value,
    }));
  };

  const puedeAgendar =
    form.fecha !== "" && form.motivo.trim() !== "" && form.idMedico > 0;

  if (!quiereCita) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-marca-naranja/30 text-marca-oscuro shadow-md">
          <CalendarHeart size={38} />
        </div>
        <h2 className="font-nunito text-2xl font-extrabold text-marca-oscuro">
          ¿Deseas agendar una cita ahora?
        </h2>
        <p className="font-nunito text-sm font-semibold text-marca-oscuro/60">
          Puedes guardar el registro sin cita y agendarla después.
        </p>

        <div className="mt-2 flex w-full flex-wrap justify-between gap-3 border-t border-marca-oscuro/10 pt-5">
          <button
            type="button"
            onClick={onAtras}
            className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
          >
            <ArrowLeft size={18} />
            Atrás
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onGuardarSinCita}
              className="inline-flex items-center gap-2 rounded-full bg-marca-verde px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <Save size={18} />
              Guardar sin cita
            </button>
            <button
              type="button"
              onClick={() => setQuiereCita(true)}
              className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <CalendarHeart size={18} />
              Agendar cita
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Campo etiqueta="Fecha *">
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Médico *">
          <select
            name="idMedico"
            value={form.idMedico}
            onChange={handleChange}
            className={CLASE_SELECT}
          >
            <option value={0}>Selecciona un médico</option>
            {medicos.map((m) => (
              <option key={m.idMedico} value={m.idMedico!}>
                {m.nombre} {m.apellido} — {m.especialidad}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Motivo *" className="md:col-span-2">
          <input
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            placeholder="Ej. Control y vacunas"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Total">
          <input
            type="number"
            name="total"
            value={form.total}
            onChange={handleChange}
            min={0}
            className={CLASE_INPUT}
          />
        </Campo>
      </div>

      <div className="flex justify-between gap-3 border-t border-marca-oscuro/10 pt-5">
        <button
          type="button"
          onClick={() => setQuiereCita(false)}
          className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
        >
          <ArrowLeft size={18} />
          Atrás
        </button>
        <button
          type="button"
          disabled={!puedeAgendar}
          onClick={() => onAgendarCita(form)}
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-marca-oscuro/10 disabled:text-marca-oscuro/40 disabled:shadow-none disabled:hover:translate-y-0"
        >
          <Check size={18} />
          Confirmar y guardar todo
        </button>
      </div>
    </div>
  );
}

export default PasoCita;