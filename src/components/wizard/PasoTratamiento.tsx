import { useState, useEffect } from "react";
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
  onConfirmar: (
    tratamientos: LineaTratamiento[],
    medicamentos: LineaMedicamento[],
  ) => void;
  encabezado?: string;
  textoConfirmar?: string;
}

function PasoTratamiento({
  onAtras,
  onConfirmar,
  encabezado = "Paso 4 de 4",
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
    setLineasTrat((prev) => [
      ...prev,
      { idTratamiento: t.idTratamiento!, nombre: t.nombre, precio: t.precio },
    ]);
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

    if (yaAgregada) {
      setLineasMed((prev) =>
        prev.map((l) =>
          l.idMedicamento === idMedSel ? { ...l, cantidad: totalPedido } : l,
        ),
      );
    } else {
      setLineasMed((prev) => [
        ...prev,
        {
          idMedicamento: m.idMedicamento!,
          nombre: m.nombre,
          precio: m.precio,
          stock: m.stock,
          cantidad,
        },
      ]);
    }
    setIdMedSel(0);
    setCantidad(1);
  };

  const quitarTratamiento = (id: number) =>
    setLineasTrat((prev) => prev.filter((l) => l.idTratamiento !== id));

  const quitarMedicamento = (id: number) =>
    setLineasMed((prev) => prev.filter((l) => l.idMedicamento !== id));

  const total =
    lineasTrat.reduce((suma, l) => suma + l.precio, 0) +
    lineasMed.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-1">{encabezado}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Tratamientos y medicamentos de la cita (opcional)
      </p>

      {error && (
        <p className="mb-4 p-3 rounded border text-sm bg-red-50 text-red-700 border-red-200">
          {error}
        </p>
      )}

      {/* TRATAMIENTOS */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tratamiento
      </label>
      <div className="flex gap-2 mb-3">
        <select
          value={idTratSel}
          onChange={(e) => setIdTratSel(Number(e.target.value))}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={0}>Selecciona un tratamiento</option>
          {tratamientos.map((t) => (
            <option key={t.idTratamiento} value={t.idTratamiento!}>
              {t.nombre} — Q{t.precio}
            </option>
          ))}
        </select>
        <button
          disabled={idTratSel === 0}
          onClick={agregarTratamiento}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>

      {lineasTrat.map((l) => (
        <div
          key={l.idTratamiento}
          className="flex justify-between items-center text-sm border-b border-gray-100 py-1"
        >
          <span>
            {l.nombre} — Q{l.precio}
          </span>
          <button
            onClick={() => quitarTratamiento(l.idTratamiento)}
            className="text-red-600 hover:underline"
          >
            Quitar
          </button>
        </div>
      ))}

      {/* MEDICAMENTOS */}
      <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">
        Medicamento
      </label>
      <div className="flex gap-2 mb-3">
        <select
          value={idMedSel}
          onChange={(e) => setIdMedSel(Number(e.target.value))}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={0}>Selecciona un medicamento</option>
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
          className="w-20 border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          disabled={idMedSel === 0}
          onClick={agregarMedicamento}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>

      {lineasMed.map((l) => (
        <div
          key={l.idMedicamento}
          className="flex justify-between items-center text-sm border-b border-gray-100 py-1"
        >
          <span>
            {l.nombre} x{l.cantidad} — Q{l.precio * l.cantidad}
          </span>
          <button
            onClick={() => quitarMedicamento(l.idMedicamento)}
            className="text-red-600 hover:underline"
          >
            Quitar
          </button>
        </div>
      ))}

      <p className="text-right font-semibold text-gray-800 mt-4">
        Total: Q{total}
      </p>

      <div className="flex gap-3 mt-6">
        {onAtras && (
          <button
            onClick={onAtras}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
          >
            Atrás
          </button>
        )}
        <button
          onClick={() => onConfirmar(lineasTrat, lineasMed)}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {textoConfirmar}
        </button>
      </div>
    </div>
  );
}

export default PasoTratamiento;