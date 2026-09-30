import api from "../api/axios";
import type { Tratamiento } from "../types/tratamiento";

export const listarTratamientosActivos = () =>
  api.get<Tratamiento[]>("/tratamientos/activos");
export const agregarTratamiento = (data: Omit<Tratamiento, "idTratamiento">) =>
  api.post("/tratamientos", data);
export const modificarTratamiento = (
  id: number,
  data: Omit<Tratamiento, "idTratamiento">,
) => api.put(`/tratamientos/${id}`, data);
export const anularTratamiento = (id: number) =>
  api.patch(`/tratamientos/${id}/anular`);
