import type { ChangeEvent, FormEvent } from "react";
import { CalendarDays, Info } from "lucide-react";
import ModalFormulario from "../formulario/ModalFormulario";
import Campo from "../formulario/Campo";
import { CLASE_INPUT, CLASE_SELECT } from "../formulario/estilosFormulario";
import type { Cita } from "../../types/cita";
import type { Mascota } from "../../types/mascota";
import type { Medico } from "../../types/medico";
import type { Usuarios } from "../../types/usuarios";

type CambioCampo = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface Props {
  abierto: boolean;
  modoEdicion: boolean;
  form: Cita;
  mensaje: string;
  mascotas: Mascota[];
  medicos: Medico[];
  usuarios: Usuarios[];
  onChange: (e: CambioCampo) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCerrar: () => void;
}


function FormularioCita({
  abierto,
  modoEdicion,
  form,
  mensaje,
  mascotas,
  medicos,
  usuarios,
  onChange,
  onSubmit,
  onCerrar,
}: Props) {
   return (
    <ModalFormulario
      abierto={abierto}
      titulo={modoEdicion ? "MODIFICAR CITA" : "NUEVA CITA"}
      subtitulo={
        modoEdicion
          ? "Edita la información de la cita:"
          : "Ingresa los datos para agendar la nueva cita:"
      }
      icono={CalendarDays}
      mensaje={mensaje}
      onSubmit={onSubmit}
      onCerrar={onCerrar}
    >
      <Campo etiqueta="Fecha:">
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={onChange}
          className={CLASE_INPUT}
        />
      </Campo>

      <Campo etiqueta="Motivo:">
        <input
          name="motivo"
          value={form.motivo}
          onChange={onChange}
          placeholder="Ej. Control y vacunas"
          className={CLASE_INPUT}
        />
      </Campo>

      <Campo etiqueta="Paciente (Mascota):">
        <select
          name="idMascota"
          value={form.idMascota === 0 ? "" : form.idMascota}
          onChange={onChange}
          className={CLASE_SELECT}
        >
          <option value="" disabled className="bg-marca-beige-claro">
            Seleccione una mascota...
          </option>
          {mascotas.map((m) => (
            <option
              key={m.idMascota}
              value={m.idMascota ?? undefined}
              className="bg-marca-beigeclaro2"
            >
              {m.idMascota}. {m.nombre}
            </option>
          ))}
        </select>
      </Campo>

      <Campo etiqueta="Médico:">
        <select
          name="idMedico"
          value={form.idMedico === 0 ? "" : form.idMedico}
          onChange={onChange}
          className={CLASE_SELECT}
        >
          <option value="" disabled className="bg-marca-beige-claro">
            Seleccione un médico...
          </option>
          {medicos.map((m) => (
            <option
              key={m.idMedico}
              value={m.idMedico ?? undefined}
              className="bg-marca-beigeclaro2"
            >
              {m.idMedico}. {m.nombre} {m.apellido}
            </option>
          ))}
        </select>
      </Campo>

      <Campo etiqueta="Usuario de Sistema:" className="md:col-span-2">
        <select
          name="idUsuario"
          value={form.idUsuario === 0 ? "" : form.idUsuario}
          onChange={onChange}
          className={CLASE_SELECT}
        >
          <option value="" disabled className="bg-marca-beige-claro">
            Seleccione el usuario que atiende...
          </option>
          {usuarios.map((u) => (
            <option
              key={u.idUsuario}
              value={u.idUsuario ?? undefined}
              className="bg-marca-beigeclaro2"
            >
              {u.idUsuario}. {u.nombre}
            </option>
          ))}
        </select>
      </Campo>

      <p className="flex items-start gap-2 rounded-2xl bg-marca-verde/20 px-4 py-3 font-nunito text-sm font-semibold text-marca-oscuro md:col-span-2">
        <Info size={18} className="mt-0.5 shrink-0" />
        El total se calcula solo a partir de los medicamentos y tratamientos
        agregados a la cita.
      </p>
    </ModalFormulario>
  );
}

export default FormularioCita;
