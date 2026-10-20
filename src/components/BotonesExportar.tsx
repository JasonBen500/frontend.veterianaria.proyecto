import { Eye, FileSpreadsheet, FileText } from "lucide-react";
import {
    exportarTablaExcel,
    exportarTablaPDF,
    type ColumnaExportacion,
} from "../utiils/exportar";

interface Props<T> {
    deshabilitado?: boolean;
    titulo: string;
    nombreArchivo: string;
    columnas: ColumnaExportacion<T>[];
    datos: T[];
}

const estiloBoton =
  "inline-flex items-center gap-1.5 rounded-full border border-marca-oscuro px-4 py-2 font-nunito text-xs font-bold text-marca-oscuro transition-colors hover:bg-marca-oscuro hover:text-white disabled:pointer-events-none disabled:opacity-40";

function BotonesExportar<T>({
    titulo,
    nombreArchivo,
    columnas,
    datos,
    deshabilitado = false,
}: Props<T>) {
    const config = { tituloPrincipal: titulo, nombreArchivo };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <button
                type="button"
                disabled={deshabilitado}
                onClick={() =>
                    exportarTablaPDF({ ...config, accionPdf: "descargar" }, columnas, datos)
                }
                className={estiloBoton}
            >
                <FileText size={14} />
                PDF
            </button>

            <button
                type="button"
                disabled={deshabilitado}
                onClick={() => exportarTablaExcel(config, columnas, datos)}
                className={estiloBoton}
            >
                <FileSpreadsheet size={14} />
                Excel
            </button>

            <button
                type="button"
                disabled={deshabilitado}
                onClick={() =>
                    exportarTablaPDF({ ...config, accionPdf: "abrir" }, columnas, datos)
                }
                className={estiloBoton}
            >
                <Eye size={14} />
                Ver PDF
            </button>
        </div>
    );
}

export default BotonesExportar;