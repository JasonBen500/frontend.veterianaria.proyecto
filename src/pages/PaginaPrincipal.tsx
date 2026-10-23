import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  PawPrint,
  CircleCheck,
  Clock,
  Plus,
  ChartColumn,
  Stethoscope,
  HeartPulse,
  Bone,
  Dog,
  Cat,
  Syringe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import TarjetaContador from "../components/dashboard/TarjetaContador";
import logazul from "../assets/images/LogoAzul.png";
import { calcularContadores } from "../utils/contadores";
import ProximasCitas from "../components/dashboard/ProximasCitas";
import { useDatosInicio } from "../hooks/useDatosInicio";
import Calendario from "../components/dashboard/Calendario";
import RegistrosRecientes from "../components/dashboard/RegistrosRecientes";
import GraficaCitasSemana from "../components/dashboard/GraficaCitasSemana";
import BusquedaGlobal from "../components/dashboard/BusquedaGlobal";
import RegistroWizard from "./RegistroWizard";
import ModalConsulta from "../components/ModalConsulta";

function PaginaPrincipal() {
  const { usuario } = useAuth();
  const datos = useDatosInicio();
  const { cargando, error } = datos;
  const contadores = calcularContadores(datos);
  const [registroAbierto, setRegistroAbierto] = useState(false);
  const [modalConsultaAbierto, setModalConsultaAbierto] = useState(false);

  // Mientras carga muestra "…"; si el servidor falla, "—"
  const mostrar = (n?: number) =>
    cargando ? "…" : error || n === undefined ? "—" : n;

  const fechaHoy = new Date().toLocaleDateString("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 overflow-hidden bg-marca-beige-claro p-6 md:p-10">
      {/* Huellas decorativas de fondo */}
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute left-2 top-[34rem] hidden h-24 w-24 -rotate-12 text-marca-oscuro/5 lg:block"
      />
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-[58rem] hidden h-32 w-32 rotate-12 text-marca-verde/10 lg:block"
      />
      <Bone
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-3 hidden h-20 w-20 rotate-45 text-marca-naranja/15 lg:block"
      />

      {/* Encabezado de bienvenida */}
      <header className="relative overflow-hidden rounded-3xl border border-marca-oscuro/10 bg-marca-oscuro p-6 shadow-lg shadow-marca-cafenigga/15 md:p-8">
        <PawPrint
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rotate-12 text-white/5"
        />
        <Dog
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-56 hidden h-20 w-20 -rotate-6 text-marca-verde/25 md:block"
        />
        <Cat
          aria-hidden="true"
          className="pointer-events-none absolute right-36 top-3 hidden h-16 w-16 rotate-6 text-marca-naranja/25 md:block"
        />
        <Bone
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 left-1/2 h-16 w-16 -rotate-12 text-white/5"
        />

        <div className="relative flex items-center justify-between gap-6">
          <div className="min-w-0 space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-4 py-1.5 font-nunito text-xs font-extrabold uppercase tracking-wide text-marca-oscuro">
              <HeartPulse size={16} />
              Clínica veterinaria
            </span>

            <h1 className="font-nunito text-3xl font-extrabold text-white md:text-5xl">
              Bienvenido {usuario?.nombre}
            </h1>

            <p className="font-nunito text-base font-semibold text-white/70">
              Sus patas en buenas manos.
            </p>

            <p className="inline-block rounded-full bg-white/10 px-4 py-1 font-nunito text-sm font-bold text-marca-beigeclaro first-letter:uppercase">
              {fechaHoy}
            </p>
          </div>

          <div className="hidden shrink-0 rounded-3xl bg-marca-beigeclaro2 p-4 shadow-lg shadow-marca-azulmarino/30 sm:block">
            <img
              src={logazul}
              alt="Logo de la clínica"
              className="w-28 md:w-32"
            />
          </div>
        </div>
      </header>

      <BusquedaGlobal
        duenos={datos.duenos}
        mascotas={datos.mascotas}
        citas={datos.citas}
        consultas={datos.consultas}
      />

      {/* Acciones rápidas */}
      <section className="rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-coral/25 text-marca-oscuro">
            <Syringe size={20} />
          </div>
          <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
            ¿Qué haremos hoy?
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setModalConsultaAbierto(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-marca-oscuro px-6 py-3 font-nunito font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-marca-oscuro/90 sm:w-auto"
          >
            <Stethoscope size={22} />
            Iniciar Consulta
          </button>

          <button
            type="button"
            onClick={() => setRegistroAbierto(true)}
            className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-6 py-3 font-nunito font-bold text-marca-oscuro shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <Plus size={20} />
            Registro Rápido
          </button>

          <Link
            to="/reportes"
            className="inline-flex items-center gap-2 rounded-full border-2 border-marca-oscuro px-6 py-3 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
          >
            <ChartColumn size={20} />
            Reportes Generales
          </Link>
        </div>
      </section>

      {/* Contadores */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaContador
          titulo="Dueños"
          valor={mostrar(contadores.duenos)}
          icono={Users}
          colorIcono="bg-marca-naranja/30 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Mascotas"
          valor={mostrar(contadores.mascotas)}
          icono={PawPrint}
          colorIcono="bg-marca-verde/40 text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas atendidas"
          valor={mostrar(contadores.citasAtendidas)}
          icono={CircleCheck}
          colorIcono="bg-marca-beige-verde-claro text-marca-oscuro"
        />
        <TarjetaContador
          titulo="Citas pendientes"
          valor={mostrar(contadores.citasPendientes)}
          icono={Clock}
          colorIcono="bg-marca-coral/25 text-marca-oscuro"
        />
      </section>

      <ModalConsulta
        abierto={modalConsultaAbierto}
        onCerrar={() => setModalConsultaAbierto(false)}
      />

      <RegistroWizard
        abierto={registroAbierto}
        onCerrar={() => setRegistroAbierto(false)}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Calendario citas={datos.citas} />

        <ProximasCitas
          citas={datos.citas}
          cargando={datos.cargando}
          error={datos.error}
        />
      </div>

      {/* Estadísticas */}
      <section className="min-h-80 min-w-0 rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-cafenigga/15">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-verde/40 text-marca-oscuro">
            <ChartColumn size={20} />
          </div>
          <h2 className="font-nunito text-lg font-extrabold text-marca-oscuro">
            Estadísticas
          </h2>
        </div>
        <GraficaCitasSemana
          citas={datos.citas}
          cargando={datos.cargando}
          error={datos.error}
        />
      </section>

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