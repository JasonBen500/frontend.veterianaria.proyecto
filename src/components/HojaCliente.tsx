import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Download,
  FileText,
  PawPrint,
  Printer,
  Stethoscope,
  Thermometer,
  UserRound,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import { obtenerHojaCita } from "../services/citaService";
import type { HojaCita } from "../types/hoja";
import { formatearFecha } from "../utils/fechas";
import { generarHojaPdf } from "../utils/hojaPdf";

interface Props {
  idCita: number;
}

const dinero = (valor: number) => `Q${Number(valor).toFixed(2)}`;

function Dato({
  etiqueta,
  valor,
  icono: Icono,
}: {
  etiqueta: string;
  valor?: string;
  icono: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-marca-oscuro/10 bg-white p-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-marca-naranja/30 text-marca-oscuro">
        <Icono size={18} />
      </div>
      <div className="min-w-0">
        <p className="font-nunito text-xs font-extrabold uppercase tracking-wide text-marca-oscuro/60">
          {etiqueta}
        </p>
        <p className="break-words font-nunito text-sm font-bold text-marca-oscuro">
          {valor || "-"}
        </p>
      </div>
    </div>
  );
}

function HojaCliente({ idCita }: Props) {
  const [hoja, setHoja] = useState<HojaCita | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerHojaCita(idCita)
      .then((r) => setHoja(r.data))
      .catch(() => setError("No se pudo cargar el informe"));
  }, [idCita]);

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center font-nunito text-sm font-bold text-red-700"
      >
        {error}
      </p>
    );
  }

  if (!hoja) {
    return (
      <p className="flex items-center justify-center gap-2 p-6 font-nunito text-sm font-bold text-marca-oscuro/60">
        <PawPrint size={18} className="animate-pulse" />
        Cargando informe...
      </p>
    );
  }

  return (
    <div className="space-y-5 font-nunito">
      {/* Encabezado del informe */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-marca-verde/25 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-marca-oscuro text-white shadow-md">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-marca-oscuro">
              Informe de atención
            </h3>
            <p className="text-sm font-bold text-marca-oscuro/60">
              {hoja.nombreMascota ?? "Paciente"}
            </p>
          </div>
        </div>
        <p className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-marca-oscuro shadow-sm">
          <CalendarDays size={16} />
          {formatearFecha(hoja.fecha)}
        </p>
      </div>

      {/* Datos de la atención */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Dato
          etiqueta="Dueño"
          icono={UserRound}
          valor={
            hoja.nombreDueno
              ? `${hoja.nombreDueno}${hoja.telefonoDueno ? ` · ${hoja.telefonoDueno}` : ""}`
              : undefined
          }
        />
        <Dato
          etiqueta="Mascota"
          icono={PawPrint}
          valor={
            hoja.nombreMascota
              ? `${hoja.nombreMascota}${hoja.especieMascota ? ` (${hoja.especieMascota})` : ""}`
              : undefined
          }
        />
        <Dato
          etiqueta="Médico"
          icono={Stethoscope}
          valor={
            hoja.nombreMedico
              ? `${hoja.nombreMedico}${hoja.especialidadMedico ? ` · ${hoja.especialidadMedico}` : ""}`
              : undefined
          }
        />
        <Dato etiqueta="Motivo" icono={ClipboardList} valor={hoja.motivo} />
        <Dato etiqueta="Síntomas" icono={Thermometer} valor={hoja.sintomas} />
        <Dato
          etiqueta="Diagnóstico"
          icono={HeartPulse}
          valor={hoja.diagnostico}
        />
      </div>

      {/* Tratamientos y medicamentos */}
      <div className="overflow-x-auto rounded-2xl border border-marca-oscuro/10 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-marca-oscuro text-left text-white">
              <th className="px-3 py-2.5 font-extrabold">Tipo</th>
              <th className="px-3 py-2.5 font-extrabold">Descripción</th>
              <th className="px-3 py-2.5 text-right font-extrabold">Cant.</th>
              <th className="px-3 py-2.5 text-right font-extrabold">Precio</th>
              <th className="px-3 py-2.5 text-right font-extrabold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {hoja.lineas.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-5 text-center font-bold text-marca-oscuro/60"
                >
                  Sin tratamientos ni medicamentos registrados
                </td>
              </tr>
            ) : (
              hoja.lineas.map((l, i) => (
                <tr
                  key={i}
                  className="font-semibold text-marca-oscuro odd:bg-marca-beigeclaro2 even:bg-white"
                >
                  <td className="px-3 py-2">{l.tipo}</td>
                  <td className="px-3 py-2">{l.descripcion}</td>
                  <td className="px-3 py-2 text-right">{l.cantidad}</td>
                  <td className="px-3 py-2 text-right">
                    {dinero(l.precioUnitario)}
                  </td>
                  <td className="px-3 py-2 text-right">{dinero(l.subtotal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <p className="rounded-full bg-marca-naranja px-6 py-2 text-lg font-extrabold text-marca-oscuro shadow-md">
          Total: {dinero(hoja.total)}
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-marca-oscuro/10 pt-4">
        <button
          type="button"
          onClick={() => generarHojaPdf(hoja, "abrir")}
          className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-5 py-2 text-sm font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
        >
          <Printer size={16} />
          Imprimir
        </button>
        <button
          type="button"
          onClick={() => generarHojaPdf(hoja, "descargar")}
          className="inline-flex items-center gap-2 rounded-full bg-marca-oscuro px-5 py-2 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
        >
          <Download size={16} />
          Descargar PDF
        </button>
      </div>
    </div>
  );
}

export default HojaCliente;