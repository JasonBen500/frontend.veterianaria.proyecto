import { PawPrint, type LucideIcon } from "lucide-react";
import BotonesExportar from "../BotonesExportar";
import type { ColumnaExportacion } from "../../utils/exportar";
import { filtrarPorEstado, type FiltroEstado } from "../../utils/estados";
import type { DefinicionReporte } from "../../utils/reportes";

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
        <article className="group relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-1">
            <PawPrint
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-5 -right-4 h-28 w-28 -rotate-12 text-marca-oscuro/5 transition group-hover:rotate-0"
            />

            <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-marca-naranja/30 text-marca-oscuro shadow-sm">
                    <Icono size={26} />
                </div>
                <div className="min-w-0">
                    <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
                        {nombre}
                    </h2>
                    <p className="font-nunito text-sm font-semibold text-marca-oscuro/60">
                        <span className="text-3xl font-extrabold text-marca-oscuro">
                            {contador}
                        </span>{" "}
                        {seleccionados.length === 1 ? "registro" : "registros"}
                    </p>
                    {desglose && (
                        <p className="mt-1 inline-block rounded-full bg-marca-verde/30 px-3 py-0.5 font-nunito text-xs font-bold text-marca-oscuro">
                            {desglose}
                        </p>
                    )}
                </div>
            </div>

            <div className="relative">
                <BotonesExportar
                    titulo={`${reporte.titulo} (${filtro})`}
                    nombreArchivo={`${reporte.nombreArchivo}-${filtro}`}
                    columnas={columnas}
                    datos={seleccionados}
                    deshabilitado={cargando || error}
                />
            </div>
        </article>
    );
}

export default TarjetaReporte;