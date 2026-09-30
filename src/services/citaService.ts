import api from "../api/axios";
import type { Cita } from "../types/cita";

export const listarCitasActivas = () => api.get<Cita[]>("/citas/activas");
export const agregarCita = (data: Omit<Cita, "idCita">) =>
  api.post("/citas", data);
export const modificarCita = (id: number, data: Omit<Cita, "idCita">) =>
  api.put(`/citas/${id}`, data);
export const anularCita = (id: number) => api.patch(`/citas/${id}/anular`);
