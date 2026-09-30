import api from "../api/axios";
import type { Medicamentos } from "../types/medicamentos";

export const listarMedicamentosActivos = () =>
  api.get<Medicamentos[]>("/medicamentos/activos");
export const agregarMedicamento = (data: Omit<Medicamentos, "idMedicamento">) =>
  api.post("/medicamentos", data);
export const modificarMedicamento = (
  id: number,
  data: Omit<Medicamentos, "idMedicamento">,
) => api.put(`/medicamentos/${id}`, data);
export const anularMedicamento = (id: number) =>
  api.patch(`/medicamentos/${id}/anular`);
