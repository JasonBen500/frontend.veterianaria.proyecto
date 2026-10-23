import { useEffect, useState } from "react";
import { Download, Printer } from "lucide-react";
import { obtenerHojaCita } from "../services/citaService";
import type { HojaCita } from "../types/hoja";
import { formatearFecha } from "../utils/fechas";
import { generarHojaPdf } from "../utils/hojaPdf";

interface Props {
  idCita: number;
}

const dinero = (valor: number) => `Q${Number(valor).toFixed(2)}`;

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <div>
      <p className="font-nunito text-xs font-extrabold uppercase text-marca-oscuro/60">
        {etiqueta}
      </p>
      <p className="font-nunito text-sm font-semibold text-marca-oscuro">
        {valor || "-"}
      </p>
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
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!hoja) {
    return <p className="text-sm text-marca-oscuro/60">Cargando informe...</p>;
  }

  return (
    <div className="font-nunito">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-marca-oscuro">
            Informe de atención
          </h3>
          <p className="text-sm text-marca-oscuro/60">Cita #{hoja.idCita}</p>
        </div>
        <p className="text-sm font-bold text-marca-oscuro">
          {formatearFecha(hoja.fecha)}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Dato
          etiqueta="Dueño"
          valor={
            hoja.nombreDueno
              ? `${hoja.nombreDueno}${hoja.telefonoDueno ? ` · ${hoja.telefonoDueno}` : ""}`
              : undefined
          }
        />
        <Dato
          etiqueta="Mascota"
          valor={
            hoja.nombreMascota
              ? `${hoja.nombreMascota}${hoja.especieMascota ? ` (${hoja.especieMascota})` : ""}`
              : undefined
          }
        />
        <Dato
          etiqueta="Médico"
          valor={
            hoja.nombreMedico
              ? `${hoja.nombreMedico}${hoja.especialidadMedico ? ` · ${hoja.especialidadMedico}` : ""}`
              : undefined
          }
        />
        <Dato etiqueta="Motivo" valor={hoja.motivo} />
        <Dato etiqueta="Síntomas" valor={hoja.sintomas} />
        <Dato etiqueta="Diagnóstico" valor={hoja.diagnostico} />
      </div>

      <table className="w-full border-collapse overflow-hidden rounded-lg text-sm">
        <thead>
          <tr className="bg-marca-oscuro text-left text-marca-blanco">
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Descripción</th>
            <th className="px-3 py-2 text-right">Cant.</th>
            <th className="px-3 py-2 text-right">Precio</th>
            <th className="px-3 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {hoja.lineas.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-3 py-3 text-center text-marca-oscuro/60"
              >
                Sin tratamientos ni medicamentos registrados
              </td>
            </tr>
          ) : (
            hoja.lineas.map((l, i) => (
              <tr key={i} className="border-b border-marca-oscuro/10">
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

      <p className="mt-3 text-right text-lg font-extrabold text-marca-oscuro">
        Total: {dinero(hoja.total)}
      </p>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => generarHojaPdf(hoja, "abrir")}
          className="flex items-center gap-2 rounded-full border border-marca-oscuro px-4 py-2 text-sm font-bold text-marca-oscuro transition hover:bg-marca-beigeclaro2"
        >
          <Printer size={16} />
          Imprimir
        </button>
        <button
          type="button"
          onClick={() => generarHojaPdf(hoja, "descargar")}
          className="flex items-center gap-2 rounded-full bg-marca-oscuro px-4 py-2 text-sm font-bold text-marca-blanco transition hover:opacity-90"
        >
          <Download size={16} />
          Descargar PDF
        </button>
      </div>
    </div>
  );
}

export default HojaCliente;