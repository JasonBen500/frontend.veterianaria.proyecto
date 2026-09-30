import { useState, useEffect, type ChangeEvent } from "react";
import { listarMedicosActivos } from "../../services/medicoService";
import type { Medico } from "../../types/medico";
import type { Cita } from "../../types/cita";

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
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 3 de 3</h2>
        <p className="text-sm text-gray-500 mb-6">
          ¿Deseas agendar una cita para esta mascota ahora?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onAtras}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
          >
            Atrás
          </button>
          <button
            onClick={onGuardarSinCita}
            className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition"
          >
            Guardar sin cita
          </button>
          <button
            onClick={() => setQuiereCita(true)}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Agendar cita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 3 de 3</h2>
      <p className="text-sm text-gray-500 mb-4">Datos de la cita</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha *
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Médico *
          </label>
          <select
            name="idMedico"
            value={form.idMedico}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={0}>Selecciona un médico</option>
            {medicos.map((m) => (
              <option key={m.idMedico} value={m.idMedico!}>
                {m.nombre} {m.apellido} — {m.especialidad}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo *
          </label>
          <input
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total
          </label>
          <input
            type="number"
            name="total"
            value={form.total}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setQuiereCita(false)}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
        >
          Atrás
        </button>
        <button
          disabled={!puedeAgendar}
          onClick={() => onAgendarCita(form)}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirmar y guardar todo
        </button>
      </div>
    </div>
  );
}

export default PasoCita;