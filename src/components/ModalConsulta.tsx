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
  idMascota?: number | null;
  idDueno?: number | null;
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

function ModalConsulta({
  abierto,
  onCerrar,
  onFinalizado,
  idMascota = null,
  idDueno = null,
}: Props) {
  const [form, setForm] = useState<Consulta>(formInicial);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [lineasTrat, setLineasTrat] = useState<LineaTratamiento[]>([]);
  const [lineasMed, setLineasMed] = useState<LineaMedicamento[]>([]);
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

  // Si se abre desde una mascota o un dueño, solo se muestran sus citas pendientes
  const idsMascotasDelDueno = new Set(
    mascotas.filter((m) => m.idDueno === idDueno).map((m) => m.idMascota),
  );
  const citasMostradas = citasPendientes
    .filter((c) => {
      if (idMascota !== null) return c.idMascota === idMascota;
      if (idDueno !== null) return idsMascotasDelDueno.has(c.idMascota);
      return true;
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const vieneDeRegistro = idMascota !== null || idDueno !== null;

  // Se elige sola la cita pendiente más antigua; el usuario puede cambiarla
  const idCitaElegida =
    form.idCita !== 0
      ? form.idCita
      : vieneDeRegistro && citasMostradas.length > 0
        ? (citasMostradas[0].idCita ?? 0)
        : 0;

  const pacienteSeleccionado =
    idMascota !== null
      ? mascotas.find((m) => m.idMascota === idMascota)?.nombre
      : idDueno !== null
        ? mascotas.find((m) => m.idDueno === idDueno)?.nombreDueno
        : undefined;

  const cerrar = () => {
    if (idCitaAtendiendo !== null) onFinalizado?.();
    setForm(formInicial);
    setPaso(1);
    setIdCitaAtendiendo(null);
    setLineasTrat([]);
    setLineasMed([]);
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
      // Si ya se guardó la consulta y falló algo después, no se vuelve a crear
      if (idCitaAtendiendo === null) {
        const { idConsulta: _sinUsar, ...datosConsulta } = form;
        await agregarConsulta({ ...datosConsulta, idCita: idCitaElegida });
        setIdCitaAtendiendo(idCitaElegida);
      }
      const idCita = idCitaAtendiendo ?? idCitaElegida;

      for (const t of lineasTrat) {
        await agregarDetalleCita({
          precioAplicado: t.precio,
          estado: true,
          idCita,
          idTratamiento: t.idTratamiento,
          cantidad: 1,
        } as Omit<DetalleCita, "idDetalleCita">);
      }

      for (const m of lineasMed) {
        await agregarDetalleCita({
          precioAplicado: m.precio,
          estado: true,
          idCita,
          idMedicamento: m.idMedicamento,
          cantidad: m.cantidad,
        } as Omit<DetalleCita, "idDetalleCita">);
      }

      const total =
        lineasTrat.reduce((suma, l) => suma + l.precio, 0) +
        lineasMed.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

      const cita = citas.find((c) => c.idCita === idCita);
      if (cita && total > 0) {
        const { idCita: _sinUsar, ...resto } = cita;
        await modificarCita(idCita, { ...resto, total: Math.round(total) });
      }

      setMensaje("");
      setPaso(2);
    } catch (err) {
      setMensaje(obtenerMensajeError(err));
    }
  };

  return (
    <Modal
      abierto={abierto}
      titulo={paso === 1 ? "INICIAR CONSULTA MÉDICA" : "INFORME DE LA CITA"}
      subtitulo={
        paso === 1
          ? "Ingresa los datos clínicos y lo aplicado a la mascota:"
          : "Resumen listo para entregar al cliente:"
      }
      icono={Stethoscope}
      onCerrar={cerrar}
    >
      {paso === 1 && (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
          <Mensaje texto={mensaje} />

          {pacienteSeleccionado && (
            <p className="rounded-2xl bg-marca-verde/20 px-4 py-2 font-nunito text-sm font-bold text-marca-oscuro">
              {idMascota !== null ? "Mascota" : "Dueño"}: {pacienteSeleccionado}
            </p>
          )}

          <div>
            <label className="mb-2 block font-nunito text-lg font-semibold text-gray-700">
              Cita Asociada:
            </label>
            <select
              name="idCita"
              value={idCitaElegida === 0 ? "" : idCitaElegida}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-cafenigga bg-beigeclaro2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                {citasMostradas.length === 0
                  ? vieneDeRegistro
                    ? "Sin citas pendientes para este registro"
                    : "No hay citas pendientes de atender"
                  : "Seleccione la cita para esta consulta..."}
              </option>
              {citasMostradas.map((c) => {
                const mascotaEncontrada = mascotas.find(
                  (m) => m.idMascota === c.idMascota,
                );
                const nombreMostrar =
                  c.nombreMascota ||
                  mascotaEncontrada?.nombre ||
                  "Paciente sin nombre";
                return (
                  <option
                    key={c.idCita}
                    value={c.idCita ?? undefined}
                    className="bg-marca-beigeclaro2"
                  >
                    {nombreMostrar} · {formatearFecha(c.fecha)}
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

          <div className="col-span-full">
            <PasoTratamiento
              embebido
              onCambio={(t, m) => {
                setLineasTrat(t);
                setLineasMed(m);
              }}
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
              Guardar y ver informe
            </button>
          </div>
        </form>
      )}

      {paso === 2 && idCitaAtendiendo !== null && (
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