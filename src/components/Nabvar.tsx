import { NavLink } from "react-router-dom";

const enlaces = [
  { to: "/duenos", label: "Dueños" },
  { to: "/mascotas", label: "Mascotas" },
  { to: "/citas", label: "Citas" },
  { to: "/consultas", label: "Consultas" },
  { to: "/detalle-citas", label: "Detalle Citas" },
  { to: "/medicamentos", label: "Medicamentos" },
  { to: "/tratamientos", label: "Tratamientos" },
  { to: "/medicos", label: "Médicos" },
  { to: "/usuarios", label: "Usuarios" },
  { to: "/perfiles", label: "Perfiles" },
];

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-3 shadow">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
        <span className="font-bold text-lg mr-4">🐾 Veterinaria</span>
        {enlaces.map((e) => (
          <NavLink
            key={e.to}
            to={e.to}
            className={({ isActive }) =>
              `text-sm px-2 py-1 rounded hover:bg-blue-600 transition ${
                isActive ? "bg-blue-800 font-semibold" : ""
              }`
            }
          >
            {e.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
