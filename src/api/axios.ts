import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const guardado = localStorage.getItem("usuario");
  if (guardado) {
    const usuario = JSON.parse(guardado);
    config.headers.Authorization = `Bearer ${usuario.token}`;
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
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
