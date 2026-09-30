import api from "../api/axios";
import type { Dueno } from "../types/dueno";

export const listarDuenosActivos = () => api.get<Dueno[]>("/duenos/activos");
export const agregarDueno = (data: Omit<Dueno, "idDueno">) =>
  api.post<Dueno>("/duenos", data);
export const modificarDueno = (id: number, data: Omit<Dueno, "idDueno">) =>
  api.put(`/duenos/modificar/${id}`, data);
export const anularDueno = (id: number) => api.patch(`/duenos/anular/${id}`);
export const buscarDuenos = (texto: string) =>
  api.get<Dueno[]>("/duenos/buscar", { params: { texto } }); //Filtro para utilizar el formulario
