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
import { calcularContadores } from "../utiils/contadores";
import ProximasCitas from "../components/dashboard/ProximasCitas";
import { useDatosInicio } from "../hooks/useDatosInicio";
import Calendario from "../components/dashboard/Calendario";
import RegistrosRecientes from "../components/dashboard/RegistrosRecientes";
import GraficaCitasSemana from "../components/dashboard/GraficaCitasSemana";

function PaginaPrincipal() {
  const { usuario } = useAuth();
  const datos = useDatosInicio();
  const { cargando, error } = datos;
  const contadores = calcularContadores(datos);

  // Mientras carga muestra "…"; si el servidor falla, "—"
  const mostrar = (n?: number) =>
    cargando ? "…" : error || n === undefined ? "—" : n;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10 bg-marca-beige-claro">

      <div className="flex items-center justify-between min-h-30 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">
        <h1 className="text-4xl font-nunito font-extrabold text-marca-oscuro md:text-5xl">
          Bienvenido {usuario?.nombre}
        </h1>

        <img
          src={logazul}
          alt="Logo de la clínica"
          className="w-30"
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
          valor={mostrar(contadores.duenos)}
          icono={Users}
          colorIcono="bg-marca-grisclaro/15 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Mascotas"
          valor={mostrar(contadores.mascotas)}
          icono={PawPrint}
          colorIcono="bg-marca-azulmarino/25 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas atendidas"
          valor={mostrar(contadores.citasAtendidas)}
          icono={CircleCheck}
          colorIcono="bg-marca-grisclaro/30 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas pendientes"
          valor={mostrar(contadores.citasPendientes)}
          icono={Clock}
          colorIcono="bg-marca-azulmarino/20 text-marca-oscuro"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Calendario citas={datos.citas} />

        <ProximasCitas
          citas={datos.citas}
          cargando={datos.cargando}
          error={datos.error}
        />
      </div>

      <div className="grid gap-6 ">
        <section className="min-w-0 min-h-80 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-nunito font-extrabold text-marca-oscuro">Estadísticas</h2>
          <GraficaCitasSemana
            citas={datos.citas}
            cargando={datos.cargando}
            error={datos.error}
          />
        </section>

       
        
      </div>

      <RegistrosRecientes
        mascotas={datos.mascotas}
        duenos={datos.duenos}
        cargando={datos.cargando}
        error={datos.error}
      />

    </div>


  );
}

export default PaginaPrincipal;