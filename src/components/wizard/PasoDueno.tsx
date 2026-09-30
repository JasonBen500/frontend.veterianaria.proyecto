import { useState, useEffect, type ChangeEvent } from "react";
import { buscarDuenos } from "../../services/duenoService";
import { useDebounce } from "../../hooks/useDebounce";
import type { Dueno } from "../../types/dueno";

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 1 de 3</h2>
      <p className="text-sm text-gray-500 mb-4">Datos del dueño</p>

      <div className="relative mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar dueño existente
        </label>
        <input
          value={busqueda}
          onChange={handleBusquedaChange}
          placeholder="Escribe un nombre o apellido..."
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {sugerencias.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 shadow-lg max-h-48 overflow-y-auto">
            {sugerencias.map((d) => (
              <li
                key={d.idDueno}
                onClick={() => handleSeleccionarSugerencia(d)}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                <span className="font-medium">
                  {d.nombre} {d.apellido}
                </span>{" "}
                <span className="text-gray-500">— {d.telefono}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!esNuevo && (
        <p className="mb-4 p-3 rounded border text-sm bg-green-50 text-green-700 border-green-200">
          Dueño existente seleccionado. Puedes ajustar sus datos si es necesario.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <button
        disabled={!puedeAvanzar}
        onClick={() => onSiguiente(form, esNuevo)}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  );
}

export default PasoDueno;