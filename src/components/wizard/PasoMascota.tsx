import { useState, useEffect, type ChangeEvent } from "react";
import { listarMascotasPorDueno } from "../../services/mascotaService";
import type { Mascota } from "../../types/mascota";

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 2 de 3</h2>
      <p className="text-sm text-gray-500 mb-4">Datos de la mascota</p>

      {mascotasDelDueno.length > 0 && esNueva && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Este dueño ya tiene mascotas registradas:
          </p>
          <div className="flex flex-wrap gap-2">
            {mascotasDelDueno.map((m) => (
              <button
                key={m.idMascota}
                type="button"
                onClick={() => handleSeleccionarMascota(m)}
                className="px-3 py-1 border border-blue-300 text-blue-700 rounded-full text-sm hover:bg-blue-50"
              >
                {m.nombre} ({m.especie})
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            O sigue llenando el formulario para registrar una mascota nueva.
          </p>
        </div>
      )}

      {!esNueva && (
        <div className="mb-4 p-3 rounded border text-sm bg-green-50 text-green-700 border-green-200 flex justify-between items-center">
          <span>Mascota existente seleccionada.</span>
          <button
            type="button"
            onClick={handleEmpezarNueva}
            className="text-green-800 underline text-xs"
          >
            Registrar una diferente
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Especie *
          </label>
          <input
            name="especie"
            value={form.especie}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edad
          </label>
          <input
            type="number"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            name="peso"
            value={form.peso}
            onChange={handleChange}
            min={0}
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onAtras}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
        >
          Atrás
        </button>
        <button
          disabled={!puedeAvanzar}
          onClick={() => onSiguiente(form, esNueva)}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Siguiente
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
