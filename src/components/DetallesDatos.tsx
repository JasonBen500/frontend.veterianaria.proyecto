import type { ReactNode } from "react";
import {
    Ban,
    Banknote,
    Cake,
    CalendarDays,
    CalendarHeart,
    CircleCheck,
    ClipboardList,
    Dog,
    MapPin,
    PawPrint,
    Phone,
    Pill,
    Stethoscope,
    Syringe,
    User,
    UserCog,
    UserRound,
    Weight,
    Thermometer,
    type LucideIcon,
} from "lucide-react";
import { useDatosDetalle } from "../hooks/useDetalleRegistro";
import { formatearFecha } from "../utils/fechas";
import BotonesExportar from "./BotonesExportar";

export type CampoDetalle = {
    etiqueta: string;
    icono?: LucideIcon;
    clave?: string;
    formatear?: (registro: any) => ReactNode;
};

const renderBadgeEstado = (estado: boolean, textoTrue: string, textoFalse: string) => {
    return estado ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-marca-verde/30 px-3 py-1 text-sm font-extrabold text-marca-oscuro">
            <CircleCheck size={14} />
            {textoTrue}
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-marca-vino/15 px-3 py-1 text-sm font-extrabold text-marca-vino">
            <Ban size={14} />
            {textoFalse}
        </span>
    );
};

const CONFIGURACIONES: Record<string, CampoDetalle[]> = {
    mascotas: [
        { etiqueta: "Nombre", icono: PawPrint, clave: "nombre" },
        { etiqueta: "Especie", icono: Dog, clave: "especie", formatear: (r) => <span className="capitalize">{r.especie}</span> },
        { etiqueta: "Edad", icono: Cake, formatear: (r) => `${r.edad} meses` },
        { etiqueta: "Peso", icono: Weight, formatear: (r) => `${r.peso} kg` },
        { etiqueta: "Dueño", icono: UserRound, formatear: (r) => r.nombreDueno || "—" },
        { etiqueta: "Estado", icono: CircleCheck, formatear: (r) => renderBadgeEstado(r.estado, "Activo", "Inactivo") },
    ],
    duenos: [
        { etiqueta: "Nombre Completo", icono: User, formatear: (r) => `${r.nombre} ${r.apellido}` },
        { etiqueta: "Teléfono", icono: Phone, clave: "telefono" },
        { etiqueta: "Dirección", icono: MapPin, clave: "direccion" },
        { etiqueta: "Estado", icono: CircleCheck, formatear: (r) => renderBadgeEstado(r.estado, "Activo", "Inactivo") },
    ],
    citas: [
        { etiqueta: "Fecha", icono: CalendarDays, formatear: (r) => formatearFecha(r.fecha) },
        { etiqueta: "Total", icono: Banknote, formatear: (r) => `Q ${Number(r.total).toFixed(2)}` },
        { etiqueta: "Motivo", icono: ClipboardList, clave: "motivo" },
        { etiqueta: "Paciente", icono: PawPrint, formatear: (r) => r.nombreMascota || "—" },
        { etiqueta: "Médico", icono: Stethoscope, formatear: (r) => r.nombreMedico || "—" },
        { etiqueta: "Usuario", icono: UserCog, formatear: (r) => r.nombreUsuario || "—" },
        { etiqueta: "Estado", icono: CircleCheck, formatear: (r) => renderBadgeEstado(r.estado, "Activa", "Anulada") },
    ],
    detallecita: [
        { etiqueta: "Cita Asociada", icono: CalendarHeart, formatear: (r) => r.descripcionCita || "—" },
        { etiqueta: "Precio Aplicado", icono: Banknote, formatear: (r) => `Q ${Number(r.precioAplicado).toFixed(2)}` },
        { etiqueta: "Tratamiento", icono: Syringe, formatear: (r) => r.nombreTratamiento || "N/A" },
        { etiqueta: "Medicamento", icono: Pill, formatear: (r) => r.nombreMedicamento || "N/A" },
        { etiqueta: "Estado", icono: CircleCheck, formatear: (r) => renderBadgeEstado(r.estado, "Activo", "Inactivo") },
    ],
    consultas: [
        { etiqueta: "Cita Asociada", icono: CalendarHeart, formatear: (r) => r.descripcionCita || "—" },
        { etiqueta: "Síntomas", icono: Thermometer, clave: "sintomas" },
        { etiqueta: "Diagnóstico", icono: ClipboardList, clave: "diagnostico" },
        { etiqueta: "Estado", icono: CircleCheck, formatear: (r) => renderBadgeEstado(r.estado, "Activa", "Anulada") },
    ],
};


// COMPONENTE PRINCIPAL
export interface VistaDetallesProps {
    entity: "mascotas" | "duenos" | "citas" | "detallecita" | "consultas";
    id: number;
    configReporte?: any;
}

export const VistaDetallesEntidad = ({ entity, id, configReporte }: VistaDetallesProps) => {
    const { datos, loading, error } = useDatosDetalle(entity, id);

    const obtenerRegistro = () => {
        switch (entity) {
            case "mascotas": return datos.mascotas[0];
            case "duenos": return datos.duenos[0];
            case "citas": return datos.citas[0];
            case "consultas": return datos.consultas[0];
            case "detallecita": return datos.detalleCita[0];
            default: return null;
        }
    };

    const registro = obtenerRegistro();
    const configuracion = CONFIGURACIONES[entity];

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 p-6 text-center font-nunito font-bold text-marca-oscuro">
                <PawPrint size={20} className="animate-pulse" />
                Cargando información...
            </div>
        );
    }
    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center font-nunito font-bold text-red-700">
                {error}
            </div>
        );
    }
    if (!registro) {
        return (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
                <Dog size={40} className="text-marca-verde" />
                <p className="font-nunito text-sm font-bold text-marca-oscuro/60">
                    No se encontraron datos para este registro.
                </p>
            </div>
        );
    }

    // DISEÑO HTML
    return (
        <div className="space-y-5">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {configuracion.map((campo, index) => {
                    const Icono = campo.icono ?? PawPrint;
                    const valorFinal = campo.formatear ? campo.formatear(registro) : (registro as Record<string, any>)[campo.clave!];

                    return (
                        <div
                            key={index}
                            className="flex items-start gap-3 rounded-2xl border border-marca-oscuro/10 bg-white p-4 shadow-sm"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-marca-naranja/30 text-marca-oscuro">
                                <Icono size={20} />
                            </div>
                            <div className="min-w-0">
                                <dt className="font-nunito text-xs font-extrabold uppercase tracking-wide text-marca-oscuro/60">
                                    {campo.etiqueta}
                                </dt>
                                <dd className="mt-0.5 break-words font-nunito text-base font-bold text-marca-oscuro">
                                    {valorFinal !== null && valorFinal !== undefined && valorFinal !== ""
                                        ? valorFinal
                                        : <span className="font-medium italic text-marca-oscuro/40">No registrado</span>}
                                </dd>
                            </div>
                        </div>
                    );
                })}
            </dl>

            {configReporte && (
                <div className="flex items-center justify-end gap-3 border-t border-marca-oscuro/10 pt-4">
                    <span className="font-nunito text-sm font-bold text-marca-cafenigga">
                        Exportar:
                    </span>
                    <BotonesExportar {...configReporte} datos={[registro]} />
                </div>
            )}
        </div>
    );
};