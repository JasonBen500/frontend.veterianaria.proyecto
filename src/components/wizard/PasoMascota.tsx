import { useState, useEffect, type ChangeEvent } from "react";
import { listarMascotasPorDueno } from "../../services/mascotaService";
import type { Mascota } from "../../types/mascota";
import { ArrowLeft, ArrowRight, PawPrint } from "lucide-react";
import Campo from "../formulario/Campo";
import { CLASE_INPUT } from "../formulario/estilosFormulario";

interface Props {
  idDueno: number;
  duenoEsNuevo: boolean;
  mascotaInicial: Mascota;
  onSiguiente: (mascota: Mascota, esNueva: boolean) => void;
  onAtras: () => void;
}

function PasoMascota({
  idDueno,
  duenoEsNuevo,
  mascotaInicial,
  onSiguiente,
  onAtras,
}: Props) {
  const [mascotasDelDueno, setMascotasDelDueno] = useState<Mascota[]>([]);
  const [form, setForm] = useState<Mascota>({ ...mascotaInicial, idDueno });
  const [esNueva, setEsNueva] = useState(mascotaInicial.idMascota === null);

  // Solo busca mascotas existentes si el dueño YA existía (uno nuevo no puede tener mascotas)
  useEffect(() => {
    if (duenoEsNuevo) return;
    listarMascotasPorDueno(idDueno)
      .then((respuesta) => setMascotasDelDueno(respuesta.data))
      .catch(() => setMascotasDelDueno([]));
  }, [idDueno, duenoEsNuevo]);

  const handleSeleccionarMascota = (mascota: Mascota) => {
    setForm(mascota);
    setEsNueva(false);
  };

  const handleEmpezarNueva = () => {
    setForm({ ...mascotaVaciaConDueno(idDueno) });
    setEsNueva(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["edad", "peso"].includes(name) ? Number(value) : value,
    }));
  };

  const puedeAvanzar = form.nombre.trim() !== "" && form.especie.trim() !== "";

  return (
    <div className="space-y-5">
      {mascotasDelDueno.length > 0 && esNueva && (
        <div className="rounded-2xl bg-marca-verde/20 px-4 py-3">
          <p className="mb-2 font-nunito text-sm font-extrabold text-marca-oscuro">
            Este dueño ya tiene mascotas registradas:
          </p>
          <div className="flex flex-wrap gap-2">
            {mascotasDelDueno.map((m) => (
              <button
                key={m.idMascota}
                type="button"
                onClick={() => handleSeleccionarMascota(m)}
                className="inline-flex items-center gap-1.5 rounded-full border border-marca-oscuro/20 bg-white px-3 py-1 font-nunito text-sm font-bold text-marca-oscuro shadow-sm transition hover:bg-marca-naranja/30"
              >
                <PawPrint size={14} />
                {m.nombre} ({m.especie})
              </button>
            ))}
          </div>
          <p className="mt-2 font-nunito text-xs font-semibold text-marca-oscuro/60">
            O sigue llenando el formulario para registrar una mascota nueva.
          </p>
        </div>
      )}

      {!esNueva && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-marca-verde/20 px-4 py-3 font-nunito text-sm font-semibold text-marca-oscuro">
          <span className="flex items-center gap-2">
            <PawPrint size={18} />
            Mascota existente seleccionada.
          </span>
          <button
            type="button"
            onClick={handleEmpezarNueva}
            className="text-xs font-extrabold underline"
          >
            Registrar una diferente
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Campo etiqueta="Nombre *">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Especie *">
          <input
            name="especie"
            value={form.especie}
            onChange={handleChange}
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Edad">
          <input
            type="number"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            min={0}
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Peso (kg)">
          <input
            type="number"
            name="peso"
            value={form.peso}
            onChange={handleChange}
            min={0}
            step="0.01"
            className={CLASE_INPUT}
          />
        </Campo>
      </div>

      <div className="flex justify-between gap-3 border-t border-marca-oscuro/10 pt-5">
        <button
          type="button"
          onClick={onAtras}
          className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
        >
          <ArrowLeft size={18} />
          Atrás
        </button>
        <button
          type="button"
          disabled={!puedeAvanzar}
          onClick={() => onSiguiente(form, esNueva)}
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-marca-oscuro/10 disabled:text-marca-oscuro/40 disabled:shadow-none disabled:hover:translate-y-0"
        >
          Siguiente
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function mascotaVaciaConDueno(idDueno: number): Mascota {
  return {
    idMascota: null,
    nombre: "",
    especie: "",
    edad: 0,
    peso: 0,
    estado: true,
    idDueno,
  };
}

export default PasoMascota;
