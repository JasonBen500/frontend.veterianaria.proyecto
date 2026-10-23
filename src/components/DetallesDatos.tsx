import type { ReactNode } from "react";
import { useDatosDetalle } from "../hooks/useDetalleRegistro";
import BotonesExportar from "./BotonesExportar";

export type CampoDetalle = {
    etiqueta: string;
    clave?: string;
    formatear?: (registro: any) => ReactNode;
};

const renderBadgeEstado = (estado: boolean, textoTrue: string, textoFalse: string) => {
    return estado ? (
        <span className="text-green-700 bg-green-100 px-2.5 py-1 rounded-md text-sm font-bold">{textoTrue}</span>
    ) : (
        <span className="text-red-700 bg-red-100 px-2.5 py-1 rounded-md text-sm font-bold">{textoFalse}</span>
    );
};

const CONFIGURACIONES: Record<string, CampoDetalle[]> = {
    mascotas: [
        { etiqueta: "Nombre", clave: "nombre" },
        { etiqueta: "Especie", clave: "especie", formatear: (r) => <span className="capitalize">{r.especie}</span> },
        { etiqueta: "Edad", formatear: (r) => `${r.edad} años` },
        { etiqueta: "Peso", formatear: (r) => `${r.peso} kg` },
        { etiqueta: "Dueño", formatear: (r) => r.nombreDueno ? `${r.idDueno}. ${r.nombreDueno}` : `ID: ${r.idDueno}` },
        { etiqueta: "Estado", formatear: (r) => renderBadgeEstado(r.estado, "Activo", "Inactivo") },
    ],
    duenos: [
        { etiqueta: "Nombre Completo", formatear: (r) => `${r.idDueno}. ${r.nombre} ${r.apellido}` },
        { etiqueta: "Teléfono", clave: "telefono" },
        { etiqueta: "Dirección", clave: "direccion" },
        { etiqueta: "Estado", formatear: (r) => renderBadgeEstado(r.estado, "Activo", "Inactivo") },
    ],
    citas: [
        { etiqueta: "Fecha", formatear: (r) => new Date(r.fecha).toLocaleDateString() },
        { etiqueta: "Total", formatear: (r) => `Q ${Number(r.total).toFixed(2)}` },
        { etiqueta: "Motivo", clave: "motivo" },
        { etiqueta: "Paciente", formatear: (r) => r.nombreMascota || `ID: ${r.idMascota}` },
        { etiqueta: "Médico", formatear: (r) => r.nombreMedico || `ID: ${r.idMedico}` },
        { etiqueta: "Usuario", formatear: (r) => r.nombreUsuario || `ID: ${r.idUsuario}` },
        { etiqueta: "Estado", formatear: (r) => renderBadgeEstado(r.estado, "Completada", "Pendiente / Cancelada") },
    ],
    detallecita: [
        { etiqueta: "Cita Asociada", formatear: (r) => r.descripcionCita || `Cita #${r.idCita}` },
        { etiqueta: "Precio Aplicado", formatear: (r) => `Q ${Number(r.precioAplicado).toFixed(2)}` },
        { etiqueta: "Tratamiento", formatear: (r) => r.nombreTratamiento || (r.idTratamiento ? `ID: ${r.idTratamiento}` : "N/A") },
        { etiqueta: "Medicamento", formatear: (r) => r.nombreMedicamento || (r.idMedicamento ? `ID: ${r.idMedicamento}` : "N/A") },
        { etiqueta: "Estado", formatear: (r) => renderBadgeEstado(r.estado, "Activo", "Inactivo") },
    ],
};


// COMPONENTE PRINCIPAL
export interface VistaDetallesProps {
    entity: "mascotas" | "duenos" | "citas" | "detallecita";
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
            case "detallecita": return datos.detalleCita[0];
            default: return null;
        }
    };

    const registro = obtenerRegistro();
    const configuracion = CONFIGURACIONES[entity];

    if (loading) return <div className="p-4 text-marca-oscuro font-bold animate-pulse text-center">Cargando información...</div>;
    if (error) return <div className="p-4 text-red-500 font-bold bg-red-50 rounded-lg text-center">{error}</div>;
    if (!registro) return <div className="p-4 text-gray-500 text-center">No se encontraron datos para este registro.</div>;

    // DISEÑO HTML
    return (
        <div className="space-y-4">

            {/* Contenedor de la información */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-white p-6 rounded-xl border border-marca-oscuro/5">
                {configuracion.map((campo, index) => {

                    const valorFinal = campo.formatear ? campo.formatear(registro) : (registro as Record<string, any>)[campo.clave!];

                    return (
                        <div key={index} className="border-b border-gray-100 pb-3 last:border-0 sm:last:border-0">
                            <dt className="text-sm font-bold text-marca-oscuro/60 mb-1">
                                {campo.etiqueta}
                            </dt>
                            <dd className="font-nunito text-base text-marca-oscuro font-medium">
                                {valorFinal !== null && valorFinal !== undefined && valorFinal !== ""
                                    ? valorFinal
                                    : <span className="text-gray-400 italic">No registrado</span>}
                            </dd>
                        </div>
                    );
                })}
            </dl>
             {configReporte && (
                <div className="flex justify-end border-b border-gray-100 pb-3 mt-5">
                    <BotonesExportar {...configReporte} datos={[registro]} />
                </div>
            )}
        </div>
    );
};