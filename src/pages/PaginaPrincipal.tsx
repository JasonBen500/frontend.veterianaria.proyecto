import { Link } from "react-router-dom";
import {
  Users,
  PawPrint,
  CircleCheck,
  Clock,
  Plus,
  ChartColumn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import TarjetaContador from "../components/dashboard/TarjetaContador";
import logazul from "../assets/images/LogoAzul.png";
import { useContadores } from "../hooks/useContadores";
import ProximasCitas from "../components/dashboard/ProximasCitas";
import { useDatosInicio } from "../hooks/useDatosInicio";
import Calendario from "../components/dashboard/Calendario";

function PaginaPrincipal() {
  const { usuario } = useAuth();

  const { contadores, cargando, error } = useContadores();
  const datos = useDatosInicio();

  // Mientras carga muestra "…"; si el servidor falla, "—"
  const mostrar = (n?: number) =>
    cargando ? "…" : error || n === undefined ? "—" : n;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10 bg-marca-beige-claro">
      {/* Saludo y Logo (Logo a la derecha) */}
      <div className="flex items-center justify-between border-b-1 border-marca-grisclaro">
        <h1 className="text-4xl font-nunito font-extrabold text-marca-oscuro md:text-5xl">
          Bienvenido, {usuario?.nombre}
        </h1>
        {/* Logo - Ajusta el src y el tamaño (h- y w-) según lo que necesites */}
        <img
          src={logazul}
          alt="Logo de la clínica"
          className="w-40 mb-4"
        />
      </div>

      {/* Botones principales */}
      <div className="flex flex-wrap gap-4">
        <Link
          to="/registro"
          className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-3 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
        >
          <Plus size={20} />
          Nuevo Registro
        </Link>
        <Link
          to="/reportes"
          className="font-nunito inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-6 py-3 font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
        >
          <ChartColumn size={20} />
          Reportes Generales
        </Link>
      </div>

      {/* Contadores */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaContador
          titulo="Dueños"
          valor={mostrar(contadores?.duenos)}
          icono={Users}
          colorIcono="bg-marca-grisclaro/15 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Mascotas"
          valor={mostrar(contadores?.mascotas)}
          icono={PawPrint}
          colorIcono="bg-marca-azulmarino/25 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas atendidas"
          valor={mostrar(contadores?.citasAtendidas)}
          icono={CircleCheck}
          colorIcono="bg-marca-grisclaro/30 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas pendientes"
          valor={mostrar(contadores?.citasPendientes)}
          icono={Clock}
          colorIcono="bg-marca-azulmarino/20 text-marca-oscuro"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Zona de gráficas (Ocupa 2 de las 3 columnas en pantallas grandes) */}
        <section className="min-h-80 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-nunito font-extrabold text-marca-oscuro">Estadísticas</h2>
          {/* Aquí irán las gráficas */}
        </section>

        {/* Zona de calendario (Ocupa 1 columna) */}
        <Calendario citas={datos.citas} />

        <ProximasCitas
          citas={datos.citas}
          cargando={datos.cargando}
          error={datos.error}
        />
      </div>

      <h2 className="text-lg font-nunito font-extrabold text-marca-oscuro mb-3 mt-1">
        Registros Recientes
      </h2>
      <div className="grid gap-6 lg:grid-cols-3">

        <section className="min-h-80 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

          {/* Aquí irá el calendario */}
        </section>

        <section className="min-h-80 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

          {/* Aquí irá el calendario */}
        </section>

        <section className="min-h-80 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

          {/* Aquí irá el calendario */}
        </section>


      </div>

    </div>
  );
}

export default PaginaPrincipal;