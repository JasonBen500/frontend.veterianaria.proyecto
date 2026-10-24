import { useState, useEffect } from "react";
import { Syringe, Pill, Plus, X, ArrowLeft, Check, Info } from "lucide-react";
import { listarTratamientosActivos } from "../../services/tratamientoService";
import { listarMedicamentosActivos } from "../../services/medicamentosService";
import type { Tratamiento } from "../../types/tratamiento";
import type { Medicamentos } from "../../types/medicamentos";
import type {
  LineaTratamiento,
  LineaMedicamento,
} from "../../types/wizard";

interface Props {
  onAtras?: () => void;
  onConfirmar?: (
    tratamientos: LineaTratamiento[],
    medicamentos: LineaMedicamento[],
  ) => void;
  // Modo "dentro de otro formulario"
  embebido?: boolean;
  onCambio?: (
    tratamientos: LineaTratamiento[],
    medicamentos: LineaMedicamento[],
  ) => void;
  encabezado?: string;
  textoConfirmar?: string;
}

function PasoTratamiento({
  onAtras,
  onConfirmar,
  embebido = false,
  onCambio,
  textoConfirmar = "Confirmar y guardar todo",
}: Props) {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamentos[]>([]);

  const [lineasTrat, setLineasTrat] = useState<LineaTratamiento[]>([]);
  const [lineasMed, setLineasMed] = useState<LineaMedicamento[]>([]);

  const [idTratSel, setIdTratSel] = useState(0);
  const [idMedSel, setIdMedSel] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    listarTratamientosActivos()
      .then((r) => setTratamientos(r.data))
      .catch(() => setTratamientos([]));
    listarMedicamentosActivos()
      .then((r) => setMedicamentos(r.data))
      .catch(() => setMedicamentos([]));
  }, []);

  const agregarTratamiento = () => {
    const t = tratamientos.find((x) => x.idTratamiento === idTratSel);
    if (!t) return;
    if (lineasTrat.some((l) => l.idTratamiento === idTratSel)) {
      setError("Ese tratamiento ya está agregado");
      return;
    }
    setError("");
    const nuevas = [
      ...lineasTrat,
      { idTratamiento: t.idTratamiento!, nombre: t.nombre, precio: t.precio },
    ];
    setLineasTrat(nuevas);
    onCambio?.(nuevas, lineasMed);
    setIdTratSel(0);
  };

  const agregarMedicamento = () => {
    const m = medicamentos.find((x) => x.idMedicamento === idMedSel);
    if (!m) return;

    const yaAgregada = lineasMed.find((l) => l.idMedicamento === idMedSel);
    const totalPedido = (yaAgregada?.cantidad ?? 0) + cantidad;

    if (totalPedido > m.stock) {
      setError(`Stock insuficiente de ${m.nombre}: hay ${m.stock} disponibles`);
      return;
    }
    setError("");

    const nuevas = yaAgregada
      ? lineasMed.map((l) =>
        l.idMedicamento === idMedSel ? { ...l, cantidad: totalPedido } : l,
      )
      : [
        ...lineasMed,
        {
          idMedicamento: m.idMedicamento!,
          nombre: m.nombre,
          precio: m.precio,
          stock: m.stock,
          cantidad,
        },
      ];
    setLineasMed(nuevas);
    onCambio?.(lineasTrat, nuevas);
    setIdMedSel(0);
    setCantidad(1);
  };

  const quitarTratamiento = (id: number) => {
    const nuevas = lineasTrat.filter((l) => l.idTratamiento !== id);
    setLineasTrat(nuevas);
    onCambio?.(nuevas, lineasMed);
  };

  const quitarMedicamento = (id: number) => {
    const nuevas = lineasMed.filter((l) => l.idMedicamento !== id);
    setLineasMed(nuevas);
    onCambio?.(lineasTrat, nuevas);
  };

  const total =
    lineasTrat.reduce((suma, l) => suma + l.precio, 0) +
    lineasMed.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

  const CLASE_SELECT =
    "min-w-0 flex-1 rounded-2xl border border-marca-cafenigga/30 bg-white px-4 py-2.5 font-nunito font-semibold text-marca-oscuro shadow-sm transition focus:border-marca-naranja focus:outline-none focus:ring-2 focus:ring-marca-naranja";
  const CLASE_AGREGAR =
    "inline-flex items-center gap-1.5 rounded-full bg-marca-naranja px-5 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-marca-oscuro/10 disabled:text-marca-oscuro/40 disabled:shadow-none disabled:hover:translate-y-0";
  const CLASE_QUITAR =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marca-vino/10 text-marca-vino transition hover:bg-marca-vino hover:text-white";

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-2xl bg-marca-verde/20 px-4 py-3 font-nunito text-sm font-semibold text-marca-oscuro">
        <Info size={18} className="mt-0.5 shrink-0" />
        Tratamientos y medicamentos de la cita (opcional).
      </p>

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-nunito text-sm font-bold text-red-700"
        >
          {error}
        </p>
      )}

      {/* TRATAMIENTOS */}
      <section className="rounded-3xl border border-marca-oscuro/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 font-nunito text-base font-extrabold text-marca-oscuro">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-marca-naranja/30">
            <Syringe size={18} />
          </span>
          Tratamiento
        </h3>

        <div className="mb-3 flex gap-2">
          <select
            value={idTratSel}
            onChange={(e) => setIdTratSel(Number(e.target.value))}
            className={CLASE_SELECT}
          >
            <option value={0}>N/A</option>
            {tratamientos.map((t) => (
              <option key={t.idTratamiento} value={t.idTratamiento!}>
                {t.nombre} — Q{t.precio}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={idTratSel === 0}
            onClick={agregarTratamiento}
            className={CLASE_AGREGAR}
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <div className="space-y-2">
          {lineasTrat.length === 0 && (
            <p className="font-nunito text-sm font-bold text-marca-oscuro/50">
              N/A
            </p>
          )}
          {lineasTrat.map((l) => (
            <div
              key={l.idTratamiento}
              className="flex items-center justify-between gap-3 rounded-xl bg-marca-beigeclaro2 px-3 py-2 font-nunito text-sm font-bold text-marca-oscuro"
            >
              <span className="min-w-0 truncate">{l.nombre}</span>
              <span className="flex shrink-0 items-center gap-3">
                Q{l.precio}
                <button
                  type="button"
                  onClick={() => quitarTratamiento(l.idTratamiento)}
                  aria-label={`Quitar ${l.nombre}`}
                  className={CLASE_QUITAR}
                >
                  <X size={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* MEDICAMENTOS */}
      <section className="rounded-3xl border border-marca-oscuro/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 font-nunito text-base font-extrabold text-marca-oscuro">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-marca-verde/40">
            <Pill size={18} />
          </span>
          Medicamento
        </h3>

        <div className="mb-3 flex gap-2">
          <select
            value={idMedSel}
            onChange={(e) => setIdMedSel(Number(e.target.value))}
            className={CLASE_SELECT}
          >
            <option value={0}>N/A</option>
            {medicamentos.map((m) => (
              <option
                key={m.idMedicamento}
                value={m.idMedicamento!}
                disabled={m.stock <= 0}
              >
                {m.nombre} — Q{m.precio} (stock: {m.stock})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
            aria-label="Cantidad"
            className="w-20 rounded-2xl border border-marca-cafenigga/30 bg-white px-3 py-2.5 text-center font-nunito font-semibold text-marca-oscuro shadow-sm focus:border-marca-naranja focus:outline-none focus:ring-2 focus:ring-marca-naranja"
          />
          <button
            type="button"
            disabled={idMedSel === 0}
            onClick={agregarMedicamento}
            className={CLASE_AGREGAR}
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <div className="space-y-2">
          {lineasMed.length === 0 && (
            <p className="font-nunito text-sm font-bold text-marca-oscuro/50">
              N/A
            </p>
          )}
          {lineasMed.map((l) => (
            <div
              key={l.idMedicamento}
              className="flex items-center justify-between gap-3 rounded-xl bg-marca-beigeclaro2 px-3 py-2 font-nunito text-sm font-bold text-marca-oscuro"
            >
              <span className="min-w-0 truncate">
                {l.nombre} x{l.cantidad}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                Q{l.precio * l.cantidad}
                <button
                  type="button"
                  onClick={() => quitarMedicamento(l.idMedicamento)}
                  aria-label={`Quitar ${l.nombre}`}
                  className={CLASE_QUITAR}
                >
                  <X size={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <p className="rounded-full bg-marca-oscuro px-6 py-2 font-nunito text-lg font-extrabold text-white shadow-md">
          Total: Q{total}
        </p>
      </div>

      {!embebido && (
        <div className="flex justify-between gap-3 border-t border-marca-oscuro/10 pt-5">
          {onAtras ? (
            <button
              type="button"
              onClick={onAtras}
              className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              <ArrowLeft size={18} />
              Atrás
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => onConfirmar?.(lineasTrat, lineasMed)}
            className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <Check size={18} />
            {textoConfirmar}
          </button>
        </div>
      )}
    </div>
  );
}

export default PasoTratamiento;