import api from "../api/axios";
import type { Usuarios } from "../types/usuarios";

export const listarUsuariosActivos = () =>
  api.get<Usuarios[]>("/usuarios/activos");
export const agregarUsuario = (data: Omit<Usuarios, "idUsuario">) =>
  api.post("/usuarios", data);
export const modificarUsuario = (
  id: number,
  data: Omit<Usuarios, "idUsuario">,
) => api.put(`/usuarios/${id}`, data);
export const anularUsuario = (id: number) =>
  api.patch(`/usuarios/${id}/anular`);
