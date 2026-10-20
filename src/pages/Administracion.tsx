import { Link } from "react-router-dom";
import {
  Syringe,
  UserPlus,
  FileUser,
  Stethoscope,
  HomeIcon,
  ChevronRight,
} from "lucide-react";
import logazul from "../assets/images/LogoAzul.png";



function Administracion() {
  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">

      <div className="mb-5 flex items-center justify-between min-h-8 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-nunito font-extrabold text-marca-oscuro md:text-4xl">
            Administración
          </h1>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-nunito font-bold text-marca-oscuro/70 hover:text-marca-oscuro transition-colors"
            >
              <HomeIcon size={15} />
            </Link>

            <Link
              to="/administracion"
              className="flex items-center gap-1 text-sm font-nunito font-bold text-marca-oscuro transition-colors"
            >
              <ChevronRight size={15} className="text-marca-oscuro/50" />
              Administración
            </Link>
          </div>
        </div>

        <img
          src={logazul}
          alt="Logo de la clínica"
          className="w-20"
        />
      </div>


      <div className=" p-4 grid grid-cols-2 grid-rows-2 gap-4 rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-6 shadow-sm">

        <Link
          to="/tratamientos"
          className="mt-9 mb-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-marca-beigeclaro2 hover:border-cyan-400 hover:scale-[0.98]"
        >
          <Syringe size={120} className="text-gray-800" strokeWidth={1.5} />
          <span className="text-lg font-nunito font-bold text-gray-600 uppercase tracking-wide">
            Tratamientos
          </span>
        </Link>

        <Link
          to="/perfiles"
          className="mt-9 mb-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-marca-beigeclaro2 hover:border-cyan-400 hover:scale-[0.98]"
        >
          <UserPlus size={120} className="text-gray-800" strokeWidth={1.5} />
          <span className="text-lg font-nunito font-bold text-gray-600 uppercase tracking-wide">
            Perfiles
          </span>
        </Link>

        <Link
          to="/usuarios"
          className="flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-marca-beigeclaro2 hover:border-cyan-400 hover:scale-[0.98]"
        >
          <FileUser size={120} className="text-gray-800" strokeWidth={1.5} />
          <span className="text-lg font-nunito font-bold text-gray-600 uppercase tracking-wide">
            Usuarios
          </span>
        </Link>

        <Link
          to="/medicos"
          className="flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-marca-beigeclaro2 hover:border-cyan-400 hover:scale-[0.98]"
        >
          <Stethoscope size={120} className="text-gray-800" strokeWidth={1.5} />
          <span className="text-lg font-nunito font-bold text-gray-600 uppercase tracking-wide">
            Médicos
          </span>
        </Link>

      </div>

    </div>
  );
}

export default Administracion;