import api from "../api/axios";
import type { Mascota } from "../types/mascota";

export const listarMascotasActivas = () =>
  api.get<Mascota[]>("/mascotas/activas");
export const agregarMascota = (data: Omit<Mascota, "idMascota">) =>
  api.post("/mascotas", data);
export const modificarMascota = (
  id: number,
  data: Omit<Mascota, "idMascota">,
) => api.put(`/mascotas/${id}`, data);
export const anularMascota = (id: number) =>
  api.patch(`/mascotas/${id}/anular`);
