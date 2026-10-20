import { MapPin, PawPrint, Phone, User } from "lucide-react";
import type { Mascota } from "../../types/mascota";
import type { Dueno } from "../../types/dueno";

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
      <h2 className="mb-3 mt-1 font-nunito text-lg font-extrabold text-marca-oscuro">
        Registros Recientes
      </h2>

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

          return (
            <article
              key={mascota.idMascota}
              className="rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm"
            >
              {/* Mascota */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-marca-naranja/25 text-marca-oscuro">
                  <PawPrint size={22} />
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
              <div className="space-y-2 border-t border-marca-oscuro/10 pt-4 font-nunito text-sm text-marca-oscuro">
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