import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";
import { ClipboardList } from "lucide-react";
import ModalFormulario from "../formulario/ModalFormulario";
import Campo from "../formulario/Campo";
import { CLASE_INPUT, CLASE_SELECT } from "../formulario/estilosFormulario";
import { etiquetaCita } from "../../utils/citas";
import type { DetalleCita } from "../../types/detalleCita";
import type { Cita } from "../../types/cita";
import type { Medicamentos } from "../../types/medicamentos";
import type { Tratamiento } from "../../types/tratamiento";

export type TipoDetalle = "medicamento" | "tratamiento";

type CambioCampo = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface Props {
  abierto: boolean;
  modoEdicion: boolean;
  mensaje: string;
  form: DetalleCita;
  setForm: Dispatch<SetStateAction<DetalleCita>>;
  onChange: (e: CambioCampo) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCerrar: () => void;
  tipo: TipoDetalle;
  onCambiarTipo: (tipo: TipoDetalle) => void;
  citas: Cita[];
  medicamentos: Medicamentos[];
  tratamientos: Tratamiento[];
}

// Modal para agregar o editar un medicamento / tratamiento de una cita
function FormularioDetalle({
  abierto,
  modoEdicion,
  mensaje,
  form,
  setForm,
  onChange,
  onSubmit,
  onCerrar,
  tipo,
  onCambiarTipo,
  citas,
  medicamentos,
  tratamientos,
}: Props) {
  const medicamentoElegido = medicamentos.find(
    (m) => m.idMedicamento === form.idMedicamento,
  );

  // Al cambiar de tipo se limpia lo elegido del otro tipo
  const cambiarTipo = (nuevoTipo: TipoDetalle) => {
    onCambiarTipo(nuevoTipo);
    setForm((prev) => ({
      ...prev,
      idMedicamento: 0,
      idTratamiento: 0,
      cantidad: 1,
      precioAplicado: 0,
    }));
  };

  // Al elegir el concepto se muestra su precio de catálogo (el servidor es quien lo fija)
  const elegirMedicamento = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    const elegido = medicamentos.find(
      (m) => m.idMedicamento === Number(e.target.value),
    );
    if (elegido) {
      setForm((prev) => ({ ...prev, precioAplicado: elegido.precio }));
    }
  };

  const elegirTratamiento = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    const elegido = tratamientos.find(
      (t) => t.idTratamiento === Number(e.target.value),
    );
    if (elegido) {
      setForm((prev) => ({ ...prev, precioAplicado: elegido.precio }));
    }
  };

  return (
    <ModalFormulario
      abierto={abierto}
      titulo={modoEdicion ? "MODIFICAR DETALLE" : "NUEVO DETALLE"}
      subtitulo={
        modoEdicion
          ? "Edita el medicamento o tratamiento de la cita:"
          : "Agrega un medicamento o tratamiento a una cita:"
      }
      icono={ClipboardList}
      mensaje={mensaje}
      onSubmit={onSubmit}
      onCerrar={onCerrar}
    >
      <Campo etiqueta="Cita:" className="md:col-span-2">
        <select
          name="idCita"
          value={form.idCita === 0 ? "" : form.idCita}
          onChange={onChange}
          required
          className={CLASE_SELECT}
        >
          <option value="" disabled className="bg-marca-beige-claro">
            Seleccione la cita...
          </option>
          {citas.map((c) => (
            <option
              key={c.idCita}
              value={c.idCita ?? undefined}
              className="bg-marca-beigeclaro2"
            >
              {etiquetaCita(c)}
            </option>
          ))}
        </select>
      </Campo>

      <Campo etiqueta="Tipo:">
        <select
          value={tipo}
          onChange={(e) => cambiarTipo(e.target.value as TipoDetalle)}
          className={CLASE_SELECT}
        >
          <option value="medicamento">Medicamento</option>
          <option value="tratamiento">Tratamiento</option>
        </select>
      </Campo>

      {tipo === "medicamento" ? (
        <Campo etiqueta="Medicamento:">
          <select
            name="idMedicamento"
            value={form.idMedicamento || ""}
            onChange={elegirMedicamento}
            required
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione un medicamento...
            </option>
            {medicamentos.map((m) => (
              <option
                key={m.idMedicamento}
                value={m.idMedicamento ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {m.nombre}
              </option>
            ))}
          </select>
        </Campo>
      ) : (
        <Campo etiqueta="Tratamiento:">
          <select
            name="idTratamiento"
            value={form.idTratamiento || ""}
            onChange={elegirTratamiento}
            required
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione un tratamiento...
            </option>
            {tratamientos.map((t) => (
              <option
                key={t.idTratamiento}
                value={t.idTratamiento ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {t.nombre}
              </option>
            ))}
          </select>
        </Campo>
      )}

      {tipo === "medicamento" && (
        <Campo etiqueta="Cantidad:">
          <input
            type="number"
            name="cantidad"
            value={form.cantidad ?? 1}
            onChange={onChange}
            min={1}
            className={CLASE_INPUT}
          />
          {medicamentoElegido && (
            <p className="mt-1 text-sm font-nunito text-gray-500">
              Stock disponible: {medicamentoElegido.stock}
            </p>
          )}
        </Campo>
      )}

      <Campo etiqueta="Precio (Q):">
        <input
          type="number"
          name="precioAplicado"
          value={form.precioAplicado === 0 ? "" : form.precioAplicado}
          readOnly
          placeholder="Según el catálogo"
          className={`${CLASE_INPUT} cursor-not-allowed bg-marca-beige/60`}
        />
        <p className="mt-1 text-sm font-nunito text-gray-500">
          El precio lo toma el sistema del catálogo.
        </p>
      </Campo>
    </ModalFormulario>
  );
}

export default FormularioDetalle;
