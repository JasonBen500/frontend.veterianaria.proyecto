import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Stethoscope } from "lucide-react";
import Modal from "./Modal";
import Mensaje from "./Mensaje";
import HojaCliente from "./HojaCliente";
import PasoTratamiento from "./wizard/PasoTratamiento";
import { listarCitasActivas, modificarCita } from "../services/citaService";
import { listarMascotasActivas } from "../services/mascotaService";
import {
  agregarConsulta,
  listarConsultasActivas,
} from "../services/consultaService";
import { agregarDetalleCita } from "../services/detalleCitaService";
import type { Consulta } from "../types/consulta";
import type { Cita } from "../types/cita";
import type { Mascota } from "../types/mascota";
import type { DetalleCita } from "../types/detalleCita";
import type { LineaTratamiento, LineaMedicamento } from "../types/wizard";
import { formatearFecha } from "../utils/fechas";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onFinalizado?: () => void;
}

const formInicial: Consulta = {
  idConsulta: null,
  diagnostico: "",
  sintomas: "",
  estado: true,
  idCita: 0,
};

const obtenerMensajeError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.mensaje ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Ocurrió un error inesperado";
};

function ModalConsulta({ abierto, onCerrar, onFinalizado }: Props) {
  const [form, setForm] = useState<Consulta>(formInicial);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [idCitaAtendiendo, setIdCitaAtendiendo] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");

  // Cada vez que se abre, se cargan las listas actualizadas
  useEffect(() => {
    if (!abierto) return;
    const cargar = async () => {
      try {
        const [rCitas, rMascotas, rConsultas] = await Promise.all([
          listarCitasActivas(),
          listarMascotasActivas(),
          listarConsultasActivas(),
        ]);
        setCitas(rCitas.data);
        setMascotas(rMascotas.data);
        setConsultas(rConsultas.data);
      } catch (err) {
        console.error("Error al cargar datos de la consulta", err);
      }
    };
    cargar();
  }, [abierto]);

  const citasAtendidas = new Set(
    consultas.filter((c) => c.estado !== false).map((c) => c.idCita),
  );
  const citasPendientes = citas.filter(
    (c) => c.idCita !== null && !citasAtendidas.has(c.idCita),
  );

  const cerrar = () => {
    if (idCitaAtendiendo !== null) onFinalizado?.();
    setForm(formInicial);
    setPaso(1);
    setIdCitaAtendiendo(null);
    setMensaje("");
    onCerrar();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idCita" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { idConsulta: _sinUsar, ...datosConsulta } = form;
      await agregarConsulta(datosConsulta);
      setIdCitaAtendiendo(form.idCita);
      setPaso(2);
      setMensaje("");
    } catch (err) {
      setMensaje(obtenerMensajeError(err));
    }
  };

  const guardarDetalles = async (
    tratamientos: LineaTratamiento[],
    medicamentos: LineaMedicamento[],
  ) => {
    if (idCitaAtendiendo === null) return;
    try {
      for (const t of tratamientos) {
        await agregarDetalleCita({
          precioAplicado: t.precio,
          estado: true,
          idCita: idCitaAtendiendo,
          idTratamiento: t.idTratamiento,
          cantidad: 1,
        } as Omit<DetalleCita, "idDetalleCita">);
      }

      for (const m of medicamentos) {
        await agregarDetalleCita({
          precioAplicado: m.precio,
          estado: true,
          idCita: idCitaAtendiendo,
          idMedicamento: m.idMedicamento,
          cantidad: m.cantidad,
        } as Omit<DetalleCita, "idDetalleCita">);
      }

      const total =
        tratamientos.reduce((suma, l) => suma + l.precio, 0) +
        medicamentos.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

      const cita = citas.find((c) => c.idCita === idCitaAtendiendo);
      if (cita && total > 0) {
        const { idCita: _sinUsar, ...resto } = cita;
        await modificarCita(idCitaAtendiendo, {
          ...resto,
          total: Math.round(total),
        });
      }

      setMensaje("");
      setPaso(3);
    } catch (err) {
      setMensaje(obtenerMensajeError(err));
    }
  };

  return (
    <Modal
      abierto={abierto}
      titulo={
        paso === 1
          ? "INICIAR CONSULTA MÉDICA"
          : paso === 2
            ? "TRATAMIENTOS Y MEDICAMENTOS"
            : "INFORME DE LA CITA"
      }
      subtitulo={
        paso === 1
          ? "Ingresa los datos clínicos de la mascota:"
          : paso === 2
            ? "Registra lo aplicado en la consulta (opcional):"
            : "Resumen listo para entregar al cliente:"
      }
      icono={Stethoscope}
      onCerrar={cerrar}
    >
      {paso === 1 && (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
          <Mensaje texto={mensaje} />

          <div>
            <label className="mb-2 block font-nunito text-lg font-semibold text-gray-700">
              Cita Asociada:
            </label>
            <select
              name="idCita"
              value={form.idCita === 0 ? "" : form.idCita}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-cafenigga bg-beigeclaro2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                {citasPendientes.length === 0
                  ? "No hay citas pendientes de atender"
                  : "Seleccione la cita para esta consulta..."}
              </option>
              {citasPendientes.map((c) => {
                const mascotaEncontrada = mascotas.find(
                  (m) => m.idMascota === c.idMascota,
                );
                const nombreMostrar =
                  c.nombreMascota ||
                  mascotaEncontrada?.nombre ||
                  `ID Desconocido (${c.idMascota})`;
                return (
                  <option
                    key={c.idCita}
                    value={c.idCita ?? undefined}
                    className="bg-marca-beigeclaro2"
                  >
                    Cita #{c.idCita} - Paciente: {nombreMostrar} (
                    {formatearFecha(c.fecha)})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-nunito text-lg font-semibold text-gray-700">
              Síntomas:
            </label>
            <textarea
              name="sintomas"
              value={form.sintomas}
              onChange={handleChange}
              rows={3}
              placeholder="Ej. Fiebre, falta de apetito, vómitos..."
              className="w-full rounded-xl border border-cafenigga px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block font-nunito text-lg font-semibold text-gray-700">
              Diagnóstico:
            </label>
            <textarea
              name="diagnostico"
              value={form.diagnostico}
              onChange={handleChange}
              rows={3}
              placeholder="Ej. Infección viral leve, se receta antibiótico..."
              className="w-full rounded-xl border border-cafenigga px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-full mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={cerrar}
              className="rounded-full border border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full bg-marca-oscuro px-6 py-2 font-nunito font-bold text-white transition hover:bg-marca-oscuro/90"
            >
              Guardar y continuar
            </button>
          </div>
        </form>
      )}

      {paso === 2 && (
        <div className="mt-4">
          <Mensaje texto={mensaje} />
          <PasoTratamiento
            encabezado="Paso 2 de 3"
            textoConfirmar="Guardar y ver informe"
            onConfirmar={guardarDetalles}
          />
        </div>
      )}

      {paso === 3 && idCitaAtendiendo !== null && (
        <div className="mt-4">
          <HojaCliente key={idCitaAtendiendo} idCita={idCitaAtendiendo} />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={cerrar}
              className="rounded-full border border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ModalConsulta;