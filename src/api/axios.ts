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

export default api;
