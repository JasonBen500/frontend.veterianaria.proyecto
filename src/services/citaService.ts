import api from "../api/axios";
import type { Cita } from "../types/cita";
import type { HojaCita } from "../types/hoja";

export const listarCitasActivas = () => api.get<Cita[]>("/citas/activas");
export const agregarCita = (data: Omit<Cita, "idCita">) =>
  api.post<Cita>("/citas", data);
export const modificarCita = (id: number, data: Omit<Cita, "idCita">) =>
  api.put(`/citas/${id}`, data);
export const anularCita = (id: number) => api.patch(`/citas/${id}/anular`);

export const eliminarCita = (id: number) => api.delete(`/citas/${id}`);
export const listarCitasTodas = () => api.get<Cita[]>("/citas");

export const obtenerUnaCita = (id: number) => api.get<Cita>(`/citas/${id}`);

export const obtenerHojaCita = (id: number) =>
  api.get<HojaCita>(`/citas/${id}/hoja`);