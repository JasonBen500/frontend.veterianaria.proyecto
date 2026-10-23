import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    X,
    Users,
    PawPrint,
    CalendarDays,
    ClipboardList,
    type LucideIcon,
} from "lucide-react";
import type { Dueno } from "../../types/dueno";
import type { Mascota } from "../../types/mascota";
import type { Cita } from "../../types/cita";
import type { Consulta } from "../../types/consulta";
import { filtrarPorTexto } from "../../utils/busqueda";
import { formatearFecha } from "../../utils/fechas";

interface Props {
    duenos: Dueno[];
    mascotas: Mascota[];
    citas: Cita[];
    consultas: Consulta[];
}

interface Grupo {
    titulo: string;
    ruta: string;
    icono: LucideIcon;
    total: number;
    items: { id: number | null; titulo: string; detalle: string }[];
}

const MAX_POR_GRUPO = 4;

function BusquedaGlobal({ duenos, mascotas, citas, consultas }: Props) {
    const navigate = useNavigate();
    const [texto, setTexto] = useState("");
    const buscando = texto.trim().length >= 2;

    const rDuenos = buscando ? filtrarPorTexto(duenos, texto) : [];
    const rMascotas = buscando ? filtrarPorTexto(mascotas, texto) : [];
    const rCitas = buscando ? filtrarPorTexto(citas, texto) : [];
    const rConsultas = buscando ? filtrarPorTexto(consultas, texto) : [];

    const grupos: Grupo[] = [
        {
            titulo: "Dueños",
            ruta: "/duenos",
            icono: Users,
            total: rDuenos.length,
            items: rDuenos.slice(0, MAX_POR_GRUPO).map((d) => ({
                id: d.idDueno,
                titulo: `${d.nombre} ${d.apellido}`,
                detalle: d.telefono,
            })),
        },
        {
            titulo: "Mascotas",
            ruta: "/mascotas",
            icono: PawPrint,
            total: rMascotas.length,
            items: rMascotas.slice(0, MAX_POR_GRUPO).map((m) => ({
                id: m.idMascota,
                titulo: m.nombre,
                detalle: `${m.especie}${m.nombreDueno ? ` · ${m.nombreDueno}` : ""}`,
            })),
        },
        {
            titulo: "Citas",
            ruta: "/citas",
            icono: CalendarDays,
            total: rCitas.length,
            items: rCitas.slice(0, MAX_POR_GRUPO).map((c) => ({
                id: c.idCita,
                titulo: `Cita #${c.idCita} · ${c.nombreMascota ?? "Sin mascota"}`,
                detalle: `${formatearFecha(c.fecha)} · ${c.motivo}`,
            })),
        },
        {
            titulo: "Consultas",
            ruta: "/consultas",
            icono: ClipboardList,
            total: rConsultas.length,
            items: rConsultas.slice(0, MAX_POR_GRUPO).map((c) => ({
                id: c.idConsulta,
                titulo: `Consulta #${c.idConsulta}`,
                detalle: c.diagnostico || c.sintomas || c.descripcionCita || "",
            })),
        },
    ].filter((g) => g.total > 0);

    const irA = (ruta: string, id?: number | null) => {
        navigate(
            id != null
                ? `${ruta}?detalle=${id}`
                : `${ruta}?buscar=${encodeURIComponent(texto.trim())}`,
        );
    };

    return (
        <div className="relative">
            <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-marca-oscuro/50"
            />
            <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setTexto("")}
                placeholder="Buscar dueños, mascotas, citas o consultas..."
                className="w-full rounded-full border border-marca-cafenigga/30 bg-white py-3 pl-12 pr-12 font-nunito font-semibold text-marca-oscuro shadow-lg shadow-marca-cafenigga/15 transition placeholder:text-marca-oscuro/40 focus:border-marca-naranja focus:outline-none focus:ring-2 focus:ring-marca-naranja"
            />
            {texto && (
                <button
                    type="button"
                    onClick={() => setTexto("")}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-marca-oscuro/50 hover:text-marca-oscuro"
                >
                    <X size={18} />
                </button>
            )}

            {buscando && (
                <div className="absolute z-20 mt-2 max-h-96 w-full overflow-y-auto rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-2 shadow-lg shadow-marca-cafenigga/15">
                    {grupos.length === 0 ? (
                        <p className="p-4 text-center font-nunito text-sm text-marca-oscuro/60">
                            No se encontraron resultados.
                        </p>
                    ) : (
                        grupos.map((g) => (
                            <div key={g.ruta} className="mb-2">
                                <div className="flex items-center justify-between px-3 py-1">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-marca-naranja/30">
                                        <g.icono size={14} />
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => irA(g.ruta)}
                                        className="font-nunito text-xs font-bold text-marca-oscuro underline"
                                    >
                                        Ver todos
                                    </button>
                                </div>
                                {g.items.map((item, i) => (
                                    <button
                                        key={`${g.ruta}-${i}`}
                                        type="button"
                                        onClick={() => irA(g.ruta, item.id)}
                                        className="block w-full rounded-xl px-3 py-2 text-left transition hover:bg-white"
                                    >
                                        <p className="font-nunito text-sm font-bold text-marca-oscuro">
                                            {item.titulo}
                                        </p>
                                        <p className="truncate font-nunito text-xs text-marca-oscuro/60">
                                            {item.detalle}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default BusquedaGlobal;