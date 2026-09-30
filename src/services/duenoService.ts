import api from "../api/axios";
import type { Dueno } from "../types/dueno";

export const listarDuenosActivos = () => api.get<Dueno[]>("/duenos/activos");
export const agregarDueno = (data: Omit<Dueno, "idDueno">) =>
  api.post("/duenos", data);
export const modificarDueno = (id: number, data: Omit<Dueno, "idDueno">) =>
  api.put(`/duenos/modificar/${id}`, data);
export const anularDueno = (id: number) => api.patch(`/duenos/anular/${id}`);
