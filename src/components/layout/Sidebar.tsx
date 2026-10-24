import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PawPrint,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { secciones, type MenuItem } from "./menuItems";
import { normalizar } from "../../utils/busqueda";
import logazul from "../../assets/images/LogoAzul.png";

const cx = (...clases: (string | false | null | undefined)[]) =>
  clases.filter(Boolean).join(" ");

// ¿La ruta actual es esta página (o una dentro de ella)?
const rutaActiva = (pathname: string, to: string) =>
  to === "/"
    ? pathname === "/"
    : pathname === to || pathname.startsWith(`${to}/`);

// Barrita naranja pegada al borde izquierdo de la opción activa
const BARRA_ACTIVA =
  "before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-marca-naranja before:content-['']";

const visibles = (items: MenuItem[] | undefined, esAdmin: boolean) =>
  (items ?? []).filter((i) => !i.soloAdmin || esAdmin);

/* ---------- Enlace pequeño (submenú y resultados de búsqueda) ---------- */
function EnlaceSecundario({
  item,
  pathname,
}: {
  item: MenuItem;
  pathname: string;
}) {
  const Icono = item.icon;
  const activo = rutaActiva(pathname, item.to);

  return (
    <li>
      <Link
        to={item.to}
        aria-current={activo ? "page" : undefined}
        className={cx(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 font-nunito text-sm font-semibold transition-colors",
          activo
            ? "bg-white/10 text-marca-naranja"
            : "text-white/70 hover:bg-white/10 hover:text-white",
        )}
      >
        <Icono size={16} />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}

/* ---------- Opción del menú desplegado ---------- */
interface ItemExpandidoProps {
  item: MenuItem;
  pathname: string;
  esAdmin: boolean;
  gruposAbiertos: Record<string, boolean>;
  onAlternar: (to: string, abierto: boolean) => void;
}

function ItemExpandido({
  item,
  pathname,
  esAdmin,
  gruposAbiertos,
  onAlternar,
}: ItemExpandidoProps) {
  const Icono = item.icon;
  const hijos = visibles(item.hijos, esAdmin);
  const activo = rutaActiva(pathname, item.to);
  const hijoActivo = hijos.some((h) => rutaActiva(pathname, h.to));
  // Se abre sola si estás dentro de una de sus páginas; tú puedes abrirla/cerrarla
  const desplegado = gruposAbiertos[item.to] ?? hijoActivo;

  return (
    <li>
      <div
        className={cx(
          "relative flex items-center rounded-xl transition-colors",
          activo ? `bg-white/10 ${BARRA_ACTIVA}` : "hover:bg-white/10",
        )}
      >
        <Link
          to={item.to}
          aria-current={activo ? "page" : undefined}
          className={cx(
            "flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 font-nunito text-sm font-bold",
            activo
              ? "text-marca-naranja"
              : hijoActivo
                ? "text-white"
                : "text-white/75 hover:text-white",
          )}
        >
          <Icono size={20} className="shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>

        {hijos.length > 0 && (
          <button
            type="button"
            onClick={() => onAlternar(item.to, !desplegado)}
            aria-expanded={desplegado}
            aria-label={
              desplegado ? `Contraer ${item.label}` : `Desplegar ${item.label}`
            }
            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:text-white"
          >
            <ChevronDown
              size={18}
              className={cx("transition-transform", desplegado && "rotate-180")}
            />
          </button>
        )}
      </div>

      {hijos.length > 0 && desplegado && (
        <ul className="ml-6 mt-1 flex flex-col gap-1 border-l border-white/15 pl-3">
          {hijos.map((hijo) => (
            <EnlaceSecundario key={hijo.to} item={hijo} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ---------- Opción del menú colapsado (solo icono) ---------- */
function ItemColapsado({
  item,
  pathname,
  esAdmin,
}: {
  item: MenuItem;
  pathname: string;
  esAdmin: boolean;
}) {
  const Icono = item.icon;
  const activo =
    rutaActiva(pathname, item.to) ||
    visibles(item.hijos, esAdmin).some((h) => rutaActiva(pathname, h.to));

  return (
    <li>
      <Link
        to={item.to}
        title={item.label}
        aria-label={item.label}
        aria-current={activo ? "page" : undefined}
        className={cx(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
          activo
            ? "bg-white/10 text-marca-naranja"
            : "text-white/70 hover:bg-white/10 hover:text-white",
        )}
      >
        <Icono size={20} />
      </Link>
    </li>
  );
}

/* ---------- Menú lateral ---------- */
function Sidebar() {
  const [abierto, setAbierto] = useState(
    () => localStorage.getItem("sidebar-abierto") !== "false",
  );
  const [busqueda, setBusqueda] = useState("");
  const [gruposAbiertos, setGruposAbiertos] = useState<Record<string, boolean>>(
    {},
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { cerrarSesion, esAdmin, usuario } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebar-abierto", String(abierto));
  }, [abierto]);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  const alternarGrupo = (to: string, nuevoEstado: boolean) =>
    setGruposAbiertos((prev) => ({ ...prev, [to]: nuevoEstado }));

  // Desde el menú colapsado: abre el menú y deja el cursor en el buscador
  const abrirYBuscar = () => {
    setAbierto(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Resultados del buscador: todas las páginas (incluidas las del submenú)
  const texto = normalizar(busqueda);
  const resultados =
    texto === ""
      ? []
      : secciones
        .flatMap((s) => s.items.flatMap((i) => [i, ...(i.hijos ?? [])]))
        .filter(
          (i) =>
            (!i.soloAdmin || esAdmin) && normalizar(i.label).includes(texto),
        );

  const inicial = usuario?.nombre?.charAt(0).toUpperCase() ?? "?";

  return (
    <aside
      className={cx(
        "sticky top-0 flex shrink-0 flex-col overflow-hidden bg-marca- text-white bg-marca-azulmarino shadow-lg shadow-marca-azulmarino/30 transition-[width] duration-200",
        abierto
          ? "h-screen w-72"
          : "m-3 h-[calc(100vh-1.5rem)] w-[4.5rem] rounded-3xl",
      )}
    >
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 -rotate-12 text-white/5"
      />

      {abierto ? (
        <>
          {/* Logo y botón para ocultar */}
          <div className="relative flex items-center justify-between gap-2 px-5 pb-4 pt-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-2xl bg-marca-beigeclaro2 p-1.5 shadow-md">
                <img src={logazul} alt="Logo de la clínica" className="w-9" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate font-nunito text-xl font-extrabold tracking-wide">
                  FIROLAIV
                </p>
                <p className="font-nunito text-xs font-bold text-marca-beigeclaro">
                  Veterinaria
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              title="Ocultar menú"
              aria-label="Ocultar menú"
              className="shrink-0 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>

          {/* Buscador del menú */}
          <div className="relative px-4 pb-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                ref={inputRef}
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setBusqueda("")}
                placeholder="Buscar en el menú..."
                className="w-full rounded-2xl bg-white/10 py-2.5 pl-10 pr-9 font-nunito text-sm font-semibold text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-marca-naranja"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Opciones */}
          <nav className="relative flex-1 overflow-y-auto px-3 pb-4">
            {texto !== "" ? (
              <div className="mt-4">
                <p className="mb-2 px-3 font-nunito text-xs font-extrabold uppercase tracking-wider text-white/45">
                  Resultados
                </p>
                {resultados.length === 0 ? (
                  <p className="px-3 font-nunito text-sm font-semibold text-white/60">
                    No se encontró ninguna página.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {resultados.map((item) => (
                      <EnlaceSecundario
                        key={item.to}
                        item={item}
                        pathname={pathname}
                      />
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              secciones.map((seccion, indice) => (
                <div
                  key={seccion.titulo}
                  className={cx(
                    "mt-4",
                    indice > 0 && "border-t border-white/10 pt-4",
                  )}
                >
                  <p className="mb-2 px-3 font-nunito text-xs font-extrabold uppercase tracking-wider text-white/45">
                    {seccion.titulo}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {visibles(seccion.items, esAdmin).map((item) => (
                      <ItemExpandido
                        key={item.to}
                        item={item}
                        pathname={pathname}
                        esAdmin={esAdmin}
                        gruposAbiertos={gruposAbiertos}
                        onAlternar={alternarGrupo}
                      />
                    ))}
                  </ul>
                </div>
              ))
            )}
          </nav>

          {/* Usuario, cerrar sesión y copyright */}
          <div className="relative border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-marca-naranja font-nunito text-lg font-extrabold text-marca-oscuro">
                {inicial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-nunito text-sm font-extrabold">
                  {usuario?.nombre}
                </p>
                <p className="truncate font-nunito text-xs font-semibold text-white/60">
                  {usuario?.nombrePerfil}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                className="shrink-0 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            </div>
            <p className="mt-3 text-center font-nunito text-xs font-semibold text-white/40">
              ©{new Date().getFullYear()} Firolaiv Veterinaria
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Menú colapsado: solo iconos */}
          <div className="relative flex flex-col items-center gap-3 py-5">
            <div className="rounded-2xl bg-marca-beigeclaro2 p-1.5 shadow-md">
              <img src={logazul} alt="Logo de la clínica" className="w-7" />
            </div>
            <button
              type="button"
              onClick={() => setAbierto(true)}
              title="Mostrar menú"
              aria-label="Mostrar menú"
              className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <PanelLeftOpen size={20} />
            </button>
          </div>

          <div className="relative flex justify-center pb-2">
            <button
              type="button"
              onClick={abrirYBuscar}
              title="Buscar en el menú"
              aria-label="Buscar en el menú"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-colors hover:text-white"
            >
              <Search size={20} />
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col items-center gap-2 overflow-y-auto py-2">
            {secciones.map((seccion, indice) => (
              <div key={seccion.titulo} className="flex flex-col items-center gap-2">
                {indice > 0 && <div className="my-1 h-px w-8 bg-white/15" />}
                <ul className="flex flex-col items-center gap-2">
                  {visibles(seccion.items, esAdmin).map((item) => (
                    <ItemColapsado
                      key={item.to}
                      item={item}
                      pathname={pathname}
                      esAdmin={esAdmin}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="relative flex flex-col items-center gap-2 border-t border-white/10 py-4">
            <div
              title={usuario?.nombre}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-naranja font-nunito text-lg font-extrabold text-marca-oscuro"
            >
              {inicial}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut size={20} />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;