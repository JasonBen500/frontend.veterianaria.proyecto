import axios from "axios";
import { borrarSesion, leerSesion } from "../utils/sesion";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const sesion = leerSesion();
  if (sesion) {
    config.headers.Authorization = `Bearer ${sesion.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const estado = error.response?.status;
    const esLogin = error.config?.url?.includes("/usuarios/login");

    // 403 = sin permiso para esa acción: no se cierra la sesión
    if (estado === 401 && !esLogin) {
      borrarSesion();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
