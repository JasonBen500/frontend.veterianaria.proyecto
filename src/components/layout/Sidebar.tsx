import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { menuItems } from "./menuItems";

const cx = (...clases: (string | false)[]) => clases.filter(Boolean).join(" ");

// Las dos esquinas curvas que unen la pestaña activa con el contenido de la página
const curvasPestana =
  "before:absolute before:-top-5 before:right-0 before:h-5 before:w-5 before:content-[''] before:rounded-br-[20px] before:shadow-[5px_5px_0_5px_var(--color-marca-beige-claro)] " +
  "after:absolute after:-bottom-5 after:right-0 after:h-5 after:w-5 after:content-[''] after:rounded-tr-[20px] after:shadow-[5px_-5px_0_5px_var(--color-marca-beige-claro)]";

function Sidebar() {
  const [abierto, setAbierto] = useState(
    () => localStorage.getItem("sidebar-abierto") !== "false",
  );
  const { cerrarSesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("sidebar-abierto", String(abierto));
  }, [abierto]);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <aside
      className={cx(
        "sticky top-0 flex shrink-0 flex-col bg-marca-oscuro text-white transition-all duration-75",
        abierto
          ? "h-screen w-64"
          : "m-3 h-[calc(100vh-1.5rem)] w-16 rounded-full",
      )}
    >
      {/* Encabezado: título y botón para abrir/cerrar */}
      <div
        className={cx(
          "flex items-center py-6",
          abierto ? "justify-between px-5" : "justify-center",
        )}
      >
        {abierto && (
          <span className="font-nunito text-xl font-extrabold tracking-wide">
            FIROLAIV
          </span>
        )}
        <button
          onClick={() => setAbierto(!abierto)}
          title={abierto ? "Ocultar menú" : "Mostrar menú"}
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          {abierto ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      {/* Opciones del menú */}
      <nav
        className={cx(
          "flex flex-1 flex-col",
          abierto ? "gap-1 pl-3" : "items-center gap-2",
        )}
      >
        {menuItems.map(({ to, label, icon: Icono }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={abierto ? undefined : label}
            className={({ isActive }) =>
              abierto
                ? cx(
                    "relative flex items-center gap-3 rounded-l-full py-3 pl-5 text-sm font-semibold transition-colors",
                    isActive
                      ? `bg-marca-beige-claro text-marca-oscuro ${curvasPestana}`
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )
                : cx(
                    "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                    isActive
                      ? "bg-black/30 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )
            }
          >
            <Icono size={20} />
            {abierto && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Cerrar sesión, siempre al final */}
      <div
        className={cx(
          "border-t border-white/15 py-4",
          abierto ? "px-5" : "flex justify-center",
        )}
      >
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className={cx(
            "flex items-center gap-3 rounded-xl text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white",
            abierto ? "w-full px-3 py-3" : "h-11 w-11 justify-center",
          )}
        >
          <LogOut size={20} />
          {abierto && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;