import { useState, useEffect, type ChangeEvent } from "react";
import { buscarDuenos } from "../../services/duenoService";
import { useDebounce } from "../../hooks/useDebounce";
import type { Dueno } from "../../types/dueno";
import { Search, ArrowRight, UserCheck } from "lucide-react";
import Campo from "../formulario/Campo";
import { CLASE_INPUT } from "../formulario/estilosFormulario";

const duenoVacio: Dueno = {
  idDueno: null,
  nombre: "",
  apellido: "",
  telefono: "",
  direccion: "",
  estado: true,
};

interface Props {
  duenoInicial: Dueno;
  onSiguiente: (dueno: Dueno, esNuevo: boolean) => void;
}

function PasoDueno({ duenoInicial, onSiguiente }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState<Dueno[]>([]);
  const [form, setForm] = useState<Dueno>(duenoInicial);
  const [esNuevo, setEsNuevo] = useState(duenoInicial.idDueno === null);

  const busquedaDebounced = useDebounce(busqueda, 400);

  useEffect(() => {
    if (busquedaDebounced.trim().length < 2) {
      setSugerencias([]);
      return;
    }
    buscarDuenos(busquedaDebounced)
      .then((respuesta) => setSugerencias(respuesta.data))
      .catch(() => setSugerencias([]));
  }, [busquedaDebounced]);

  const handleSeleccionarSugerencia = (dueno: Dueno) => {
    setForm(dueno);
    setEsNuevo(false);
    setSugerencias([]);
    setBusqueda(`${dueno.nombre} ${dueno.apellido}`);
  };

  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    // Si el usuario vuelve a escribir después de haber seleccionado uno,
    // asumimos que quiere buscar otro, así que se reinicia el formulario
    if (!esNuevo) {
      setForm(duenoVacio);
      setEsNuevo(true);
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const puedeAvanzar =
    form.nombre.trim() !== "" &&
    form.apellido.trim() !== "" &&
    form.telefono.trim() !== "";

  return (
    <div className="space-y-5">
      <Campo
        etiqueta="Buscar dueño existente"
        icono={Search}
        className="relative"
      >
        <input
          value={busqueda}
          onChange={handleBusquedaChange}
          placeholder="Escribe un nombre o apellido..."
          className={CLASE_INPUT}
        />
        {sugerencias.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-marca-oscuro/10 bg-white shadow-lg shadow-marca-cafenigga/15">
            {sugerencias.map((d) => (
              <li
                key={d.idDueno}
                onClick={() => handleSeleccionarSugerencia(d)}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 font-nunito text-sm text-marca-oscuro hover:bg-marca-verde/20"
              >
                <span className="font-extrabold">
                  {d.nombre} {d.apellido}
                </span>
                <span className="text-marca-oscuro/60">— {d.telefono}</span>
              </li>
            ))}
          </ul>
        )}
      </Campo>

      {!esNuevo && (
        <p className="flex items-start gap-2 rounded-2xl bg-marca-verde/20 px-4 py-3 font-nunito text-sm font-semibold text-marca-oscuro">
          <UserCheck size={18} className="mt-0.5 shrink-0" />
          Dueño existente seleccionado. Puedes ajustar sus datos si es necesario.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Campo etiqueta="Nombre *">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleFormChange}
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Apellido *">
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleFormChange}
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Teléfono *">
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleFormChange}
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Dirección">
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleFormChange}
            className={CLASE_INPUT}
          />
        </Campo>
      </div>

      <div className="flex justify-end border-t border-marca-oscuro/10 pt-5">
        <button
          type="button"
          disabled={!puedeAvanzar}
          onClick={() => onSiguiente(form, esNuevo)}
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-marca-oscuro/10 disabled:text-marca-oscuro/40 disabled:shadow-none disabled:hover:translate-y-0"
        >
          Siguiente
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default PasoDueno;