import api from "../api/axios";
import type { Consulta } from "../types/consulta";

export const listarConsultasActivas = () =>
  api.get<Consulta[]>("/consultas/activas");
export const agregarConsulta = (data: Omit<Consulta, "idConsulta">) =>
  api.post("/consultas", data);
export const modificarConsulta = (
  id: number,
  data: Omit<Consulta, "idConsulta">,
) => api.put(`/consultas/${id}`, data);
export const anularConsulta = (id: number) =>
  api.patch(`/consultas/${id}/anular`);
