import { MapPin, PawPrint, Phone, User, Dog, Cat, Heart, type LucideIcon } from "lucide-react";
import type { Mascota } from "../../types/mascota";
import type { Dueno } from "../../types/dueno";

function estiloEspecie(especie?: string | null): { Icono: LucideIcon; color: string } {
  const texto = String(especie ?? "").toLowerCase();
  if (texto.includes("perro") || texto.includes("canino")) {
    return { Icono: Dog, color: "bg-marca-verde/40" };
  }
  if (texto.includes("gato") || texto.includes("felino")) {
    return { Icono: Cat, color: "bg-marca-naranja/30" };
  }
  return { Icono: PawPrint, color: "bg-marca-coral/25" };
}


interface Props {
  mascotas: Mascota[];
  duenos: Dueno[];
  cargando: boolean;
  error: boolean;
}

function RegistrosRecientes({ mascotas, duenos, cargando, error }: Props) {
  // Mapa: idDueno -> dueño, para encontrar sus datos rápido
  const duenoPorId = new Map<number | null, Dueno>(
    duenos.map((d): [number | null, Dueno] => [d.idDueno, d]),
  );

  // Las 3 mascotas más recientes (id más alto = creada más tarde)
  const recientes = [...mascotas]
    .sort((a, b) => (b.idMascota ?? 0) - (a.idMascota ?? 0))
    .slice(0, 3);

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-coral/25 text-marca-oscuro">
          <Heart size={20} />
        </div>
        <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
          Registros Recientes
        </h2>
      </div>

      {cargando && (
        <p className="font-nunito text-sm text-marca-oscuro/60">Cargando…</p>
      )}

      {error && (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          No se pudieron cargar los registros.
        </p>
      )}

      {!cargando && !error && recientes.length === 0 && (
        <p className="font-nunito text-sm text-marca-oscuro/60">
          Aún no hay registros.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {recientes.map((mascota) => {
          const dueno = duenoPorId.get(mascota.idDueno);
          const nombreDueno = dueno
            ? `${dueno.nombre} ${dueno.apellido}`
            : (mascota.nombreDueno ?? "—");
          const { Icono, color } = estiloEspecie(mascota.especie);

          return (
            <article
              key={mascota.idMascota}
              className="group relative overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15 transition hover:-translate-y-1"
            >
              <PawPrint
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 rotate-12 text-marca-oscuro/5 transition group-hover:rotate-0"
              />

              {/* Mascota */}
              <div className="relative mb-4 flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-marca-oscuro shadow-sm ${color}`}
                >
                  <Icono size={28} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-nunito text-lg font-extrabold text-marca-oscuro">
                    {mascota.nombre}
                  </p>
                  <p className="truncate font-nunito text-sm font-medium text-marca-oscuro/60">
                    {mascota.especie} · {mascota.edad} años · {mascota.peso} kg
                  </p>
                </div>
              </div>

              {/* Dueño */}
              <div className="relative space-y-2 border-t border-marca-oscuro/10 pt-4 font-nunito text-sm text-marca-oscuro">
                <p className="flex items-center gap-2">
                  <User size={16} className="shrink-0 text-marca-oscuro/60" />
                  <span className="truncate font-semibold">{nombreDueno}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="shrink-0 text-marca-oscuro/60" />
                  <span className="truncate">{dueno?.telefono || "—"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="shrink-0 text-marca-oscuro/60" />
                  <span className="truncate">{dueno?.direccion || "—"}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RegistrosRecientes;