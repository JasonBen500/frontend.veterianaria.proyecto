import type { LucideIcon } from "lucide-react";
import BotonesExportar from "../BotonesExportar";
import type { ColumnaExportacion } from "../../utiils/exportar";
import { filtrarPorEstado, type FiltroEstado } from "../../utiils/estados";
import type { DefinicionReporte } from "../../utiils/reportes";

interface Props<T extends { estado: boolean }> {
    nombre: string;
    icono: LucideIcon;
    reporte: DefinicionReporte<T>;
    registros: T[];
    filtro: FiltroEstado;
    cargando: boolean;
    error: boolean;
}

function TarjetaReporte<T extends { estado: boolean }>({
    nombre,
    icono: Icono,
    reporte,
    registros,
    filtro,
    cargando,
    error,
}: Props<T>) {
    const seleccionados = filtrarPorEstado(registros, filtro);
    const activos = registros.filter((r) => r.estado).length;
    const inactivos = registros.length - activos;

    // Con "todos" se agrega una columna para distinguir activos de inactivos
    const columnas: ColumnaExportacion<T>[] =
        filtro === "todos"
            ? [
                ...reporte.columnas,
                {
                    encabezado: "Estado",
                    llavePropiedad: "estado",
                    formato: (valor) => (valor ? "Activo" : "Inactivo"),
                },
            ]
            : reporte.columnas;

    const contador = cargando ? "…" : error ? "—" : seleccionados.length;
    const desglose =
        cargando || error
            ? ""
            : `${activos} ${activos === 1 ? "activo" : "activos"} · ${inactivos} ${inactivos === 1 ? "inactivo" : "inactivos"
            }`;

    return (
        <article className="flex flex-col justify-between gap-5 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-marca-naranja/25 text-marca-oscuro">
                    <Icono size={24} />
                </div>
                <div>
                    <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
                        {nombre}
                    </h2>
                    <p className="font-nunito text-sm font-semibold text-marca-oscuro/60">
                        <span className="text-2xl font-extrabold text-marca-oscuro">
                            {contador}
                        </span>{" "}
                        {seleccionados.length === 1 ? "registro" : "registros"}
                    </p>
                    <p className="font-nunito text-xs font-semibold text-marca-oscuro/60">
                        {desglose}
                    </p>
                </div>
            </div>

            <BotonesExportar
                titulo={`${reporte.titulo} (${filtro})`}
                nombreArchivo={`${reporte.nombreArchivo}-${filtro}`}
                columnas={columnas}
                datos={seleccionados}
                deshabilitado={cargando || error}
            />
        </article>
    );
}

export default TarjetaReporte;