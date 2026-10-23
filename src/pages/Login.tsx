import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  PawPrint,
  Dog,
  Cat,
  Bone,
  HeartPulse,
  Stethoscope,
  CalendarHeart,
  Pill,
} from "lucide-react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import logoOriginal from "../assets/images/LogoOriginal.png";
import logoazul from "../assets/images/LogoAzul.png";

function LoginPage() {
  const [form, setForm] = useState({ usuario: "", contrasena: "" });
  const [error, setError] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const respuesta = await login(form);
      iniciarSesion(respuesta.data);
      navigate("/duenos");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje ?? "Error al iniciar sesión");
      } else {
        setError("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-marca-beige-claro lg:grid-cols-2">
      {/* Panel de marca (solo pantallas grandes) */}
      <aside className="relative hidden items-center justify-center overflow-hidden bg-marca-oscuro p-12 lg:flex">
        <PawPrint
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 -top-10 h-72 w-72 rotate-12 text-white/5"
        />
        <PawPrint
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-8 h-80 w-80 -rotate-12 text-white/5"
        />
        <Dog
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 left-10 h-24 w-24 -rotate-6 text-marca-verde/30"
        />
        <Cat
          aria-hidden="true"
          className="pointer-events-none absolute right-12 top-16 h-24 w-24 rotate-6 text-marca-naranja/30"
        />
        <Bone
          aria-hidden="true"
          className="pointer-events-none absolute right-24 top-1/2 h-16 w-16 rotate-45 text-white/10"
        />

        <div className="relative flex max-w-md flex-col items-center gap-8 text-center">
          <div className="rounded-3xl bg-marca-beigeclaro2 p-6 shadow-lg shadow-marca-azulmarino/40">
            <img src={logoazul} alt="Logo de la clínica" className="w-40" />
          </div>

          <div className="space-y-3">
            <h2 className="font-nunito text-4xl font-extrabold text-white">
              ¡Pon Sus Patas En Buenas Manos!
            </h2>
            <p className="font-nunito text-lg font-semibold text-white/70">
              Gestiona citas, consultas y pacientes en un solo lugar.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-marca-naranja px-4 py-2 font-nunito text-sm font-extrabold text-marca-oscuro">
              <Stethoscope size={16} />
              Consultas
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-marca-verde px-4 py-2 font-nunito text-sm font-extrabold text-marca-oscuro">
              <CalendarHeart size={16} />
              Citas
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-marca-coral px-4 py-2 font-nunito text-sm font-extrabold text-marca-oscuro">
              <Pill size={16} />
              Medicamentos
            </span>
          </div>
        </div>
      </aside>

      {/* Formulario */}
      <main className="relative flex items-center justify-center overflow-hidden p-6">
        <PawPrint
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-6 h-24 w-24 -rotate-12 text-marca-oscuro/5"
        />
        <Bone
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-6 h-20 w-20 rotate-45 text-marca-naranja/20"
        />

        <div className="relative w-full max-w-md rounded-3xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-8 shadow-lg shadow-marca-cafenigga/15">
          <img
            src={logoOriginal}
            alt="Firolaiv Veterinaria"
            className="mx-auto mb-4 w-48"
          />

          <div className="mb-6 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-marca-naranja/30 px-4 py-1 font-nunito text-xs font-extrabold uppercase tracking-wide text-marca-oscuro">
              <HeartPulse size={14} />
              Acceso al sistema
            </span>
            <h1 className="font-nunito text-3xl font-extrabold text-marca-oscuro">
              ¡Bienvenido!
            </h1>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-full border border-red-200 bg-red-50 px-5 py-3 font-nunito text-sm font-semibold text-red-700"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-marca-oscuro/50"
              />
              <input
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                placeholder="Usuario"
                autoComplete="username"
                className="w-full rounded-2xl border border-marca-oscuro/20 bg-white py-4 pl-12 pr-5 font-nunito text-lg font-semibold text-marca-oscuro shadow-sm placeholder:text-marca-oscuro/40 focus:outline-none focus:ring-2 focus:ring-marca-naranja"
              />
            </div>

            <div className="relative">
              <Lock
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-marca-oscuro/50"
              />
              <input
                type={verContrasena ? "text" : "password"}
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                placeholder="Contraseña"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-marca-oscuro/20 bg-white py-4 pl-12 pr-12 font-nunito text-lg font-semibold text-marca-oscuro shadow-sm placeholder:text-marca-oscuro/40 focus:outline-none focus:ring-2 focus:ring-marca-naranja"
              />
              <button
                type="button"
                onClick={() => setVerContrasena((v) => !v)}
                aria-label={
                  verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-marca-oscuro/50 transition hover:text-marca-oscuro"
              >
                {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-marca-oscuro py-3 font-nunito text-xl font-extrabold text-marca-blanco shadow-md transition hover:-translate-y-0.5 hover:bg-marca-naranja hover:text-marca-oscuro"
            >
              <LogIn size={22} />
              Ingresar
            </button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-2 font-nunito text-sm font-bold text-marca-oscuro/60 lg:hidden">
            <PawPrint size={16} />
            ¡Pon Sus Patas En Buenas Manos!
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;