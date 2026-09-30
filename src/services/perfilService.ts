import api from "../api/axios";
import type { Perfil } from "../types/perfil";

export const listarPerfilesActivos = () =>
  api.get<Perfil[]>("/perfiles/activos");
export const agregarPerfil = (data: Omit<Perfil, "idPerfil">) =>
  api.post("/perfiles", data);
export const modificarPerfil = (id: number, data: Omit<Perfil, "idPerfil">) =>
  api.put(`/perfiles/${id}`, data);
export const anularPerfil = (id: number) => api.patch(`/perfiles/${id}/anular`);
