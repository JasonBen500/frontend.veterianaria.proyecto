import api from "../api/axios";
import type { Medico } from "../types/medico";

export const listarMedicosActivos = () => api.get<Medico[]>("/medicos/activos");
export const agregarMedico = (data: Omit<Medico, "idMedico">) =>
  api.post("/medicos", data);
export const modificarMedico = (id: number, data: Omit<Medico, "idMedico">) =>
  api.put(`/medicos/${id}`, data);
export const anularMedico = (id: number) => api.patch(`/medicos/${id}/anular`);
