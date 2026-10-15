import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import loginBg from "../assets/images/Login.jpeg";
import logoOriginal from "../assets/images/LogoOriginal.png";
import usuarioicon from "../assets/images/iconos/Usuario.png";
import candadoicon from "../assets/images/iconos/Candado.png";
import logoazul from "../assets/images/LogoAzul.png";

function LoginPage() {
  const [form, setForm] = useState({ usuario: "", contrasena: "" });
  const [error, setError] = useState("");
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
    <div
      className="min-h-screen w-full md:grid md:grid-cols-2 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="hidden md:block" />
      {/* Mitad derecha: panel azul sólido con el formulario flotando encima */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl">
          <img
            src={logoOriginal}
            alt="Firolaiv Veterinaria"
            className="w-200 mx-auto mb-0"
          />
          <h1 className="text-4xl font-nunito font-extrabold text-marca-oscuro mt-2 mb-2 text-center">
            ¡ BIENVENIDO !
          </h1>

          {error && (
            <p className="mb-4 p-3 rounded-full border text-sm bg-red-50 text-red-700 border-red-200 px-5">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-7 max-w-[700px] mx-auto"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <img
                  src={usuarioicon}
                  alt="Icono Usuario"
                  className="w-8 h-8 opacity-50"
                />
              </span>
              <input
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                placeholder="Usuario"
                className="w-full rounded-2xl bg-white pl-12 pr-5 py-4 text-xl font-nunito text-gray-700 border-1 border-marca-oscuro placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-white"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <img
                  src={candadoicon}
                  alt="Icono Candado"
                  className="w-8 h-8 opacity-50"
                />
              </span>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                placeholder="Contraseña"
                className="w-full mb-2 rounded-2xl bg-white pl-12 pr-5 py-4 text-xl font-nunito text-gray-700 border-1 border-marca-oscuro placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              className="w-full mb-10 bg-marca-oscuro text-marca-blanco font-nunito font-extrabold text-xl py-3 rounded-full hover:bg-marca-naranja hover:text-marca-oscuro transition mt-6"
            >
              Ingresar
            </button>

            <h1 className="flex items-center justify-center gap-4 mt-15">
              <img src={logoazul} 
                  alt="Logo Azul" 
                  className="w-30" />
              <span className="text-xl font-bold text-marca-oscuro">
                ¡Pon Sus Patas En Buenas Manos!
              </span>
            </h1>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
